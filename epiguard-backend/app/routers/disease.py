from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.data.store import GLOBAL_DISEASE_DATA, generate_seird

router = APIRouter()


@router.get("/")
def get_all_countries(
    severity: Optional[str] = Query(None, description="Filter by severity: critical|high|medium|low"),
    disease:  Optional[str] = Query(None, description="Filter by disease name"),
):
    """Return disease data for all tracked countries, with optional filters."""
    data = GLOBAL_DISEASE_DATA
    if severity:
        data = [c for c in data if c["severity"] == severity]
    if disease:
        data = [c for c in data if c["disease"].lower() == disease.lower()]
    return data


@router.get("/country/{code}")
def get_country(code: str):
    """Return disease data for a single country by ISO code (e.g. IN, US, CN)."""
    entry = next((c for c in GLOBAL_DISEASE_DATA if c["countryCode"] == code.upper()), None)
    if not entry:
        raise HTTPException(status_code=404, detail=f"Country '{code}' not found")
    return entry


@router.get("/seird")
def get_seird_model(days: int = Query(90, ge=1, le=365)):
    """Run SEIRD compartmental model simulation for N days."""
    return generate_seird(days)


@router.get("/summary")
def get_summary():
    """Top-level numbers: critical count, totals, etc."""
    critical = [c for c in GLOBAL_DISEASE_DATA if c["severity"] == "critical"]
    total_active = sum(c["activeCases"] for c in GLOBAL_DISEASE_DATA)
    return {
        "totalCountries": len(GLOBAL_DISEASE_DATA),
        "criticalCount":  len(critical),
        "totalActiveCases": total_active,
        "criticalCountries": [c["countryName"] for c in critical],
    }
