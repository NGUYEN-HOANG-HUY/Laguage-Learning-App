import { SUPPORTED_LANGUAGES } from '../types/learning.ts';
import type {
  ConversationScenario,
  LearningLesson,
  ProficiencyLevel,
  ReviewEvent,
  ReviewRating,
  Sm2State,
  VocabularyCard,
} from '../types/learning.ts';
import { sampleLessons } from '../data/sampleLessons.ts';
import { createInitialSm2State, scheduleSm2Review } from '../utils/srs.ts';

export const STORAGE_KEY = 'language-learning-web-progress';
export const CURRENT_STORAGE_VERSION = 1;

export type KeyValueStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

export type LearningState = {
  version: 1;
  lessons: LearningLesson[];
  reviews: ReviewEvent[];
};

type LegacyProgressV0 = {
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  dueAt: string;
};

const LEVELS: readonly string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const SCENARIOS: readonly string[] = ['restaurant', 'interview', 'office'];
const RATINGS: readonly string[] = ['again', 'hard', 'good', 'easy'];
const CONTENT_STATUSES: readonly string[] = ['sample', 'reviewed'];

function getLocalStorage(): KeyValueStorage {
  if (typeof globalThis.localStorage === 'undefined') {
    throw new Error('LocalStorage không khả dụng trong môi trường hiện tại.');
  }
  return globalThis.localStorage;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidDateString(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function isSm2State(value: unknown): value is Sm2State {
  return (
    isRecord(value) &&
    Number.isInteger(value.repetitions) &&
    Number(value.repetitions) >= 0 &&
    Number.isInteger(value.intervalDays) &&
    Number(value.intervalDays) >= 0 &&
    typeof value.easeFactor === 'number' &&
    Number.isFinite(value.easeFactor) &&
    value.easeFactor >= 1.3 &&
    isValidDateString(value.dueAt) &&
    (value.lastReviewedAt === null || isValidDateString(value.lastReviewedAt)) &&
    Number.isInteger(value.lapses) &&
    Number(value.lapses) >= 0
  );
}

function isVocabularyCard(value: unknown): value is VocabularyCard {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    SUPPORTED_LANGUAGES.includes(value.language as (typeof SUPPORTED_LANGUAGES)[number]) &&
    LEVELS.includes(String(value.level)) &&
    typeof value.term === 'string' &&
    typeof value.ipa === 'string' &&
    typeof value.meaningVi === 'string' &&
    isRecord(value.example) &&
    typeof value.example.text === 'string' &&
    typeof value.example.translationVi === 'string' &&
    isSm2State(value.srs) &&
    CONTENT_STATUSES.includes(String(value.contentStatus))
  );
}

function isLearningLesson(value: unknown): value is LearningLesson {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    SUPPORTED_LANGUAGES.includes(value.language as (typeof SUPPORTED_LANGUAGES)[number]) &&
    LEVELS.includes(String(value.level)) &&
    typeof value.title === 'string' &&
    typeof value.description === 'string' &&
    SCENARIOS.includes(String(value.scenario)) &&
    Array.isArray(value.cards) &&
    value.cards.every(isVocabularyCard) &&
    CONTENT_STATUSES.includes(String(value.contentStatus))
  );
}

function isReviewEvent(value: unknown): value is ReviewEvent {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.cardId === 'string' &&
    RATINGS.includes(String(value.rating)) &&
    isValidDateString(value.reviewedAt) &&
    isSm2State(value.previousState) &&
    isSm2State(value.nextState)
  );
}

function isLearningState(value: unknown): value is LearningState {
  return (
    isRecord(value) &&
    value.version === CURRENT_STORAGE_VERSION &&
    Array.isArray(value.lessons) &&
    value.lessons.every(isLearningLesson) &&
    Array.isArray(value.reviews) &&
    value.reviews.every(isReviewEvent)
  );
}

function isLegacyProgressV0(value: unknown): value is LegacyProgressV0 {
  return (
    isRecord(value) &&
    Number.isInteger(value.repetitions) &&
    Number(value.repetitions) >= 0 &&
    Number.isInteger(value.intervalDays) &&
    Number(value.intervalDays) >= 0 &&
    typeof value.easeFactor === 'number' &&
    Number.isFinite(value.easeFactor) &&
    value.easeFactor >= 1.3 &&
    isValidDateString(value.dueAt)
  );
}

function createFreshLessons(now: Date): LearningLesson[] {
  return sampleLessons.map((lesson) => ({
    ...lesson,
    cards: lesson.cards.map((card) => ({
      ...card,
      example: { ...card.example },
      srs: createInitialSm2State(now),
    })),
  }));
}

