export type Sm2State = {
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
};

export const initialSm2State: Sm2State = {
  repetitions: 0,
  intervalDays: 0,
  easeFactor: 2.5,
};

export function reviewSm2(
  previous: Sm2State,
  rating: 1 | 2 | 3 | 4,
  reviewedAt: Date,
): { state: Sm2State; dueAt: Date } {
  const quality = rating === 1 ? 0 : rating + 1;
  const easeFactor = Math.max(
    1.3,
    previous.easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02),
  );
  const repetitions = quality < 3 ? 0 : previous.repetitions + 1;
  const intervalDays =
    quality < 3
      ? 1
      : repetitions === 1
        ? 1
        : repetitions === 2
          ? 6
          : Math.round(previous.intervalDays * easeFactor);
  const dueAt = new Date(reviewedAt);
  dueAt.setUTCDate(dueAt.getUTCDate() + intervalDays);

  return {
    state: { repetitions, intervalDays, easeFactor },
    dueAt,
  };
}
