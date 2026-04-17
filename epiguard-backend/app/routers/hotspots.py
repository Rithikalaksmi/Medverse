from fastapi import APIRouter, Query
from typing import Optional
from app.data.store import HOTSPOTS

router = APIRouter()


@router.get("/")
def get_hotspots(
    trend:      Optional[str]  = Query(None, description="rising|stable|declining"),
    min_risk:   Optional[float]= Query(None, description="Minimum risk score (0-10)"),
):
    data = HOTSPOTS
    if trend:
        data = [h for h in data if h["trend"] == trend]
    if min_risk is not None:
        data = [h for h in data if h["riskScore"] >= min_risk]
    return sorted(data, key=lambda h: h["riskScore"], reverse=True)


@router.get("/top")
def get_top_hotspots(limit: int = Query(5, ge=1, le=20)):
    return sorted(HOTSPOTS, key=lambda h: h["riskScore"], reverse=True)[:limit]