export function createInitialLearningState(now = new Date()): LearningState {
  return {
    version: CURRENT_STORAGE_VERSION,
    lessons: createFreshLessons(now),
    reviews: [],
  };
}

export function saveLearningState(
  state: LearningState,
  storage: KeyValueStorage = getLocalStorage(),
): void {
  if (!isLearningState(state)) {
    throw new Error('Không thể lưu tiến độ: dữ liệu học tập không hợp lệ.');
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (cause) {
    throw new Error('Không lưu được tiến độ vào LocalStorage.', { cause });
  }
}

function migrateV0(value: Record<string, unknown>, now: Date): LearningState {
  const progressByCard = value.progress;
  if (!isRecord(progressByCard)) {
    throw new Error('Dữ liệu phiên bản 0 thiếu trường progress hợp lệ.');
  }

  const lessons = createFreshLessons(now);
  const cardsById = new Map(
    lessons.flatMap((lesson) => lesson.cards.map((card) => [card.id, card] as const)),
  );
  const progressEntries = Object.entries(progressByCard);

  for (const [cardId, progress] of progressEntries) {
    if (!cardsById.has(cardId)) {
      throw new Error(`Không thể migration tiến độ cho card không tồn tại: ${cardId}.`);
    }
    if (!isLegacyProgressV0(progress)) {
      throw new Error(`Tiến độ cũ của card ${cardId} không hợp lệ.`);
    }
  }

  const migratedLessons = lessons.map((lesson) => ({
    ...lesson,
    cards: lesson.cards.map((card) => {
      const progress = progressByCard[card.id];
      if (!progress || !isLegacyProgressV0(progress)) return card;

      return {
        ...card,
        srs: {
          ...progress,
          lastReviewedAt: null,
          lapses: 0,
        },
      };
    }),
  }));

  return {
    version: CURRENT_STORAGE_VERSION,
    lessons: migratedLessons,
    reviews: [],
  };
}

export function readLearningState(
  storage: KeyValueStorage = getLocalStorage(),
  now = new Date(),
): LearningState {
  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) {
    const initial = createInitialLearningState(now);
    saveLearningState(initial, storage);
    return initial;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (cause) {
    throw new Error('Dữ liệu LocalStorage không phải JSON hợp lệ.', { cause });
  }

  if (!isRecord(parsed) || !Number.isInteger(parsed.version)) {
    throw new Error('Dữ liệu LocalStorage thiếu version hợp lệ.');
  }

  if (parsed.version === 0) {
    const migrated = migrateV0(parsed, now);
    saveLearningState(migrated, storage);
    return migrated;
  }
  if (parsed.version === CURRENT_STORAGE_VERSION && isLearningState(parsed)) {
    return parsed;
  }
  if (parsed.version === CURRENT_STORAGE_VERSION) {
    throw new Error('Dữ liệu LocalStorage phiên bản hiện tại không hợp lệ.');
  }

  throw new Error(`Phiên bản LocalStorage không được hỗ trợ: ${parsed.version}.`);
}

export function getDueCards(
  state: LearningState,
  now = new Date(),
): VocabularyCard[] {
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) {
    throw new RangeError('now must be a valid Date.');
  }

  return state.lessons
    .flatMap((lesson) => lesson.cards)
    .filter((card) => Date.parse(card.srs.dueAt) <= now.getTime())
    .sort(
      (left, right) =>
        left.srs.dueAt.localeCompare(right.srs.dueAt) ||
        left.id.localeCompare(right.id),
    );
}

export function recordReview(
  cardId: string,
  rating: ReviewRating,
  reviewedAt = new Date(),
  storage: KeyValueStorage = getLocalStorage(),
): LearningState {
  const state = readLearningState(storage, reviewedAt);
  const targetCard = state.lessons
    .flatMap((lesson) => lesson.cards)
    .find((card) => card.id === cardId);
  if (!targetCard) {
    throw new Error(`Không tìm thấy flashcard: ${cardId}.`);
  }

  const nextSrs = scheduleSm2Review(targetCard.srs, rating, reviewedAt);
  const event: ReviewEvent = {
    id: `review-${reviewedAt.getTime()}-${cardId}-${state.reviews.length}`,
    cardId,
    rating,
    reviewedAt: reviewedAt.toISOString(),
    previousState: targetCard.srs,
    nextState: nextSrs,
  };
  const nextState: LearningState = {
    version: CURRENT_STORAGE_VERSION,
    lessons: state.lessons.map((lesson) => ({
      ...lesson,
      cards: lesson.cards.map((card) =>
        card.id === cardId ? { ...card, srs: nextSrs } : card,
      ),
    })),
    reviews: [...state.reviews, event],
  };

  saveLearningState(nextState, storage);
  return nextState;
}
