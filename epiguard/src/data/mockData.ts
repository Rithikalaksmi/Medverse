// Mock data extracted from API routes

export const globalDiseaseData = [
  { countryCode: "US", countryName: "United States", lat: 37.09, lng: -95.71, totalCases: 1250000, activeCases: 89400, severity: "high", weeklyChange: 12.3, disease: "influenza" },
  { countryCode: "IN", countryName: "India", lat: 20.59, lng: 78.96, totalCases: 3200000, activeCases: 245000, severity: "critical", weeklyChange: 28.7, disease: "influenza" },
  { countryCode: "BR", countryName: "Brazil", lat: -14.24, lng: -51.93, totalCases: 890000, activeCases: 67000, severity: "high", weeklyChange: 9.4, disease: "influenza" },
  { countryCode: "DE", countryName: "Germany", lat: 51.17, lng: 10.45, totalCases: 420000, activeCases: 31000, severity: "medium", weeklyChange: 4.2, disease: "influenza" },
  { countryCode: "FR", countryName: "France", lat: 46.23, lng: 2.21, totalCases: 380000, activeCases: 28500, severity: "medium", weeklyChange: 3.8, disease: "influenza" },
  { countryCode: "GB", countryName: "United Kingdom", lat: 55.38, lng: -3.44, totalCases: 460000, activeCases: 34000, severity: "medium", weeklyChange: 5.1, disease: "influenza" },
  { countryCode: "CN", countryName: "China", lat: 35.86, lng: 104.2, totalCases: 5600000, activeCases: 412000, severity: "critical", weeklyChange: 35.2, disease: "influenza" },
  { countryCode: "JP", countryName: "Japan", lat: 36.2, lng: 138.25, totalCases: 780000, activeCases: 58000, severity: "high", weeklyChange: 8.9, disease: "influenza" },
  { countryCode: "AU", countryName: "Australia", lat: -25.27, lng: 133.78, totalCases: 290000, activeCases: 21500, severity: "medium", weeklyChange: 2.3, disease: "influenza" },
  { countryCode: "ZA", countryName: "South Africa", lat: -30.56, lng: 22.94, totalCases: 210000, activeCases: 15800, severity: "medium", weeklyChange: 6.7, disease: "influenza" },
  { countryCode: "MX", countryName: "Mexico", lat: 23.63, lng: -102.55, totalCases: 340000, activeCases: 25600, severity: "medium", weeklyChange: 7.1, disease: "influenza" },
  { countryCode: "NG", countryName: "Nigeria", lat: 9.08, lng: 8.68, totalCases: 450000, activeCases: 34000, severity: "high", weeklyChange: 15.4, disease: "influenza" },
  { countryCode: "RU", countryName: "Russia", lat: 61.52, lng: 105.32, totalCases: 670000, activeCases: 50000, severity: "high", weeklyChange: 11.8, disease: "influenza" },
  { countryCode: "ID", countryName: "Indonesia", lat: -0.79, lng: 113.92, totalCases: 560000, activeCases: 42000, severity: "high", weeklyChange: 13.2, disease: "influenza" },
  { countryCode: "PK", countryName: "Pakistan", lat: 30.37, lng: 69.35, totalCases: 620000, activeCases: 46500, severity: "high", weeklyChange: 16.8, disease: "influenza" },
  { countryCode: "AR", countryName: "Argentina", lat: -38.42, lng: -63.62, totalCases: 220000, activeCases: 16500, severity: "medium", weeklyChange: 3.4, disease: "influenza" },
  { countryCode: "CA", countryName: "Canada", lat: 56.13, lng: -106.35, totalCases: 310000, activeCases: 23200, severity: "medium", weeklyChange: 4.9, disease: "influenza" },
  { countryCode: "KR", countryName: "South Korea", lat: 35.91, lng: 127.77, totalCases: 290000, activeCases: 21700, severity: "medium", weeklyChange: 3.1, disease: "influenza" },
  { countryCode: "TH", countryName: "Thailand", lat: 15.87, lng: 100.99, totalCases: 190000, activeCases: 14300, severity: "low", weeklyChange: 2.1, disease: "influenza" },
  { countryCode: "EG", countryName: "Egypt", lat: 26.82, lng: 30.80, totalCases: 180000, activeCases: 13500, severity: "low", weeklyChange: 1.9, disease: "influenza" },
];

