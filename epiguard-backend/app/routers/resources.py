from fastapi import APIRouter, Query
from typing import Optional
from app.data.store import MEDICAL_RESOURCES

router = APIRouter()


@router.get("/")
def get_resources(
    country: Optional[str] = Query(None),
    status:  Optional[str] = Query(None, description="critical|moderate|stable"),
):
    data = MEDICAL_RESOURCES
    if country:
        data = [r for r in data if r["countryCode"] == country.upper()]
    if status:
        data = [r for r in data if r["status"] == status]
    return data


@router.get("/utilization")
def get_utilization():
    """Bed and ICU utilization rates per facility."""
    result = []
    for r in MEDICAL_RESOURCES:
        bed_util = round((1 - r["availableBeds"] / r["totalBeds"]) * 100, 1)
        icu_util = round((1 - r["availableIcuBeds"] / r["icuBeds"]) * 100, 1) if r["icuBeds"] else 0
        result.append({
            "facilityName":    r["facilityName"],
            "cityName":        r["cityName"],
            "bedUtilization":  bed_util,
            "icuUtilization":  icu_util,
            "status":          r["status"],
        })
    return result
