import type { ReviewRating, Sm2State } from '../types/learning';

export const INITIAL_EASE_FACTOR = 2.5;
export const MIN_EASE_FACTOR = 1.3;

const QUALITY_BY_RATING: Record<ReviewRating, number> = {
  again: 1,
  hard: 3,
  good: 4,
  easy: 5,
};

function assertValidDate(value: Date, fieldName: string): void {
  if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
    throw new RangeError(`${fieldName} must be a valid Date.`);
  }
}

function assertValidState(state: Sm2State): void {
  if (!Number.isInteger(state.repetitions) || state.repetitions < 0) {
    throw new RangeError('repetitions must be a non-negative integer.');
  }
  if (!Number.isInteger(state.intervalDays) || state.intervalDays < 0) {
    throw new RangeError('intervalDays must be a non-negative integer.');
  }
  if (!Number.isFinite(state.easeFactor) || state.easeFactor < MIN_EASE_FACTOR) {
    throw new RangeError(`easeFactor must be at least ${MIN_EASE_FACTOR}.`);
  }
  if (!Number.isInteger(state.lapses) || state.lapses < 0) {
    throw new RangeError('lapses must be a non-negative integer.');
  }
  if (Number.isNaN(Date.parse(state.dueAt))) {
    throw new RangeError('dueAt must be a valid date string.');
  }
  if (
    state.lastReviewedAt !== null &&
    Number.isNaN(Date.parse(state.lastReviewedAt))
  ) {
    throw new RangeError('lastReviewedAt must be null or a valid date string.');
  }
}

function addDays(date: Date, days: number): string {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
}

export function createInitialSm2State(now = new Date()): Sm2State {
  assertValidDate(now, 'now');

  return {
    repetitions: 0,
    intervalDays: 0,
    easeFactor: INITIAL_EASE_FACTOR,
    dueAt: now.toISOString(),
    lastReviewedAt: null,
    lapses: 0,
  };
}

export function scheduleSm2Review(
  state: Sm2State,
  rating: ReviewRating,
  reviewedAt = new Date(),
): Sm2State {
  assertValidState(state);
  assertValidDate(reviewedAt, 'reviewedAt');

  const quality = QUALITY_BY_RATING[rating];
  if (quality === undefined) {
    throw new RangeError('rating must be again, hard, good, or easy.');
  }

  const qualityGap = 5 - quality;
  const easeFactor = Math.max(
    MIN_EASE_FACTOR,
    state.easeFactor +
      (0.1 - qualityGap * (0.08 + qualityGap * 0.02)),
  );
  const failed = quality < 3;
  const repetitions = failed ? 0 : state.repetitions + 1;

  let intervalDays: number;
  if (failed || state.repetitions === 0) {
    intervalDays = 1;
  } else if (state.repetitions === 1) {
    intervalDays = 6;
  } else {
    intervalDays = Math.max(1, Math.round(state.intervalDays * easeFactor));
  }

  return {
    repetitions,
    intervalDays,
    easeFactor,
    dueAt: addDays(reviewedAt, intervalDays),
    lastReviewedAt: reviewedAt.toISOString(),
    lapses: state.lapses + (failed ? 1 : 0),
  };
}
