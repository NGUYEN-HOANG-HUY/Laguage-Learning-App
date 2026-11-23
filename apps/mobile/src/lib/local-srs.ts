import type { SQLiteDatabase } from 'expo-sqlite';
import { createEmptyCard, State, type Card } from 'ts-fsrs';

import { supabase } from './supabase';
import {
  buildReviewQueue,
  DEFAULT_NEW_CARDS_PER_DAY,
  FSRS_ALGORITHM_VERSION,
  MAX_NEW_CARDS_PER_DAY,
  reviewFsrsCard,
  type QueueCard,
  type ReviewRating,
} from './srs';

type RemoteQueueCard = {
  id: string;
  user_id: string;
  item_id: string;
  state: number;
  stability: number | null;
  difficulty: number | null;
  learning_step: number;
  scheduled_days: number;
  due_at: string;
  last_review: string | null;
  reps: number;
  lapses: number;
  fsrs_version: string;
  created_at: string;
};

type RemoteVocabItem = {
  id: string;
  lang: string;
  lemma: string;
  reading: string | null;
  gloss_vi: string;
};

export type LocalReviewCard = QueueCard & {
  userId: string;
  itemId: string;
  language: string;
  lemma: string;
  reading: string | null;
  meaning: string;
  card: Card;
};

type PendingReview = {
  user_id: string;
  card_id: string;
  reviewed_at: string;
  rating: number;
  previous_state: number;
  previous_stability: number | null;
  previous_difficulty: number | null;
  duration_ms: number | null;
  state_json: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseRemoteQueueCards(value: unknown): RemoteQueueCard[] {
  if (!Array.isArray(value)) {
    throw new Error('Supabase returned an invalid review queue.');
  }

  return value.map((entry) => {
    if (
      !isRecord(entry) ||
      typeof entry.id !== 'string' ||
      typeof entry.user_id !== 'string' ||
      typeof entry.item_id !== 'string' ||
      typeof entry.state !== 'number' ||
      typeof entry.due_at !== 'string' ||
      typeof entry.created_at !== 'string' ||
      typeof entry.learning_step !== 'number' ||
      typeof entry.scheduled_days !== 'number' ||
      typeof entry.reps !== 'number' ||
      typeof entry.lapses !== 'number'
    ) {
      throw new Error('Supabase returned a malformed card in the review queue.');
    }

    return {
      id: entry.id,
      user_id: entry.user_id,
      item_id: entry.item_id,
      state: entry.state,
      stability: typeof entry.stability === 'number' ? entry.stability : null,
      difficulty: typeof entry.difficulty === 'number' ? entry.difficulty : null,
      learning_step: entry.learning_step,
      scheduled_days: entry.scheduled_days,
      due_at: entry.due_at,
      last_review: typeof entry.last_review === 'string' ? entry.last_review : null,
      reps: entry.reps,
      lapses: entry.lapses,
      fsrs_version:
        typeof entry.fsrs_version === 'string'
          ? entry.fsrs_version
          : FSRS_ALGORITHM_VERSION,
      created_at: entry.created_at,
    };
  });
}

function parseRemoteVocab(value: unknown): RemoteVocabItem[] {
  if (!Array.isArray(value)) {
    throw new Error('Supabase returned invalid lesson content.');
  }

  return value.map((entry) => {
    if (
      !isRecord(entry) ||
      typeof entry.id !== 'string' ||
      typeof entry.lang !== 'string' ||
      typeof entry.lemma !== 'string' ||
      typeof entry.gloss_vi !== 'string'
    ) {
      throw new Error('Supabase returned malformed lesson content.');
    }
    return {
      id: entry.id,
      lang: entry.lang,
      lemma: entry.lemma,
      reading: typeof entry.reading === 'string' ? entry.reading : null,
      gloss_vi: entry.gloss_vi,
    };
  });
}

function parseFsrsCard(json: string): Card {
  const parsed: unknown = JSON.parse(json);
  if (
    !isRecord(parsed) ||
    typeof parsed.due !== 'string' ||
    typeof parsed.state !== 'number' ||
    typeof parsed.stability !== 'number' ||
    typeof parsed.difficulty !== 'number' ||
    typeof parsed.elapsed_days !== 'number' ||
    typeof parsed.scheduled_days !== 'number' ||
    typeof parsed.learning_steps !== 'number' ||
    typeof parsed.reps !== 'number' ||
    typeof parsed.lapses !== 'number' ||
    (parsed.last_review !== undefined &&
      parsed.last_review !== null &&
      typeof parsed.last_review !== 'string')
  ) {
    throw new Error('Local review data is invalid and cannot be scheduled.');
  }

  if (![State.New, State.Learning, State.Review, State.Relearning].includes(parsed.state)) {
    throw new Error('Local review data has an unsupported FSRS state.');
  }

  return {
    due: new Date(parsed.due),
    state: parsed.state,
    stability: parsed.stability,
    difficulty: parsed.difficulty,
    elapsed_days: parsed.elapsed_days,
    scheduled_days: parsed.scheduled_days,
    learning_steps: parsed.learning_steps,
    reps: parsed.reps,
    lapses: parsed.lapses,
    ...(typeof parsed.last_review === 'string'
      ? { last_review: new Date(parsed.last_review) }
      : {}),
  };
}

function cardFromRemote(remote: RemoteQueueCard): Card {
  const blank = createEmptyCard(new Date(remote.created_at));
  const state = remote.state;
  if (![State.New, State.Learning, State.Review, State.Relearning].includes(state)) {
    throw new Error(`Card ${remote.id} has an unsupported FSRS state.`);
  }

  return {
    ...blank,
    due: new Date(remote.due_at),
    state,
    stability: remote.stability ?? 0,
    difficulty: remote.difficulty ?? 0,
    scheduled_days: remote.scheduled_days,
    learning_steps: remote.learning_step,
    reps: remote.reps,
    lapses: remote.lapses,
    ...(remote.last_review ? { last_review: new Date(remote.last_review) } : {}),
  };
}

function toLocalCard(
  remote: RemoteQueueCard,
  vocab: RemoteVocabItem,
): LocalReviewCard {
  const card = cardFromRemote(remote);
  return {
    id: remote.id,
    userId: remote.user_id,
    itemId: remote.item_id,
    language: vocab.lang,
    lemma: vocab.lemma,
    reading: vocab.reading,
    meaning: vocab.gloss_vi,
    state: card.state,
    dueAt: card.due.toISOString(),
    card,
  };
}

export async function initializeLocalSrs(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS srs_local_cards (
      user_id TEXT NOT NULL,
      card_id TEXT NOT NULL,
      item_id TEXT NOT NULL,
      language TEXT NOT NULL,
      lemma TEXT NOT NULL,
      reading TEXT,
      meaning TEXT NOT NULL,
      state INTEGER NOT NULL,
      due_at TEXT NOT NULL,
      card_json TEXT NOT NULL,
      PRIMARY KEY (user_id, card_id)
    );
    CREATE TABLE IF NOT EXISTS srs_review_outbox (
      user_id TEXT NOT NULL,
      card_id TEXT NOT NULL,
      reviewed_at TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 4),
      previous_state INTEGER NOT NULL,
      previous_stability REAL,
      previous_difficulty REAL,
      duration_ms INTEGER,
      state_json TEXT NOT NULL,
      synced INTEGER NOT NULL DEFAULT 0 CHECK (synced IN (0, 1)),
      PRIMARY KEY (user_id, card_id, reviewed_at)
    );
    CREATE TABLE IF NOT EXISTS srs_local_settings (
      user_id TEXT PRIMARY KEY,
      new_cards_per_day INTEGER NOT NULL CHECK (new_cards_per_day BETWEEN 0 AND 15)
    );
    CREATE INDEX IF NOT EXISTS srs_outbox_pending_idx
      ON srs_review_outbox (user_id, synced, reviewed_at);
  `);
}

function vietnamDayStart(now: Date): string {
  const vietnamNow = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const midnightUtc = Date.UTC(
    vietnamNow.getUTCFullYear(),
    vietnamNow.getUTCMonth(),
    vietnamNow.getUTCDate(),
  );
  return new Date(midnightUtc - 7 * 60 * 60 * 1000).toISOString();
}

async function loadLocalCards(
  db: SQLiteDatabase,
  userId: string,
): Promise<LocalReviewCard[]> {
  const rows = await db.getAllAsync<{
    user_id: string;
    card_id: string;
    item_id: string;
    language: string;
    lemma: string;
    reading: string | null;
    meaning: string;
    state: number;
    due_at: string;
    card_json: string;
  }>(
    `SELECT user_id, card_id, item_id, language, lemma, reading, meaning,
            state, due_at, card_json
       FROM srs_local_cards
      WHERE user_id = ?
      ORDER BY due_at, card_id`,
    userId,
  );

  return rows.map((row) => ({
    id: row.card_id,
    userId: row.user_id,
    itemId: row.item_id,
    language: row.language,
    lemma: row.lemma,
    reading: row.reading,
    meaning: row.meaning,
    state: row.state,
    dueAt: row.due_at,
    card: parseFsrsCard(row.card_json),
  }));
}

async function upsertLocalCard(
  db: SQLiteDatabase,
  card: LocalReviewCard,
): Promise<void> {
  await db.runAsync(
    `INSERT INTO srs_local_cards
       (user_id, card_id, item_id, language, lemma, reading, meaning, state, due_at, card_json)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT (user_id, card_id) DO UPDATE SET
       item_id = excluded.item_id,
       language = excluded.language,
       lemma = excluded.lemma,
       reading = excluded.reading,
       meaning = excluded.meaning,
       state = excluded.state,
       due_at = excluded.due_at,
       card_json = excluded.card_json`,
    card.userId,
    card.id,
    card.itemId,
    card.language,
    card.lemma,
    card.reading,
    card.meaning,
    card.state,
    card.dueAt,
    JSON.stringify(card.card),
  );
}

async function pendingReviews(
  db: SQLiteDatabase,
  userId: string,
): Promise<PendingReview[]> {
  return db.getAllAsync<PendingReview>(
    `SELECT user_id, card_id, reviewed_at, rating, previous_state,
            previous_stability, previous_difficulty, duration_ms, state_json
       FROM srs_review_outbox
      WHERE user_id = ? AND synced = 0
      ORDER BY reviewed_at, card_id`,
    userId,
  );
}

async function syncPendingReviews(
  db: SQLiteDatabase,
  userId: string,
): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase chưa được cấu hình; lượt ôn vẫn nằm an toàn trên máy.');
  }

  const pending = await pendingReviews(db, userId);
  for (const review of pending) {
    const card = parseFsrsCard(review.state_json);
    const { error: logError } = await supabase.from('review_logs').upsert(
      {
        user_id: review.user_id,
        card_id: review.card_id,
        reviewed_at: review.reviewed_at,
        rating: review.rating,
        prev_state: review.previous_state,
        prev_stability: review.previous_stability,
        prev_difficulty: review.previous_difficulty,
        duration_ms: review.duration_ms,
        fsrs_version: FSRS_ALGORITHM_VERSION,
      },
      { onConflict: 'user_id,card_id,reviewed_at', ignoreDuplicates: true },
    );
    if (logError) throw new Error(`Không đồng bộ được review log: ${logError.message}`);

    const { error: cardError } = await supabase
      .from('user_cards')
      .update({
        state: card.state,
        stability: card.stability,
        difficulty: card.difficulty,
        learning_step: card.learning_steps,
        scheduled_days: card.scheduled_days,
        due_at: card.due.toISOString(),
        last_review: card.last_review?.toISOString() ?? null,
        reps: card.reps,
        lapses: card.lapses,
        fsrs_version: FSRS_ALGORITHM_VERSION,
      })
      .eq('id', review.card_id)
      .eq('user_id', userId);
    if (cardError) throw new Error(`Không đồng bộ được trạng thái thẻ: ${cardError.message}`);

    await db.runAsync(
      `UPDATE srs_review_outbox
          SET synced = 1
        WHERE user_id = ? AND card_id = ? AND reviewed_at = ?`,
      userId,
      review.card_id,
      review.reviewed_at,
    );
  }
}

async function refreshRemoteQueue(
  db: SQLiteDatabase,
  userId: string,
): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase chưa được cấu hình.');
  }

  const { data: queueData, error: queueError } = await supabase.rpc(
    'get_review_queue',
    { p_limit: 500 },
  );
  if (queueError) throw new Error(`Không tải được hàng đợi ôn: ${queueError.message}`);

  const remoteCards = parseRemoteQueueCards(queueData);
  const itemIds = [...new Set(remoteCards.map((card) => card.item_id))];
  if (itemIds.length === 0) return;

  const { data: vocabData, error: vocabError } = await supabase
    .from('vocab_items')
    .select('id, lang, lemma, reading, gloss_vi')
    .in('id', itemIds);
  if (vocabError) throw new Error(`Không tải được nội dung thẻ: ${vocabError.message}`);

  const vocabItems = parseRemoteVocab(vocabData);
  const vocabById = new Map(vocabItems.map((item) => [item.id, item]));
  for (const remote of remoteCards) {
    if (remote.user_id !== userId) {
      throw new Error('Supabase returned a card belonging to another user.');
    }
    const vocab = vocabById.get(remote.item_id);
    if (!vocab) {
      throw new Error(`Không tìm thấy nội dung đã duyệt cho thẻ ${remote.id}.`);
    }
    await upsertLocalCard(db, toLocalCard(remote, vocab));
  }
}

async function countNewReviewsToday(
  db: SQLiteDatabase,
  userId: string,
  now: Date,
): Promise<number> {
  const row = await db.getFirstAsync<{ count: number }>(
    `SELECT count(*) AS count
       FROM srs_review_outbox
      WHERE user_id = ? AND previous_state = 0 AND reviewed_at >= ?`,
    userId,
    vietnamDayStart(now),
  );
  return row?.count ?? 0;
}

async function dailyLimit(db: SQLiteDatabase, userId: string): Promise<number> {
  const row = await db.getFirstAsync<{ new_cards_per_day: number }>(
    `SELECT new_cards_per_day
       FROM srs_local_settings
      WHERE user_id = ?`,
    userId,
  );
  return row?.new_cards_per_day ?? DEFAULT_NEW_CARDS_PER_DAY;
}

export async function loadReviewQueue(
  db: SQLiteDatabase,
  userId: string,
): Promise<{
  cards: LocalReviewCard[];
  syncWarning: string | null;
  newLimit: number;
  reviewedNewToday: number;
}> {
  const syncIssues: string[] = [];
  try {
    await syncPendingReviews(db, userId);
  } catch (error) {
    syncIssues.push(error instanceof Error ? error.message : 'Lỗi đồng bộ lượt ôn.');
  }
  try {
    await refreshRemoteQueue(db, userId);
  } catch (error) {
    syncIssues.push(error instanceof Error ? error.message : 'Không tải được dữ liệu ôn.');
  }

  const now = new Date();
  const [cached, reviewedNewToday, newLimit] = await Promise.all([
    loadLocalCards(db, userId),
    countNewReviewsToday(db, userId, now),
    dailyLimit(db, userId),
  ]);
  const cards = buildReviewQueue(cached, reviewedNewToday, newLimit, now);
  return {
    cards,
    syncWarning: syncIssues.length > 0 ? syncIssues.join(' ') : null,
    newLimit,
    reviewedNewToday,
  };
}

export async function recordLocalReview(
  db: SQLiteDatabase,
  card: LocalReviewCard,
  rating: ReviewRating,
  reviewedAt: Date,
  durationMs: number | null,
): Promise<LocalReviewCard> {
  const nextCard = reviewFsrsCard(card.card, rating, reviewedAt);
  const timestamp = reviewedAt.toISOString();

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO srs_review_outbox
         (user_id, card_id, reviewed_at, rating, previous_state,
          previous_stability, previous_difficulty, duration_ms, state_json, synced)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      card.userId,
      card.id,
      timestamp,
      rating,
      card.card.state,
      card.card.stability,
      card.card.difficulty,
      durationMs,
      JSON.stringify(nextCard),
    );
    await db.runAsync(
      `UPDATE srs_local_cards
          SET state = ?, due_at = ?, card_json = ?
        WHERE user_id = ? AND card_id = ?`,
      nextCard.state,
      nextCard.due.toISOString(),
      JSON.stringify(nextCard),
      card.userId,
      card.id,
    );
  });

  return {
    ...card,
    card: nextCard,
    state: nextCard.state,
    dueAt: nextCard.due.toISOString(),
  };
}

export async function setNewCardsPerDay(
  db: SQLiteDatabase,
  userId: string,
  limit: number,
): Promise<void> {
  if (!Number.isInteger(limit) || limit < 0 || limit > MAX_NEW_CARDS_PER_DAY) {
    throw new RangeError(`Daily new-card limit must be between 0 and ${MAX_NEW_CARDS_PER_DAY}.`);
  }
  if (!supabase) throw new Error('Supabase chưa được cấu hình.');

  const { error } = await supabase.rpc('set_new_cards_per_day', { p_limit: limit });
  if (error) throw new Error(`Không lưu được giới hạn thẻ mới: ${error.message}`);
  await db.runAsync(
    `INSERT INTO srs_local_settings (user_id, new_cards_per_day)
     VALUES (?, ?)
     ON CONFLICT (user_id) DO UPDATE SET new_cards_per_day = excluded.new_cards_per_day`,
    userId,
    limit,
  );
}
