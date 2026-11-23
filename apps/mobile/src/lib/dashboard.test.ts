import { describe, expect, it, vi } from 'vitest';

import { calculateStudyStreak, learningProgressPercent, vietnamDateKey } from './dashboard';

vi.mock('./local-srs', () => ({ loadReviewQueue: vi.fn() }));
vi.mock('./supabase', () => ({ supabase: null }));

describe('dashboard study streak', () => {
  it('uses the Vietnam calendar day for UTC review timestamps', () => {
    expect(vietnamDateKey('2026-11-22T18:30:00.000Z')).toBe('2026-11-23');
  });

  it('counts consecutive days and allows today or yesterday as the current streak', () => {
    const now = new Date('2026-11-23T12:00:00.000Z');
    expect(
      calculateStudyStreak(
        [
          '2026-11-23T02:00:00.000Z',
          '2026-11-22T02:00:00.000Z',
          '2026-11-21T02:00:00.000Z',
        ],
        now,
      ),
    ).toBe(3);

    expect(
      calculateStudyStreak(['2026-11-22T02:00:00.000Z'], now),
    ).toBe(1);
    expect(
      calculateStudyStreak(['2026-11-20T02:00:00.000Z'], now),
    ).toBe(0);
  });
});

describe('dashboard learning progress', () => {
  it('returns a bounded percentage and handles an empty deck', () => {
    expect(learningProgressPercent(3, 10)).toBe(30);
    expect(learningProgressPercent(12, 10)).toBe(100);
    expect(learningProgressPercent(0, 0)).toBe(0);
  });
});
