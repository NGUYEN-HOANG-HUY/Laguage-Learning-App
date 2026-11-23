from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import TypedDict

from fsrs import Card, Rating, Scheduler, State

FSRS_ALGORITHM_VERSION = "FSRS-6"
PY_FSRS_PACKAGE_VERSION = "6.3.3"
DESIRED_RETENTION = 0.9
LEARNING_STEPS = (timedelta(minutes=2), timedelta(minutes=10))
RELEARNING_STEPS = (timedelta(minutes=10),)
MAXIMUM_INTERVAL_DAYS = 36500

scheduler = Scheduler(
    desired_retention=DESIRED_RETENTION,
    learning_steps=LEARNING_STEPS,
    relearning_steps=RELEARNING_STEPS,
    maximum_interval=MAXIMUM_INTERVAL_DAYS,
    enable_fuzzing=False,
)


class CardState(TypedDict, total=False):
    state: int
    step: int
    stability: float | None
    difficulty: float | None
    due_at: str
    last_review: str | None
    reps: int
    lapses: int


class ScheduledCard(TypedDict):
    state: int
    step: int
    stability: float | None
    difficulty: float | None
    due_at: str
    last_review: str
    reps: int
    lapses: int
    scheduled_days: int
    fsrs_version: str


def _utc_datetime(value: str | datetime) -> datetime:
    parsed = datetime.fromisoformat(value) if isinstance(value, str) else value
    if parsed.tzinfo is None or parsed.utcoffset() != timedelta(0):
        raise ValueError("review timestamps must be timezone-aware UTC.")
    return parsed.astimezone(timezone.utc)


def review_card(
    previous: CardState | None,
    rating: int,
    reviewed_at: str | datetime,
) -> ScheduledCard:
    if rating not in (1, 2, 3, 4):
        raise ValueError("rating must be an integer from 1 to 4.")

    reviewed_datetime = _utc_datetime(reviewed_at)
    if previous is None or previous.get("state", 0) == 0:
        card = Card(due=reviewed_datetime)
    else:
        card_state = int(previous["state"])
        if card_state not in (State.Learning, State.Review, State.Relearning):
            raise ValueError(f"unsupported FSRS card state: {card_state}.")

        due_at = _utc_datetime(previous["due_at"]) if previous.get("due_at") else reviewed_datetime
        last_review = (
            _utc_datetime(previous["last_review"])
            if previous.get("last_review")
            else None
        )
        card = Card(
            state=State(card_state),
            step=int(previous.get("step", 0)) if card_state != State.Review else None,
            stability=previous.get("stability"),
            difficulty=previous.get("difficulty"),
            due=due_at,
            last_review=last_review,
        )

    next_card, _ = scheduler.review_card(
        card,
        Rating(rating),
        review_datetime=reviewed_datetime,
    )
    scheduled_days = max(0, (next_card.due.date() - reviewed_datetime.date()).days)

    return {
        "state": int(next_card.state),
        "step": int(next_card.step or 0),
        "stability": next_card.stability,
        "difficulty": next_card.difficulty,
        "due_at": next_card.due.isoformat(timespec="milliseconds").replace(
            "+00:00", "Z"
        ),
        "last_review": reviewed_datetime.isoformat(
            timespec="milliseconds"
        ).replace("+00:00", "Z"),
        "reps": int(previous.get("reps", 0) if previous else 0) + 1,
        "lapses": int(previous.get("lapses", 0) if previous else 0)
        + int(previous is not None and previous.get("state") == State.Review and rating == Rating.Again),
        "scheduled_days": scheduled_days,
        "fsrs_version": FSRS_ALGORITHM_VERSION,
    }


class Sm2State(TypedDict):
    repetitions: int
    interval_days: int
    ease_factor: float


def review_sm2(
    previous: Sm2State,
    rating: int,
    reviewed_at: str | datetime,
) -> tuple[Sm2State, datetime]:
    if rating not in (1, 2, 3, 4):
        raise ValueError("rating must be an integer from 1 to 4.")

    quality = 0 if rating == 1 else rating + 1
    ease_factor = max(
        1.3,
        previous["ease_factor"]
        + 0.1
        - (5 - quality) * (0.08 + (5 - quality) * 0.02),
    )
    repetitions = 0 if quality < 3 else previous["repetitions"] + 1
    if quality < 3:
        interval_days = 1
    elif repetitions == 1:
        interval_days = 1
    elif repetitions == 2:
        interval_days = 6
    else:
        interval_days = round(previous["interval_days"] * ease_factor)

    due_at = _utc_datetime(reviewed_at) + timedelta(days=interval_days)
    return (
        {
            "repetitions": repetitions,
            "interval_days": interval_days,
            "ease_factor": ease_factor,
        },
        due_at,
    )
