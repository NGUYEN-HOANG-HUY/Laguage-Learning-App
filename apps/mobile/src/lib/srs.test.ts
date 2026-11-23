import { describe, expect, it } from 'vitest';
import { createEmptyCard } from 'ts-fsrs';

import vectors from '../../../../packages/fsrs-golden/vectors.json';
import {
  buildReviewQueue,
  MAX_NEW_CARDS_PER_DAY,
  reviewFsrsCard,
} from './srs';
import { initialSm2State, reviewSm2 } from './sm2';

describe('shared FSRS-6 golden vectors', () => {
  it.each(vectors.cases)('$name', ({ grades, steps }) => {
    let card = createEmptyCard(new Date(vectors.baseDate));
    let reviewedAt = new Date(vectors.baseDate);

    for (const [index, grade] of grades.entries()) {
      const nextCard = reviewFsrsCard(card, grade, reviewedAt);
      const expected = steps[index];

      expect(nextCard.state).toBe(expected.state);
      expect(nextCard.learning_steps).toBe(expected.step);
      expect(nextCard.stability).toBeCloseTo(expected.stability, 6);
      expect(nextCard.difficulty).toBeCloseTo(expected.difficulty, 6);
      expect(nextCard.due.toISOString()).toBe(expected.due);
      expect(nextCard.reps).toBe(expected.reps);
      expect(nextCard.lapses).toBe(expected.lapses);

      card = nextCard;
      reviewedAt = new Date(expected.due);
    }
  });
});

describe('review queue', () => {
  const now = new Date('2026-01-01T00:00:00.000Z');
  const cards = [
    { id: 'later-review', state: 2, dueAt: '2025-12-31T23:00:00.000Z' },
    { id: 'new-a', state: 0, dueAt: '2026-01-01T00:00:00.000Z' },
    { id: 'future-review', state: 2, dueAt: '2026-01-02T00:00:00.000Z' },
    { id: 'earlier-review', state: 1, dueAt: '2025-12-30T00:00:00.000Z' },
    { id: 'new-b', state: 0, dueAt: '2026-01-01T00:00:00.000Z' },
  ];

  it('puts due reviews first and limits new cards to remaining daily allowance', () => {
    const queue = buildReviewQueue(cards, 3, 5, now);

    expect(queue.map((card) => card.id)).toEqual([
      'earlier-review',
      'later-review',
      'new-a',
      'new-b',
    ]);
  });

  it('does not queue new cards after the daily limit is reached', () => {
    const queue = buildReviewQueue(cards, 5, 5, now);

    expect(queue.map((card) => card.id)).toEqual([
      'earlier-review',
      'later-review',
    ]);
  });

  it('caps configurable daily new cards at 15', () => {
    expect(() => buildReviewQueue(cards, 0, MAX_NEW_CARDS_PER_DAY + 1, now))
      .toThrow('between 0 and 15');
  });
});

describe('SM-2 comparator', () => {
  it('maps Again to a one-day retry and resets repetitions', () => {
    const previous = { repetitions: 4, intervalDays: 12, easeFactor: 1.8 };
    const result = reviewSm2(previous, 1, new Date('2026-01-01T00:00:00.000Z'));

    expect(result.state.repetitions).toBe(0);
    expect(result.state.intervalDays).toBe(1);
    expect(result.dueAt.toISOString()).toBe('2026-01-02T00:00:00.000Z');
  });

  it('starts the first successful interval at one day', () => {
    const result = reviewSm2(initialSm2State, 3, new Date('2026-01-01T00:00:00.000Z'));

    expect(result.state.repetitions).toBe(1);
    expect(result.state.intervalDays).toBe(1);
  });
});

describe('FSRS review validation', () => {
  it('rejects invalid ratings', () => {
    const now = new Date('2026-01-01T00:00:00.000Z');
    expect(() =>
      reviewFsrsCard(
        createEmptyCard(now),
        5,
        now,
      ),
    ).toThrow('integer from 1 to 4');
  });
});

