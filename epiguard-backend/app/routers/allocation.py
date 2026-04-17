from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.data.store import ALLOCATION_SCENARIOS, generate_allocation_result

router = APIRouter()


class AllocateRequest(BaseModel):
    cityId:       str
    disease:      str
    severity:     str
    patientCount: int


@router.get("/scenarios")
def get_scenarios():
    """Return pre-built allocation scenario templates."""
    return ALLOCATION_SCENARIOS


@router.post("/calculate")
def calculate_allocation(req: AllocateRequest):
    """
    Calculate resource allocation for a given city and patient load.
    Returns recommended beds, ICU, ventilators, doctors, nurses.
    """
    result = generate_allocation_result(req.cityId, req.patientCount, req.severity)
    if not result:
        raise HTTPException(
            status_code=404,
            detail=f"No facility found for cityId '{req.cityId}'"
        )
    return result


@router.get("/scenario/{scenario_id}")
def run_scenario(scenario_id: str):
    """Run one of the pre-built scenarios and return its allocation."""
    scenario = next((s for s in ALLOCATION_SCENARIOS if s["id"] == scenario_id), None)
    if not scenario:
        raise HTTPException(status_code=404, detail=f"Scenario '{scenario_id}' not found")
    result = generate_allocation_result(
        scenario["cityId"], scenario["patientCount"], scenario["severity"]
    )
    return {"scenario": scenario, "allocation": result}