export const globalStats = {
  totalGlobalCases: 15780000,
  activeCountries: 87,
  weeklyNewCases: 245600,
  alertLevel: "elevated",
  topAffectedRegions: ["South Asia", "East Asia", "North America", "West Africa"],
  fatalityRate: 1.2,
  recoveryRate: 84.5
};

export const hotspots = [
  { id: "hs1", location: "Mumbai, India", countryCode: "IN", lat: 19.08, lng: 72.88, cases: 345000, riskScore: 9.2, trend: "rising" },
  { id: "hs2", location: "New York City, USA", countryCode: "US", lat: 40.71, lng: -74.01, cases: 156000, riskScore: 8.7, trend: "rising" },
  { id: "hs3", location: "Shanghai, China", countryCode: "CN", lat: 31.23, lng: 121.47, cases: 289000, riskScore: 9.5, trend: "rising" },
  { id: "hs4", location: "Lagos, Nigeria", countryCode: "NG", lat: 6.52, lng: 3.38, cases: 187000, riskScore: 7.9, trend: "stable" },
  { id: "hs5", location: "Jakarta, Indonesia", countryCode: "ID", lat: -6.21, lng: 106.85, cases: 210000, riskScore: 8.1, trend: "rising" },
  { id: "hs6", location: "Moscow, Russia", countryCode: "RU", lat: 55.75, lng: 37.62, cases: 145000, riskScore: 7.3, trend: "declining" },
  { id: "hs7", location: "Karachi, Pakistan", countryCode: "PK", lat: 24.86, lng: 67.01, cases: 230000, riskScore: 8.9, trend: "rising" },
  { id: "hs8", location: "Dhaka, Bangladesh", countryCode: "BD", lat: 23.81, lng: 90.41, cases: 178000, riskScore: 8.4, trend: "rising" },
];

export const hospitals = [
  { id: "h1", name: "Massachusetts General Hospital", countryCode: "US", city: "Boston", lat: 42.36, lng: -71.07, type: "Academic Medical Center", beds: 1011, specialties: ["Cardiology", "Oncology", "Neurology", "Infectious Disease"], phone: "+1-617-726-2000", status: "available" },
  { id: "h2", name: "Johns Hopkins Hospital", countryCode: "US", city: "Baltimore", lat: 39.30, lng: -76.59, type: "Academic Medical Center", beds: 1162, specialties: ["Neurosurgery", "Oncology", "Cardiology", "Infectious Disease"], phone: "+1-410-955-5000", status: "available" },
  { id: "h3", name: "Cleveland Clinic", countryCode: "US", city: "Cleveland", lat: 41.50, lng: -81.62, type: "Specialty Hospital", beds: 1332, specialties: ["Cardiology", "Orthopedics", "Urology", "Gastroenterology"], phone: "+1-800-223-2273", status: "limited" },
  { id: "h4", name: "All India Institute of Medical Sciences", countryCode: "IN", city: "New Delhi", lat: 28.57, lng: 77.21, type: "Government Teaching Hospital", beds: 2500, specialties: ["All Specialties", "Infectious Disease", "Pulmonology"], phone: "+91-11-26588500", status: "limited" },
  { id: "h5", name: "Tata Memorial Hospital", countryCode: "IN", city: "Mumbai", lat: 19.00, lng: 72.84, type: "Cancer Centre", beds: 629, specialties: ["Oncology", "Radiation Therapy", "Surgical Oncology"], phone: "+91-22-24177000", status: "available" },
  { id: "h6", name: "Charité – Universitätsmedizin Berlin", countryCode: "DE", city: "Berlin", lat: 52.53, lng: 13.38, type: "University Hospital", beds: 3001, specialties: ["All Specialties", "Infectious Disease", "Neurology"], phone: "+49-30-450-50", status: "available" },
  { id: "h7", name: "Guy's and St Thomas' NHS Foundation Trust", countryCode: "GB", city: "London", lat: 51.50, lng: -0.12, type: "NHS Trust Hospital", beds: 1810, specialties: ["Cardiology", "Renal", "Cancer", "Neurology"], phone: "+44-20-7188-7188", status: "available" },
  { id: "h8", name: "Peking Union Medical College Hospital", countryCode: "CN", city: "Beijing", lat: 39.91, lng: 116.41, type: "University Hospital", beds: 2000, specialties: ["Internal Medicine", "Surgery", "Infectious Disease"], phone: "+86-10-69156114", status: "limited" },
  { id: "h9", name: "The University of Tokyo Hospital", countryCode: "JP", city: "Tokyo", lat: 35.71, lng: 139.77, type: "University Hospital", beds: 1218, specialties: ["All Specialties", "Oncology", "Neurology"], phone: "+81-3-3815-5411", status: "available" },
  { id: "h10", name: "Royal Melbourne Hospital", countryCode: "AU", city: "Melbourne", lat: -37.80, lng: 144.96, type: "Public Teaching Hospital", beds: 766, specialties: ["Cardiology", "Neurosciences", "Trauma", "Infectious Disease"], phone: "+61-3-9342-7000", status: "available" },
  { id: "h11", name: "Toronto General Hospital", countryCode: "CA", city: "Toronto", lat: 43.66, lng: -79.39, type: "Teaching Hospital", beds: 471, specialties: ["Cardiac Surgery", "Transplant", "Infectious Disease"], phone: "+1-416-340-4800", status: "available" },
  { id: "h12", name: "Hospital das Clínicas São Paulo", countryCode: "BR", city: "São Paulo", lat: -23.56, lng: -46.67, type: "University Hospital", beds: 2200, specialties: ["All Specialties", "Infectious Disease", "Trauma"], phone: "+55-11-2661-0000", status: "limited" },
  { id: "h13", name: "Chris Hani Baragwanath Academic Hospital", countryCode: "ZA", city: "Johannesburg", lat: -26.27, lng: 27.87, type: "Academic Hospital", beds: 3200, specialties: ["All Specialties", "HIV/AIDS", "Trauma", "Obstetrics"], phone: "+27-11-933-8000", status: "limited" },
  { id: "h14", name: "Karolinska University Hospital", countryCode: "SE", city: "Stockholm", lat: 59.35, lng: 18.04, type: "University Hospital", beds: 1640, specialties: ["Oncology", "Transplant", "Cardiology", "Infectious Disease"], phone: "+46-8-517-700-00", status: "available" },
  { id: "h15", name: "Narayana Health City", countryCode: "IN", city: "Bengaluru", lat: 12.90, lng: 77.61, type: "Multi-Specialty Hospital", beds: 1400, specialties: ["Cardiac Surgery", "Oncology", "Neurosciences", "Transplant"], phone: "+91-80-71222222", status: "available" },
];

