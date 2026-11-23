import { createEmptyCard, fsrs, State, type Card } from 'ts-fsrs';

export const FSRS_ALGORITHM_VERSION = 'FSRS-6';
export const TS_FSRS_PACKAGE_VERSION = '5.4.2';
export const DEFAULT_NEW_CARDS_PER_DAY = 10;
export const MAX_NEW_CARDS_PER_DAY = 15;

const scheduler = fsrs({
  request_retention: 0.9,
  enable_fuzz: false,
  enable_short_term: true,
  learning_steps: ['2m', '10m'],
  relearning_steps: ['10m'],
  maximum_interval: 36500,
});

export type ReviewRating = 1 | 2 | 3 | 4;

export type QueueCard = {
  id: string;
  dueAt: string;
  state: number;
};

export function newFsrsCard(now: Date): Card {
  return createEmptyCard(now);
}

export function reviewFsrsCard(
  card: Card,
  rating: number,
  reviewedAt: Date,
): Card {
  if (
    !Number.isInteger(rating) ||
    (rating !== 1 && rating !== 2 && rating !== 3 && rating !== 4)
  ) {
    throw new RangeError('FSRS rating must be an integer from 1 to 4.');
  }

  return scheduler.next(card, reviewedAt, rating).card;
}

export function buildReviewQueue<T extends QueueCard>(
  cards: readonly T[],
  reviewedNewToday: number,
  newCardsPerDay: number,
  now: Date,
): T[] {
  if (!Number.isInteger(reviewedNewToday) || reviewedNewToday < 0) {
    throw new RangeError('reviewedNewToday must be a non-negative integer.');
  }
  if (
    !Number.isInteger(newCardsPerDay) ||
    newCardsPerDay < 0 ||
    newCardsPerDay > MAX_NEW_CARDS_PER_DAY
  ) {
    throw new RangeError(`newCardsPerDay must be between 0 and ${MAX_NEW_CARDS_PER_DAY}.`);
  }

  const dueReviews = cards
    .filter((card) => card.state !== State.New && Date.parse(card.dueAt) <= now.getTime())
    .sort((left, right) => left.dueAt.localeCompare(right.dueAt));
  const remainingNew = Math.max(0, newCardsPerDay - reviewedNewToday);
  const newCards = cards
    .filter((card) => card.state === State.New)
    .sort((left, right) => left.dueAt.localeCompare(right.dueAt))
    .slice(0, remainingNew);

  return [...dueReviews, ...newCards];
}
