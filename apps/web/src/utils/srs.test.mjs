import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createInitialSm2State,
  MIN_EASE_FACTOR,
  scheduleSm2Review,
} from './srs.ts';

const reviewedAt = new Date('2026-01-01T10:00:00.000Z');

test('Again resets repetitions, records a lapse, and schedules one day later', () => {
  const prior = {
    repetitions: 4,
    intervalDays: 12,
    easeFactor: 2.4,
    dueAt: '2025-12-20T10:00:00.000Z',
    lastReviewedAt: '2025-12-08T10:00:00.000Z',
    lapses: 1,
  };

  const next = scheduleSm2Review(prior, 'again', reviewedAt);

  assert.equal(next.repetitions, 0);
  assert.equal(next.intervalDays, 1);
  assert.equal(next.lapses, 2);
  assert.equal(next.dueAt, '2026-01-02T10:00:00.000Z');
});

test('successful intervals grow from one day to six days and then by ease factor', () => {
  const first = scheduleSm2Review(createInitialSm2State(reviewedAt), 'good', reviewedAt);
  const second = scheduleSm2Review(first, 'good', new Date(first.dueAt));
  const third = scheduleSm2Review(second, 'good', new Date(second.dueAt));

  assert.equal(first.intervalDays, 1);
  assert.equal(second.intervalDays, 6);
  assert.equal(third.intervalDays, 15);
});

test('Hard reduces ease factor but never below its minimum', () => {
  const result = scheduleSm2Review(
    {
      ...createInitialSm2State(reviewedAt),
      easeFactor: MIN_EASE_FACTOR,
    },
    'hard',
    reviewedAt,
  );

  assert.equal(result.easeFactor, MIN_EASE_FACTOR);
  assert.equal(result.repetitions, 1);
});

test('rejects invalid rating and invalid dates', () => {
  assert.throws(
    () => scheduleSm2Review(createInitialSm2State(reviewedAt), 'invalid', reviewedAt),
    /rating must be/,
  );
  assert.throws(
    () => createInitialSm2State(new Date('invalid')),
    /valid Date/,
  );
});
