import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

import pytest

from app.srs import (
    FSRS_ALGORITHM_VERSION,
    PY_FSRS_PACKAGE_VERSION,
    review_card,
)

VECTORS = json.loads(
    (
        Path(__file__).parents[3]
        / "packages"
        / "fsrs-golden"
        / "vectors.json"
    ).read_text(encoding="utf-8")
)


def test_python_fsrs_matches_shared_golden_vectors() -> None:
    assert VECTORS["algorithm"] == FSRS_ALGORITHM_VERSION
    assert PY_FSRS_PACKAGE_VERSION == "6.3.3"

    base = datetime.fromisoformat(VECTORS["baseDate"].replace("Z", "+00:00"))
    for case in VECTORS["cases"]:
        card = None
        reviewed_at = base

        for rating, expected in zip(case["grades"], case["steps"], strict=True):
            card = review_card(card, rating, reviewed_at)
            assert card["state"] == expected["state"], case["name"]
            assert card["step"] == expected["step"], case["name"]
            assert card["stability"] == pytest.approx(
                expected["stability"], abs=1e-6
            ), case["name"]
            assert card["difficulty"] == pytest.approx(
                expected["difficulty"], abs=1e-6
            ), case["name"]
            assert card["due_at"] == expected["due"], case["name"]
            assert card["reps"] == expected["reps"], case["name"]
            assert card["lapses"] == expected["lapses"], case["name"]
            assert card["fsrs_version"] == "FSRS-6"

            reviewed_at = datetime.fromisoformat(
                expected["due"].replace("Z", "+00:00")
            )


def test_review_rejects_non_utc_timestamp() -> None:
    with pytest.raises(ValueError, match="UTC"):
        review_card(None, 3, "2026-01-01T00:00:00")


def test_review_rejects_unknown_rating() -> None:
    with pytest.raises(ValueError, match="rating"):
        review_card(None, 5, datetime.now(timezone.utc))


def test_lapse_increments_only_for_review_card_again() -> None:
    previous = {
        "state": 2,
        "step": 0,
        "stability": 8.2956,
        "difficulty": 1.0,
        "due_at": "2026-01-09T00:00:00Z",
        "last_review": "2026-01-01T00:00:00Z",
        "reps": 1,
        "lapses": 0,
    }

    result = review_card(
        previous,
        1,
        datetime(2026, 1, 9, tzinfo=timezone.utc),
    )

    assert result["state"] == 3
    assert result["lapses"] == 1
    assert result["reps"] == 2
