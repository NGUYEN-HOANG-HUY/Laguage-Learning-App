from __future__ import annotations

import argparse
import json
from datetime import datetime, time, timedelta, timezone
from typing import Any

from app.srs import review_card, review_sm2


def simulate(
    days: int = 90,
    new_cards_per_day: int = 10,
    start_date: datetime | None = None,
) -> dict[str, Any]:
    if days < 1:
        raise ValueError("days must be at least 1.")
    if not 0 <= new_cards_per_day <= 15:
        raise ValueError("new_cards_per_day must be between 0 and 15.")
    start = start_date or datetime(2026, 1, 1, tzinfo=timezone.utc)
    if start.tzinfo is None or start.utcoffset() != timedelta(0):
        raise ValueError("start_date must be timezone-aware UTC.")

    fsrs_cards: list[dict[str, Any] | None] = []
    sm2_cards: list[dict[str, Any]] = []
    fsrs_daily: list[int] = []
    sm2_daily: list[int] = []

    for day_index in range(days):
        now = datetime.combine(
            start.date() + timedelta(days=day_index),
            time(hour=12),
            tzinfo=timezone.utc,
        )
        for _ in range(new_cards_per_day):
            fsrs_cards.append(None)
            sm2_cards.append(
                {
                    "state": {
                        "repetitions": 0,
                        "interval_days": 0,
                        "ease_factor": 2.5,
                    },
                    "due_at": now,
                }
            )

        fsrs_reviews = 0
        for index, card in enumerate(fsrs_cards):
            if card is None or datetime.fromisoformat(
                card["due_at"].replace("Z", "+00:00")
            ).date() <= now.date():
                fsrs_cards[index] = review_card(card, 3, now)
                fsrs_reviews += 1
        fsrs_daily.append(fsrs_reviews)

        sm2_reviews = 0
        for card in sm2_cards:
            if card["due_at"].date() <= now.date():
                card["state"], card["due_at"] = review_sm2(
                    card["state"],
                    3,
                    now,
                )
                sm2_reviews += 1
        sm2_daily.append(sm2_reviews)

    return {
        "assumptions": {
            "days": days,
            "new_cards_per_day": new_cards_per_day,
            "rating": "Good for every review",
            "review_sessions": "one per simulated day",
            "timezone": "UTC",
        },
        "fsrs_6": {
            "daily_reviews": fsrs_daily,
            "total_reviews": sum(fsrs_daily),
            "average_reviews_per_day": round(sum(fsrs_daily) / days, 2),
            "peak_reviews_per_day": max(fsrs_daily),
        },
        "sm2": {
            "daily_reviews": sm2_daily,
            "total_reviews": sum(sm2_daily),
            "average_reviews_per_day": round(sum(sm2_daily) / days, 2),
            "peak_reviews_per_day": max(sm2_daily),
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Simulate daily review counts for FSRS-6 and SM-2."
    )
    parser.add_argument("--days", type=int, default=90)
    parser.add_argument("--new-cards-per-day", type=int, default=10)
    parser.add_argument("--start-date", default="2026-01-01T00:00:00+00:00")
    args = parser.parse_args()
    start_date = datetime.fromisoformat(args.start_date)
    print(json.dumps(simulate(args.days, args.new_cards_per_day, start_date), indent=2))


if __name__ == "__main__":
    main()
