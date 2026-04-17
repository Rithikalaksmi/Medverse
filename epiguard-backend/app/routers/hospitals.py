from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.data.store import HOSPITALS

router = APIRouter()


@router.get("/")
def get_hospitals(
    country:  Optional[str] = Query(None, description="Filter by ISO country code"),
    status:   Optional[str] = Query(None, description="Filter by status: available|limited|full"),
):
    data = HOSPITALS
    if country:
        data = [h for h in data if h["countryCode"] == country.upper()]
    if status:
        data = [h for h in data if h["status"] == status]
    return data


@router.get("/{hospital_id}")
def get_hospital(hospital_id: str):
    h = next((h for h in HOSPITALS if h["id"] == hospital_id), None)
    if not h:
        raise HTTPException(status_code=404, detail=f"Hospital '{hospital_id}' not found")
    return h


@router.get("/stats/summary")
def hospital_summary():
    total_beds     = sum(h["beds"] for h in HOSPITALS)
    by_status      = {}
    for h in HOSPITALS:
        by_status[h["status"]] = by_status.get(h["status"], 0) + 1
    return {
        "totalHospitals": len(HOSPITALS),
        "totalBeds":      total_beds,
        "byStatus":       by_status,
    }