export const medicalResources = [
  { id: 1, facilityName: "City General Hospital", cityId: "nyc", cityName: "New York City", countryCode: "US", facilityType: "General Hospital", totalBeds: 850, availableBeds: 120, icuBeds: 80, availableIcuBeds: 12, ventilators: 50, availableVentilators: 8, availableDoctors: 45, availableNurses: 180, status: "critical" },
  { id: 2, facilityName: "Regional Medical Center", cityId: "la", cityName: "Los Angeles", countryCode: "US", facilityType: "Medical Center", totalBeds: 600, availableBeds: 210, icuBeds: 60, availableIcuBeds: 22, ventilators: 40, availableVentilators: 15, availableDoctors: 38, availableNurses: 150, status: "moderate" },
  { id: 3, facilityName: "Apollo Multi-specialty Hospital", cityId: "mum", cityName: "Mumbai", countryCode: "IN", facilityType: "Multi-Specialty", totalBeds: 1200, availableBeds: 85, icuBeds: 120, availableIcuBeds: 5, ventilators: 80, availableVentilators: 3, availableDoctors: 72, availableNurses: 280, status: "critical" },
  { id: 4, facilityName: "Delhi National Hospital", cityId: "del", cityName: "New Delhi", countryCode: "IN", facilityType: "Government Hospital", totalBeds: 2000, availableBeds: 310, icuBeds: 200, availableIcuBeds: 40, ventilators: 150, availableVentilators: 22, availableDoctors: 110, availableNurses: 450, status: "moderate" },
  { id: 5, facilityName: "Charité Berlin North", cityId: "ber", cityName: "Berlin", countryCode: "DE", facilityType: "University Hospital", totalBeds: 1500, availableBeds: 480, icuBeds: 150, availableIcuBeds: 55, ventilators: 100, availableVentilators: 32, availableDoctors: 85, availableNurses: 320, status: "stable" },
  { id: 6, facilityName: "NHS Royal London", cityId: "lon", cityName: "London", countryCode: "GB", facilityType: "NHS Trust", totalBeds: 900, availableBeds: 175, icuBeds: 90, availableIcuBeds: 18, ventilators: 60, availableVentilators: 11, availableDoctors: 55, availableNurses: 220, status: "moderate" },
  { id: 7, facilityName: "Shenzhen People's Hospital", cityId: "szn", cityName: "Shenzhen", countryCode: "CN", facilityType: "General Hospital", totalBeds: 1800, availableBeds: 45, icuBeds: 180, availableIcuBeds: 2, ventilators: 120, availableVentilators: 1, availableDoctors: 96, availableNurses: 380, status: "critical" },
  { id: 8, facilityName: "Tokyo Medical University Hospital", cityId: "tok", cityName: "Tokyo", countryCode: "JP", facilityType: "University Hospital", totalBeds: 1100, availableBeds: 290, icuBeds: 110, availableIcuBeds: 28, ventilators: 75, availableVentilators: 19, availableDoctors: 68, availableNurses: 270, status: "stable" },
];

