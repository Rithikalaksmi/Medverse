/**
 * EpiGuard API client
 * All frontend data fetching goes through here.
 * Change BASE_URL to point at your deployed backend.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`)
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`)
  return res.json()
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as any)?.detail ?? `API error ${res.status}`)
  }
  return res.json()
}

// ── Stats ─────────────────────────────────────────────
export const fetchGlobalStats   = ()            => get('/api/stats/')
export const fetchTimeline      = (weeks = 24)  => get(`/api/stats/timeline?weeks=${weeks}`)

// ── Disease ───────────────────────────────────────────
export const fetchAllCountries  = ()            => get('/api/disease/')
export const fetchCountry       = (code: string)=> get(`/api/disease/country/${code}`)
export const fetchSEIRD         = (days = 90)   => get(`/api/disease/seird?days=${days}`)
export const fetchDiseaseSummary= ()            => get('/api/disease/summary')

// ── Hotspots ──────────────────────────────────────────
export const fetchHotspots      = ()            => get('/api/hotspots/')
export const fetchTopHotspots   = (n = 5)       => get(`/api/hotspots/top?limit=${n}`)

// ── Hospitals ─────────────────────────────────────────
export const fetchHospitals     = ()            => get('/api/hospitals/')
export const fetchHospital      = (id: string)  => get(`/api/hospitals/${id}`)

// ── Resources ─────────────────────────────────────────
export const fetchResources     = ()            => get('/api/resources/')
export const fetchUtilization   = ()            => get('/api/resources/utilization')

// ── Allocation ────────────────────────────────────────
export const fetchScenarios     = ()            => get('/api/allocation/scenarios')
export const runScenario        = (id: string)  => get(`/api/allocation/scenario/${id}`)
export const calculateAllocation= (body: {
  cityId: string; disease: string; severity: string; patientCount: number
})                                              => post('/api/allocation/calculate', body)

// ── Chat ──────────────────────────────────────────────
export const sendChatMessage = (messages: { role: string; content: string }[]) =>
  post<{ reply: string; model: string }>('/api/chat/', { messages })
