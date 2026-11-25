import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CURRENT_STORAGE_VERSION,
  getDueCards,
  readLearningState,
  recordReview,
  STORAGE_KEY,
} from './storage.ts';

class MemoryStorage {
  #items = new Map();

  getItem(key) {
    return this.#items.get(key) ?? null;
  }

  setItem(key, value) {
    this.#items.set(key, value);
  }
}

const start = new Date('2026-01-01T10:00:00.000Z');

test('bootstraps sample lessons and persists a versioned state', () => {
  const storage = new MemoryStorage();
  const state = readLearningState(storage, start);
  const persisted = JSON.parse(storage.getItem(STORAGE_KEY));

  assert.equal(state.version, CURRENT_STORAGE_VERSION);
  assert.equal(state.lessons.length, 3);
  assert.equal(state.lessons.reduce((total, lesson) => total + lesson.cards.length, 0), 9);
  assert.equal(persisted.version, CURRENT_STORAGE_VERSION);
  assert.equal(getDueCards(state, start).length, 9);
});

test('records a review and restores the updated schedule from storage', () => {
  const storage = new MemoryStorage();
  const nextState = recordReview('restaurant-menu', 'good', start, storage);
  const restored = readLearningState(storage, start);
  const card = restored.lessons
    .flatMap((lesson) => lesson.cards)
    .find((item) => item.id === 'restaurant-menu');

  assert.equal(nextState.reviews.length, 1);
  assert.equal(card?.srs.repetitions, 1);
  assert.equal(card?.srs.dueAt, '2026-01-02T10:00:00.000Z');
  assert.equal(restored.reviews[0].rating, 'good');
  assert.equal(getDueCards(restored, start).length, 8);
});

test('migrates version 0 progress and persists version 1', () => {
  const storage = new MemoryStorage();
  storage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 0,
      progress: {
        'restaurant-menu': {
          repetitions: 2,
          intervalDays: 6,
          easeFactor: 2.4,
          dueAt: '2026-01-07T10:00:00.000Z',
        },
      },
    }),
  );

  const migrated = readLearningState(storage, start);
  const card = migrated.lessons
    .flatMap((lesson) => lesson.cards)
    .find((item) => item.id === 'restaurant-menu');

  assert.equal(migrated.version, CURRENT_STORAGE_VERSION);
  assert.equal(card?.srs.repetitions, 2);
  assert.equal(card?.srs.intervalDays, 6);
  assert.equal(card?.srs.lapses, 0);
  assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)).version, CURRENT_STORAGE_VERSION);
});

test('reports malformed and unsupported stored data instead of resetting it', () => {
  const storage = new MemoryStorage();
  storage.setItem(STORAGE_KEY, '{bad json');
  assert.throws(() => readLearningState(storage, start), /không phải JSON hợp lệ/);

  storage.setItem(STORAGE_KEY, JSON.stringify({ version: 99 }));
  assert.throws(() => readLearningState(storage, start), /không được hỗ trợ/);
});

test('rejects migration entries for unknown sample cards', () => {
  const storage = new MemoryStorage();
  storage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 0,
      progress: {
        missing: {
          repetitions: 1,
          intervalDays: 1,
          easeFactor: 2.5,
          dueAt: '2026-01-02T10:00:00.000Z',
        },
      },
    }),
  );

  assert.throws(() => readLearningState(storage, start), /card không tồn tại/);
});
