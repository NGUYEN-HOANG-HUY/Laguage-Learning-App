import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';
import type { Session } from '@supabase/supabase-js';

import { ReviewSession } from './ReviewSession';
import { RoleplayChatScreen } from './RoleplayChatScreen';
import {
  learningProgressPercent,
  loadDashboardStats,
  type DashboardStats,
} from '../lib/dashboard';

type Props = {
  session: Session;
  signOut: () => Promise<void>;
  busy: boolean;
};

type Screen = 'home' | 'review' | 'roleplay';

export function HomeDashboard({ session, signOut, busy }: Props) {
  const db = useSQLiteContext();
  const [screen, setScreen] = useState<Screen>('home');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const refreshStats = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      setStats(await loadDashboardStats(db, session.user.id));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Không tải được tiến độ học.',
      );
    } finally {
      setLoading(false);
    }
  }, [db, session.user.id]);

  useEffect(() => {
    let active = true;
    loadDashboardStats(db, session.user.id)
      .then((result) => {
        if (active) setStats(result);
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(
            error instanceof Error ? error.message : 'Không tải được tiến độ học.',
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [db, session.user.id]);

  if (screen === 'review') {
    return (
      <ReviewSession
        busy={busy}
        onHome={() => {
          setScreen('home');
          void refreshStats();
        }}
        session={session}
        signOut={signOut}
      />
    );
  }

  if (screen === 'roleplay') {
    return <RoleplayChatScreen onBack={() => setScreen('home')} />;
  }

  const progress = stats
    ? learningProgressPercent(stats.learnedCards, stats.totalCards)
    : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>LANGUAGE LEARNING</Text>
            <Text style={styles.title}>Hôm nay học gì?</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={() => void signOut()}
            style={styles.signOut}
          >
            <Text style={styles.signOutText}>Đăng xuất</Text>
          </Pressable>
        </View>

        {errorMessage ? (
          <View style={styles.errorCard}>
            <Text accessibilityRole="alert" style={styles.errorText}>
              {errorMessage}
            </Text>
            <Pressable
              accessibilityRole="button"
              disabled={loading}
              onPress={() => void refreshStats()}
              style={styles.retryButton}
            >
              <Text style={styles.retryText}>
                {loading ? 'Đang tải…' : 'Thử lại'}
              </Text>
            </Pressable>
          </View>
        ) : null}

        {stats?.syncWarning ? (
          <Text accessibilityRole="alert" style={styles.warning}>
            {stats.syncWarning}
          </Text>
        ) : null}

        {loading && !stats ? (
          <ActivityIndicator
            accessibilityLabel="Đang tải tiến độ"
            color="#3157d5"
            style={styles.loading}
          />
        ) : stats ? (
          <>
            <View style={styles.metrics}>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{stats.streakDays}</Text>
                <Text style={styles.metricLabel}>Ngày liên tiếp</Text>
                <Text style={styles.metricFootnote}>Streak học tập</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{stats.dueCards}</Text>
                <Text style={styles.metricLabel}>Thẻ đến hạn</Text>
                <Text style={styles.metricFootnote}>Cần ôn hôm nay</Text>
              </View>
            </View>

            <View style={styles.progressCard}>
              <View style={styles.progressHeading}>
                <Text style={styles.sectionTitle}>Tiến độ học</Text>
                <Text style={styles.percentage}>{progress}%</Text>
              </View>
              <View
                accessibilityLabel={`Tiến độ ${progress}%`}
                accessibilityRole="progressbar"
                style={styles.progressTrack}
              >
                <View style={[styles.progressFill, { width: `${progress}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {stats.learnedCards} / {stats.totalCards} thẻ đã bắt đầu học
              </Text>
              {stats.totalCards === 0 ? (
                <Text style={styles.emptyText}>
                  Chưa có thẻ đã qua QA. Nội dung nháp sẽ không xuất hiện trong hàng đợi.
                </Text>
              ) : null}
            </View>
          </>
        ) : null}

        <Text style={styles.sectionTitle}>Bắt đầu nhanh</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setScreen('review')}
          style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}
        >
          <View style={styles.actionIcon}>
            <Text style={styles.actionIconText}>SRS</Text>
          </View>
          <View style={styles.actionCopy}>
            <Text style={styles.actionTitle}>Ôn tập flashcard</Text>
            <Text style={styles.actionDescription}>
              Ôn thẻ đến hạn với Again, Hard, Good hoặc Easy.
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => setScreen('roleplay')}
          style={({ pressed }) => [styles.actionCard, pressed && styles.pressed]}
        >
          <View style={[styles.actionIcon, styles.chatIcon]}>
            <Text style={styles.actionIconText}>AI</Text>
          </View>
          <View style={styles.actionCopy}>
            <Text style={styles.actionTitle}>Luyện hội thoại</Text>
            <Text style={styles.actionDescription}>
              Thực hành theo tình huống với Mock AI.
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#f4f6fb',
    flex: 1,
  },
  content: {
    gap: 16,
    padding: 22,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  eyebrow: {
    color: '#3157d5',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.3,
  },
  title: {
    color: '#15213b',
    fontSize: 27,
    fontWeight: '700',
    marginTop: 5,
  },
  signOut: {
    padding: 8,
  },
  signOutText: {
    color: '#536078',
    fontSize: 13,
    fontWeight: '600',
  },
  metrics: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    flex: 1,
    padding: 16,
  },
  metricValue: {
    color: '#15213b',
    fontSize: 32,
    fontWeight: '700',
  },
  metricLabel: {
    color: '#15213b',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  metricFootnote: {
    color: '#66738a',
    fontSize: 12,
    marginTop: 4,
  },
  progressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
  },
  progressHeading: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#15213b',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  percentage: {
    color: '#3157d5',
    fontSize: 20,
    fontWeight: '700',
  },
  progressTrack: {
    backgroundColor: '#e8ecf5',
    borderRadius: 8,
    height: 10,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#3157d5',
    borderRadius: 8,
    height: '100%',
  },
  progressText: {
    color: '#536078',
    fontSize: 13,
    marginTop: 9,
  },
  emptyText: {
    color: '#66738a',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
  },
  actionCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 13,
    padding: 16,
  },
  actionIcon: {
    alignItems: 'center',
    backgroundColor: '#edf1ff',
    borderRadius: 12,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },
  chatIcon: {
    backgroundColor: '#e7f7f1',
  },
  actionIconText: {
    color: '#3157d5',
    fontSize: 13,
    fontWeight: '800',
  },
  actionCopy: {
    flex: 1,
  },
  actionTitle: {
    color: '#15213b',
    fontSize: 15,
    fontWeight: '700',
  },
  actionDescription: {
    color: '#66738a',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  chevron: {
    color: '#66738a',
    fontSize: 28,
  },
  loading: {
    marginVertical: 30,
  },
  warning: {
    backgroundColor: '#fff3da',
    borderRadius: 10,
    color: '#764900',
    lineHeight: 20,
    padding: 12,
  },
  errorCard: {
    backgroundColor: '#fff0f0',
    borderRadius: 12,
    padding: 14,
  },
  errorText: {
    color: '#a12525',
    lineHeight: 20,
  },
  retryButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingVertical: 4,
  },
  retryText: {
    color: '#3157d5',
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.65,
  },
});
