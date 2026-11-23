import type { SQLiteDatabase } from 'expo-sqlite';

import { loadReviewQueue } from './local-srs';
import { supabase } from './supabase';

const VIETNAM_OFFSET_MS = 7 * 60 * 60 * 1000;
const STREAK_LOOKBACK_DAYS = 730;
const PAGE_SIZE = 1000;

export type DashboardStats = {
  streakDays: number;
  dueCards: number;
  totalCards: number;
  learnedCards: number;
  syncWarning: string | null;
};

export function vietnamDateKey(value: string | Date): string | null {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Date(date.getTime() + VIETNAM_OFFSET_MS).toISOString().slice(0, 10);
}

function previousDateKey(dateKey: string): string {
  const date = new Date(`${dateKey}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

export function calculateStudyStreak(
  reviewedAt: readonly string[],
  now: Date,
): number {
  const studiedDays = new Set(
    reviewedAt
      .map(vietnamDateKey)
      .filter((dateKey): dateKey is string => dateKey !== null),
  );
  const today = vietnamDateKey(now);
  if (!today) return 0;

  let currentDay = studiedDays.has(today) ? today : previousDateKey(today);
  if (!studiedDays.has(currentDay)) return 0;

  let streak = 0;
  while (studiedDays.has(currentDay)) {
    streak += 1;
    currentDay = previousDateKey(currentDay);
  }
  return streak;
}

export function learningProgressPercent(learnedCards: number, totalCards: number): number {
  if (totalCards <= 0) return 0;
  return Math.round((Math.min(Math.max(learnedCards, 0), totalCards) / totalCards) * 100);
}

export async function loadDashboardStats(
  db: SQLiteDatabase,
  userId: string,
  now = new Date(),
): Promise<DashboardStats> {
  if (!supabase) {
    throw new Error('Chưa cấu hình Supabase để tải tiến độ học.');
  }

  const queue = await loadReviewQueue(db, userId);
  const nowIso = now.toISOString();
  const streakStart = new Date(
    now.getTime() - STREAK_LOOKBACK_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const [totalResult, learnedResult, dueResult] = await Promise.all([
    supabase
      .from('user_cards')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('user_cards')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .neq('state', 0),
    supabase
      .from('user_cards')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .neq('state', 0)
      .lte('due_at', nowIso),
  ]);

  if (totalResult.error) {
    throw new Error(`Không tải được tổng số thẻ: ${totalResult.error.message}`);
  }
  if (learnedResult.error) {
    throw new Error(`Không tải được tiến độ thẻ: ${learnedResult.error.message}`);
  }
  if (dueResult.error) {
    throw new Error(`Không tải được số thẻ đến hạn: ${dueResult.error.message}`);
  }

  const remoteReviewDates: string[] = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await supabase
      .from('review_logs')
      .select('reviewed_at')
      .eq('user_id', userId)
      .gte('reviewed_at', streakStart)
      .order('reviewed_at', { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      throw new Error(`Không tải được lịch sử học: ${error.message}`);
    }

    const page = data ?? [];
    remoteReviewDates.push(...page.map((row) => row.reviewed_at));
    if (page.length < PAGE_SIZE) break;
  }

  const localReviewDates = await db.getAllAsync<{ reviewed_at: string }>(
    `SELECT reviewed_at
       FROM srs_review_outbox
      WHERE user_id = ? AND reviewed_at >= ?`,
    userId,
    streakStart,
  );

  return {
    streakDays: calculateStudyStreak(
      [...remoteReviewDates, ...localReviewDates.map((row) => row.reviewed_at)],
      now,
    ),
    dueCards: dueResult.count ?? 0,
    totalCards: totalResult.count ?? 0,
    learnedCards: learnedResult.count ?? 0,
    syncWarning: queue.syncWarning,
  };
}
