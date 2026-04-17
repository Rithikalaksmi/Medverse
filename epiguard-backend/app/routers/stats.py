from fastapi import APIRouter
from app.data.store import GLOBAL_STATS, generate_timeline

router = APIRouter()


@router.get("/")
def get_global_stats():
    """Return global epidemic summary statistics."""
    return GLOBAL_STATS


@router.get("/timeline")
def get_timeline(weeks: int = 24):
    """Weekly case timeline for the past N weeks."""
    return generate_timeline(weeks)
