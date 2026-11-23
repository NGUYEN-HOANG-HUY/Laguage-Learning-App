import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import type { Session } from '@supabase/supabase-js';

import {
  loadReviewQueue,
  recordLocalReview,
  type LocalReviewCard,
} from '../lib/local-srs';
import { buildReviewQueue, type ReviewRating } from '../lib/srs';

type Props = {
  session: Session;
  signOut: () => Promise<void>;
  busy: boolean;
};

const ratings: { value: ReviewRating; label: string }[] = [
  { value: 1, label: 'Again' },
  { value: 2, label: 'Hard' },
  { value: 3, label: 'Good' },
  { value: 4, label: 'Easy' },
];

export function ReviewSession({ session, signOut, busy: authBusy }: Props) {
  const db = useSQLiteContext();
  const [queue, setQueue] = useState<LocalReviewCard[]>([]);
  const [newLimit, setNewLimit] = useState(10);
  const [reviewedNewToday, setReviewedNewToday] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncWarning, setSyncWarning] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const shownAt = useRef(0);
  const userId = session.user.id;

  const applyQueueResult = useCallback(
    (result: Awaited<ReturnType<typeof loadReviewQueue>>) => {
      setQueue(result.cards);
      setNewLimit(result.newLimit);
      setReviewedNewToday(result.reviewedNewToday);
      setSyncWarning(result.syncWarning);
    },
    [],
  );

  const refreshQueue = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const result = await loadReviewQueue(db, userId);
      applyQueueResult(result);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Không thể tải hàng đợi ôn tập.',
      );
    } finally {
      setLoading(false);
    }
  }, [applyQueueResult, db, userId]);

  useEffect(() => {
    let active = true;
    loadReviewQueue(db, userId)
      .then((result) => {
        if (active) applyQueueResult(result);
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(
            error instanceof Error ? error.message : 'Không thể tải hàng đợi ôn tập.',
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [applyQueueResult, db, userId]);

  const current = queue[0];

  async function submitRating(rating: ReviewRating, durationMs: number) {
    if (!current || saving) return;

    setSaving(true);
    setErrorMessage('');
    const now = new Date();
    try {
      const updatedCard = await recordLocalReview(
        db,
        current,
        rating,
        now,
        durationMs,
      );
      const nextReviewedNewCount =
        reviewedNewToday + (current.state === 0 ? 1 : 0);
      setReviewedNewToday(nextReviewedNewCount);
      setQueue((existing) =>
        buildReviewQueue(
          existing.map((card) => (card.id === updatedCard.id ? updatedCard : card)),
          nextReviewedNewCount,
          newLimit,
          now,
        ),
      );
      setRevealed(false);

      const refreshed = await loadReviewQueue(db, userId);
      setQueue(refreshed.cards);
      setNewLimit(refreshed.newLimit);
      setReviewedNewToday(refreshed.reviewedNewToday);
      setSyncWarning(refreshed.syncWarning);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Không thể lưu lượt ôn.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>ÔN TẬP</Text>
          <Text style={styles.heading}>Một thẻ mỗi lượt</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={authBusy}
          onPress={() => void signOut()}
          style={styles.signOut}
        >
          <Text style={styles.signOutText}>Đăng xuất</Text>
        </Pressable>
      </View>

      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          Thẻ mới hôm nay: {reviewedNewToday}/{newLimit}
        </Text>
        <Text style={styles.progressText}>
          Còn {queue.length} {queue.length === 1 ? 'thẻ' : 'thẻ'}
        </Text>
      </View>

      {syncWarning ? (
        <Text accessibilityRole="alert" style={styles.warning}>
          {syncWarning} Lượt ôn mới vẫn được lưu trên thiết bị và sẽ thử đồng bộ lại.
        </Text>
      ) : null}
      {errorMessage ? (
        <Text accessibilityRole="alert" style={styles.error}>
          {errorMessage}
        </Text>
      ) : null}

      {loading && queue.length === 0 ? (
        <ActivityIndicator accessibilityLabel="Đang tải thẻ" color="#3157d5" />
      ) : current ? (
        <View style={styles.card}>
          <Text style={styles.language}>{current.language.toUpperCase()}</Text>
          <Text style={styles.prompt}>{current.lemma}</Text>
          {revealed ? (
            <View style={styles.answer}>
              {current.reading ? (
                <Text style={styles.reading}>{current.reading}</Text>
              ) : null}
              <Text style={styles.meaning}>{current.meaning}</Text>
            </View>
          ) : (
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                shownAt.current = Date.now();
                setRevealed(true);
              }}
              style={styles.revealButton}
            >
              <Text style={styles.revealText}>Hiện nghĩa</Text>
            </Pressable>
          )}

          {revealed ? (
            <View style={styles.ratings}>
              {ratings.map((rating) => (
                <Pressable
                  accessibilityRole="button"
                  disabled={saving}
                  key={rating.value}
                  onPress={() =>
                    void submitRating(
                      rating.value,
                      Math.max(0, Date.now() - shownAt.current),
                    )
                  }
                  style={({ pressed }) => [
                    styles.ratingButton,
                    (pressed || saving) && styles.muted,
                  ]}
                >
                  <Text style={styles.ratingText}>
                    {saving ? '…' : rating.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>
            {syncWarning ? 'Chưa có thẻ đã lưu trên thiết bị' : 'Bạn đã xong hôm nay'}
          </Text>
          <Text style={styles.emptyBody}>
            {syncWarning
              ? 'Kiểm tra kết nối rồi thử tải lại. Chỉ nội dung đã qua QA mới xuất hiện trong hàng đợi.'
              : 'Thẻ đến hạn đã ôn xong và giới hạn thẻ mới hôm nay đã áp dụng.'}
          </Text>
          <Pressable
            accessibilityRole="button"
            disabled={loading}
            onPress={() => void refreshQueue()}
            style={styles.refreshButton}
          >
            <Text style={styles.refreshText}>
              {loading ? 'Đang tải…' : 'Tải lại hàng đợi'}
            </Text>
          </Pressable>
        </View>
      )}

      {loading && current ? (
        <Text style={styles.syncing}>Đang đồng bộ hàng đợi…</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#f4f6fb',
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  eyebrow: {
    color: '#3157d5',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  heading: {
    color: '#15213b',
    fontSize: 26,
    fontWeight: '700',
    marginTop: 6,
  },
  signOut: {
    padding: 8,
  },
  signOutText: {
    color: '#536078',
    fontWeight: '600',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressText: {
    color: '#536078',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    minHeight: 300,
    padding: 24,
  },
  language: {
    color: '#66738a',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  prompt: {
    color: '#15213b',
    fontSize: 34,
    fontWeight: '700',
    marginTop: 40,
    textAlign: 'center',
  },
  answer: {
    alignItems: 'center',
    marginTop: 20,
  },
  reading: {
    color: '#536078',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  meaning: {
    color: '#15213b',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
  revealButton: {
    alignSelf: 'center',
    backgroundColor: '#edf1ff',
    borderRadius: 10,
    marginTop: 36,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  revealText: {
    color: '#3157d5',
    fontSize: 16,
    fontWeight: '700',
  },
  ratings: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 30,
  },
  ratingButton: {
    alignItems: 'center',
    backgroundColor: '#3157d5',
    borderRadius: 10,
    flexGrow: 1,
    minWidth: '40%',
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  ratingText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  muted: {
    opacity: 0.6,
  },
  empty: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 24,
  },
  emptyTitle: {
    color: '#15213b',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyBody: {
    color: '#536078',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 10,
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#edf1ff',
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  refreshText: {
    color: '#3157d5',
    fontWeight: '700',
  },
  warning: {
    backgroundColor: '#fff3da',
    borderRadius: 10,
    color: '#764900',
    lineHeight: 21,
    marginBottom: 14,
    padding: 12,
  },
  error: {
    color: '#a12525',
    lineHeight: 21,
    marginBottom: 14,
  },
  syncing: {
    color: '#536078',
    marginTop: 14,
    textAlign: 'center',
  },
});
