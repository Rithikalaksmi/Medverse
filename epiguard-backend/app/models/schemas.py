from pydantic import BaseModel
from typing import Optional, List


class CountryDisease(BaseModel):
    countryCode: str
    countryName: str
    lat: float
    lng: float
    totalCases: int
    activeCases: int
    severity: str          # critical | high | medium | low
    weeklyChange: float
    disease: str


class GlobalStats(BaseModel):
    totalGlobalCases: int
    activeCountries: int
    weeklyNewCases: int
    alertLevel: str
    topAffectedRegions: List[str]
    fatalityRate: float
    recoveryRate: float


class Hotspot(BaseModel):
    id: str
    location: str
    countryCode: str
    lat: float
    lng: float
    cases: int
    riskScore: float
    trend: str             # rising | stable | declining


class Hospital(BaseModel):
    id: str
    name: str
    countryCode: str
    city: str
    lat: float
    lng: float
    type: str
    beds: int
    specialties: List[str]
    phone: str
    status: str            # available | limited | full


class MedicalResource(BaseModel):
    id: int
    facilityName: str
    cityId: str
    cityName: str
    countryCode: str
    facilityType: str
    totalBeds: int
    availableBeds: int
    icuBeds: int
    availableIcuBeds: int
    ventilators: int
    availableVentilators: int
    availableDoctors: int
    availableNurses: int
    status: str            # critical | moderate | stable


class AllocationScenario(BaseModel):
    id: str
    label: str
    cityId: str
    disease: str
    severity: str
    patientCount: int


class AllocationResult(BaseModel):
    facilityName: str
    cityName: str
    bedsAllocated: int
    icuAllocated: int
    ventilatorsAllocated: int
    doctorsAllocated: int
    nursesAllocated: int
    priority: str


class TimelinePoint(BaseModel):
    date: str
    week: str
    cases: int
    deaths: int
    recovered: int
    active: int


class ChatMessage(BaseModel):
    role: str      # user | assistant
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]


class ChatResponse(BaseModel):
    reply: str
    model: str