export function generateTimeline(weeks = 24) {
  const data = [];
  const now = new Date();
  let baseCases = 50000;
  for (let i = weeks; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    const variation = 1 + (Math.sin(i * 0.4) * 0.2 + (Math.random() - 0.4) * 0.15);
    baseCases = Math.max(10000, baseCases * variation);
    const cases = Math.floor(baseCases);
    const deaths = Math.floor(cases * 0.012);
    const recovered = Math.floor(cases * 0.82);
    data.push({
      date: d.toISOString().split("T")[0],
      week: `W${String(Math.ceil(i / 4 + 1)).padStart(2, '0')}`,
      cases,
      deaths,
      recovered,
      active: cases - deaths - recovered
    });
  }
  return data;
}

export function generateSEIRD(days = 90) {
  const population = 1000000;
  const beta = 0.35, sigma = 0.2, gamma = 0.1, delta = 0.005;
  let S = population - 1000, E = 800, I = 200, R = 0, D = 0;
  const timeline = [];
  for (let day = 0; day < days; day++) {
    const newExposed = (beta * S * I) / population;
    const newInfected = sigma * E;
    const newRecovered = gamma * I;
    const newDeceased = delta * I;
    S = Math.max(0, S - newExposed);
    E = Math.max(0, E + newExposed - newInfected);
    I = Math.max(0, I + newInfected - newRecovered - newDeceased);
    R = R + newRecovered;
    D = D + newDeceased;
    timeline.push({ day, susceptible: Math.round(S), exposed: Math.round(E), infected: Math.round(I), recovered: Math.round(R), deceased: Math.round(D) });
  }
  return timeline;
}

export function generateTFT(numWeeks = 16) {
  const forecasts = [];
  let base = 50000;
  const today = new Date();
  for (let i = -4; i < numWeeks; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i * 7);
    const noise = 1 + (Math.random() - 0.4) * 0.2;
    base = Math.round(base * noise);
    const spread = base * 0.2;
    forecasts.push({
      date: d.toISOString().split("T")[0],
      predicted: base,
      p10: Math.round(base - spread * 1.5),
      p50: base,
      p90: Math.round(base + spread * 1.5),
      actual: i < 0 ? Math.round(base * (1 + (Math.random() - 0.5) * 0.1)) : null,
    });
  }
  return forecasts;
}

export function generateXGBoost() {
  const features = ["Temperature", "Humidity", "Population Density", "Vaccination Rate", "Mobility Index", "Air Quality", "Healthcare Access", "Prev Week Cases"];
  return features.map(f => ({
    feature: f,
    value: parseFloat((Math.random() * 2 - 0.5).toFixed(3)),
    impact: parseFloat((Math.random() * 0.35).toFixed(3)),
    direction: Math.random() > 0.45 ? "positive" : "negative"
  })).sort((a, b) => b.impact - a.impact);
}

export const allocationScenarios = [
  {
    id: "s1",
    label: "Mumbai Surge — 60 critical patients",
    cityId: "mum", disease: "influenza", severity: "critical", patientCount: 60
  },
  {
    id: "s2",
    label: "Delhi Outbreak — 30 severe patients",
    cityId: "del", disease: "dengue", severity: "severe", patientCount: 30
  },
  {
    id: "s3",
    label: "NYC Wave — 45 moderate patients",
    cityId: "nyc", disease: "COVID-19", severity: "moderate", patientCount: 45
  },
];
