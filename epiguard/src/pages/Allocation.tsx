import { useState } from 'react'
import { medicalResources, allocationScenarios } from '@/data/mockData'
import { Workflow, CheckCircle, AlertCircle, Clock, ChevronRight, Send } from 'lucide-react'

type ResourceStatus = 'sufficient' | 'limited' | 'unavailable'

interface ResourceAvail {
  resourceType: string
  available: number
  required: number
  status: ResourceStatus
}

interface Recommendation {
  rank: number
  title: string
  description: string
  facilityName: string
  facilityId: number | null
  availableResources: ResourceAvail[]
  estimatedTravelTime: string
  confidence: number
  pros: string[]
  cons: string[]
  actionType: string
}

interface AllocationResult {
  requestId: string
  recommendations: Recommendation[]
  summary: string
  urgencyLevel: string
}

function generateAllocationResult(cityId: string, patientCount: number, severity: string, disease: string): AllocationResult {
  const local = medicalResources.find(r => r.cityId === cityId) || medicalResources[0]
  const others = medicalResources.filter(r => r.cityId !== cityId)
  const nearby = others[0] || medicalResources[1]
  const nearby2 = others[1] || medicalResources[2]

  const bedStatus: ResourceStatus = local.availableBeds >= patientCount ? 'sufficient' : local.availableBeds > 0 ? 'limited' : 'unavailable'
  const isLocal = !!medicalResources.find(r => r.cityId === cityId)

  const recs: Recommendation[] = [
    {
      rank: 1,
      title: isLocal ? 'Admit at Local Facility' : 'Admit at Nearest Facility',
      description: isLocal
        ? `Admit patients directly to ${local.facilityName}, which has local capacity available. Minimal transfer time and immediate care possible.`
        : `No local facility found for city "${cityId}". Routing to nearest: ${local.facilityName} in ${local.cityName}.`,
      facilityName: local.facilityName,
      facilityId: local.id,
      availableResources: [
        { resourceType: 'Beds', available: local.availableBeds, required: patientCount, status: bedStatus },
        { resourceType: 'ICU Beds', available: local.availableIcuBeds, required: Math.ceil(patientCount * 0.2), status: local.availableIcuBeds >= Math.ceil(patientCount * 0.2) ? 'sufficient' : 'limited' },
        { resourceType: 'Ventilators', available: local.availableVentilators, required: Math.ceil(patientCount * 0.1), status: local.availableVentilators >= Math.ceil(patientCount * 0.1) ? 'sufficient' : 'limited' },
        { resourceType: 'Doctors', available: local.availableDoctors, required: Math.ceil(patientCount / 10), status: local.availableDoctors >= Math.ceil(patientCount / 10) ? 'sufficient' : 'limited' },
      ],
      estimatedTravelTime: isLocal ? '< 15 min' : '15–30 min',
      confidence: bedStatus === 'sufficient' ? 0.92 : 0.68,
      pros: isLocal ? ['No patient transfer needed', 'Immediate admission possible', 'Local records available', 'Reduced logistics cost'] : ['Nearest available capacity', 'Well-equipped facility', 'Experienced response team'],
      cons: bedStatus === 'sufficient' ? [] : ['Limited bed availability', 'May need to expand capacity'],
      actionType: 'admit_local',
    },
    {
      rank: 2,
      title: 'Transfer to Nearby Facility',
      description: `Transfer patients to ${nearby.facilityName} in ${nearby.cityName}, which has better capacity and specialized equipment for ${disease} treatment.`,
      facilityName: nearby.facilityName,
      facilityId: nearby.id,
      availableResources: [
        { resourceType: 'Beds', available: nearby.availableBeds, required: patientCount, status: nearby.availableBeds >= patientCount ? 'sufficient' : 'limited' },
        { resourceType: 'ICU Beds', available: nearby.availableIcuBeds, required: Math.ceil(patientCount * 0.2), status: 'sufficient' },
        { resourceType: 'Ventilators', available: nearby.availableVentilators, required: Math.ceil(patientCount * 0.1), status: 'sufficient' },
        { resourceType: 'Doctors', available: nearby.availableDoctors, required: Math.ceil(patientCount / 10), status: 'sufficient' },
      ],
      estimatedTravelTime: '30–45 min',
      confidence: 0.78,
      pros: ['Greater bed capacity', 'Specialized ICU equipment', 'Experienced outbreak response team'],
      cons: ['Requires patient transport', 'Adds 30–45 min to care timeline', 'Logistics coordination needed'],
      actionType: 'transfer_nearby',
    },
    {
      rank: 3,
      title: 'Emergency Resource Procurement',
      description: `Procure additional resources and set up a temporary overflow facility in ${cityId} to handle the patient surge locally.`,
      facilityName: 'Temporary Overflow Site',
      facilityId: null,
      availableResources: [
        { resourceType: 'Portable Beds', available: 80, required: patientCount, status: 80 >= patientCount ? 'sufficient' : 'limited' },
        { resourceType: 'Field ICU Units', available: 15, required: Math.ceil(patientCount * 0.2), status: 15 >= Math.ceil(patientCount * 0.2) ? 'sufficient' : 'limited' },
        { resourceType: 'Portable Ventilators', available: 10, required: Math.ceil(patientCount * 0.1), status: 10 >= Math.ceil(patientCount * 0.1) ? 'sufficient' : 'limited' },
        { resourceType: 'Medical Staff', available: nearby2.availableDoctors + nearby2.availableNurses, required: Math.ceil(patientCount / 5), status: 'sufficient' },
      ],
      estimatedTravelTime: '2–4 hours (setup)',
      confidence: 0.55,
      pros: ['Keeps patients in home city', 'Scalable capacity', 'No individual transport', 'Government reimbursable'],
      cons: ['Setup time required', 'Higher cost', 'Requires procurement approval', 'Temporary infrastructure limitations'],
      actionType: 'procure_resources',
    },
  ]

  return {
    requestId: `req_${Date.now()}`,
    recommendations: recs,
    summary: `${recs.length} recommendations generated for ${patientCount} ${severity} ${disease} patients in ${cityId}.`,
    urgencyLevel: severity === 'critical' ? 'immediate' : severity === 'severe' ? 'urgent' : 'standard',
  }
}

const statusIcon = (s: ResourceStatus) =>
  s === 'sufficient' ? <CheckCircle size={12} style={{ color: '#10b981' }} /> :
  s === 'limited' ? <AlertCircle size={12} style={{ color: '#f59e0b' }} /> :
  <AlertCircle size={12} style={{ color: '#ef4444' }} />

const confidenceColor = (c: number) => c >= 0.85 ? '#10b981' : c >= 0.7 ? '#f59e0b' : '#ef4444'

export default function Allocation() {
  const [cityId, setCityId] = useState('mum')
  const [patientCount, setPatientCount] = useState(40)
  const [severity, setSeverity] = useState('critical')
  const [disease, setDisease] = useState('influenza')
  const [result, setResult] = useState<AllocationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedRank, setSelectedRank] = useState<number>(1)

  function handleSubmit() {
    setLoading(true)
    setTimeout(() => {
      setResult(generateAllocationResult(cityId, patientCount, severity, disease))
      setSelectedRank(1)
      setLoading(false)
    }, 900)
  }

  function loadScenario(s: typeof allocationScenarios[0]) {
    setCityId(s.cityId)
    setPatientCount(s.patientCount)
    setSeverity(s.severity)
    setDisease(s.disease)
  }

  const selectedRec = result?.recommendations.find(r => r.rank === selectedRank)

  return (
    <div className="page fade-in">
      <div className="page-title">Resource Allocation Engine</div>
      <div className="page-sub">AI-powered triage recommendations · ranked by confidence score</div>

      <div className="grid grid-cols-3 gap-4">
        {/* Form */}
        <div className="space-y-4">
          <div className="stat-card">
            <p className="text-xs font-bold mb-3" style={{ color: 'var(--muted)', fontFamily: 'Space Mono', letterSpacing: '0.08em' }}>ALLOCATION PARAMETERS</p>

            <div className="space-y-3">
              <Field label="City ID">
                <select value={cityId} onChange={e => setCityId(e.target.value)} className="w-full px-3 py-2 rounded-lg text-xs" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                  {medicalResources.map(r => <option key={r.cityId} value={r.cityId}>{r.cityName} ({r.cityId})</option>)}
                  <option value="unknown">Unknown City</option>
                </select>
              </Field>

              <Field label={`Patients: ${patientCount}`}>
                <input type="range" min={5} max={200} value={patientCount} onChange={e => setPatientCount(+e.target.value)} className="w-full" style={{ accentColor: 'var(--accent)' }} />
                <div className="flex justify-between text-xs" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>
                  <span>5</span><span>200</span>
                </div>
              </Field>

              <Field label="Severity">
                <div className="grid grid-cols-3 gap-1">
                  {['moderate', 'severe', 'critical'].map(s => (
                    <button key={s} onClick={() => setSeverity(s)}
                      className="py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                      style={{
                        background: severity === s ? (s === 'critical' ? 'rgba(239,68,68,0.2)' : s === 'severe' ? 'rgba(249,115,22,0.2)' : 'rgba(245,158,11,0.2)') : 'var(--surface2)',
                        border: `1px solid ${severity === s ? (s === 'critical' ? '#ef4444' : s === 'severe' ? '#f97316' : '#f59e0b') : 'var(--border)'}`,
                        color: severity === s ? (s === 'critical' ? '#ef4444' : s === 'severe' ? '#f97316' : '#f59e0b') : 'var(--muted)'
                      }}>{s}</button>
                  ))}
                </div>
              </Field>

              <Field label="Disease">
                <select value={disease} onChange={e => setDisease(e.target.value)} className="w-full px-3 py-2 rounded-lg text-xs" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                  {['influenza', 'COVID-19', 'dengue', 'cholera', 'mpox', 'tuberculosis'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </Field>
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full mt-4 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all"
              style={{ background: loading ? 'rgba(0,212,255,0.1)' : 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.4)', color: 'var(--accent)', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? <span className="animate-spin">⟳</span> : <Send size={13}/>}
              {loading ? 'Analyzing...' : 'Generate Recommendations'}
            </button>
          </div>

          {/* Preset Scenarios */}
          <div className="stat-card">
            <p className="text-xs font-bold mb-3" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>PRESET SCENARIOS</p>
            <div className="space-y-2">
              {allocationScenarios.map(s => (
                <button key={s.id} onClick={() => loadScenario(s)}
                  className="w-full text-left px-3 py-2.5 rounded-lg transition-all"
                  style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                  <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{s.label}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>{s.disease} · {s.severity}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="col-span-2">
          {!result && !loading && (
            <div className="stat-card h-full flex flex-col items-center justify-center" style={{ minHeight: 300 }}>
              <Workflow size={40} style={{ color: 'var(--muted)', marginBottom: 12 }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--muted)' }}>Configure parameters and click Generate</p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>AI will rank allocation strategies by confidence</p>
            </div>
          )}

          {loading && (
            <div className="stat-card h-full flex flex-col items-center justify-center" style={{ minHeight: 300 }}>
              <div className="text-4xl mb-3" style={{ animation: 'spin 1s linear infinite' }}>⟳</div>
              <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>Analyzing hospital capacity...</p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>Ranking {medicalResources.length} facilities</p>
            </div>
          )}

          {result && !loading && (
            <div className="fade-in space-y-3">
              {/* Summary */}
              <div className="stat-card py-3 px-4 flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ color: 'var(--text)' }}>{result.summary}</p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>Req ID: {result.requestId}</p>
                </div>
                <span className={`badge ${result.urgencyLevel === 'immediate' ? 'badge-critical' : result.urgencyLevel === 'urgent' ? 'badge-high' : 'badge-medium'}`}>
                  {result.urgencyLevel.toUpperCase()}
                </span>
              </div>

              {/* Rank buttons */}
              <div className="flex gap-2">
                {result.recommendations.map(r => (
                  <button key={r.rank} onClick={() => setSelectedRank(r.rank)}
                    className="flex-1 py-2 rounded-lg text-xs font-bold transition-all"
                    style={{
                      background: selectedRank === r.rank ? 'rgba(0,212,255,0.12)' : 'var(--surface)',
                      border: `1px solid ${selectedRank === r.rank ? 'rgba(0,212,255,0.3)' : 'var(--border)'}`,
                      color: selectedRank === r.rank ? 'var(--accent)' : 'var(--muted)'
                    }}>
                    #{r.rank} {r.title.split(' ').slice(0,2).join(' ')}
                    <div className="text-xs mt-0.5" style={{ color: confidenceColor(r.confidence), fontFamily: 'Space Mono' }}>{Math.round(r.confidence * 100)}% conf.</div>
                  </button>
                ))}
              </div>

              {selectedRec && (
                <div className="stat-card fade-in">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{selectedRec.title}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{selectedRec.description}</p>
                    </div>
                    <div className="text-right ml-4 flex-shrink-0">
                      <p className="text-lg font-bold" style={{ color: confidenceColor(selectedRec.confidence) }}>{Math.round(selectedRec.confidence * 100)}%</p>
                      <p className="text-xs" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>confidence</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={12} style={{ color: 'var(--muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>ETA: <strong style={{ color: 'var(--text)' }}>{selectedRec.estimatedTravelTime}</strong></span>
                    <span className="mx-2" style={{ color: 'var(--border)' }}>·</span>
                    <span className="text-xs" style={{ color: 'var(--muted)' }}>Facility: <strong style={{ color: 'var(--accent)' }}>{selectedRec.facilityName}</strong></span>
                  </div>

                  {/* Resources */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {selectedRec.availableResources.map(r => (
                      <div key={r.resourceType} className="rounded-lg p-2" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                        <div className="flex items-center gap-1 mb-1">{statusIcon(r.status)}<span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{r.resourceType}</span></div>
                        <p className="text-sm font-bold font-mono" style={{ color: r.status === 'sufficient' ? '#10b981' : r.status === 'limited' ? '#f59e0b' : '#ef4444' }}>{r.available}</p>
                        <p className="text-xs" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>need {r.required}</p>
                      </div>
                    ))}
                  </div>

                  {/* Pros/Cons */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold mb-2" style={{ color: '#10b981', fontFamily: 'Space Mono' }}>PROS</p>
                      <div className="space-y-1">
                        {selectedRec.pros.map(p => <p key={p} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--text)' }}><span style={{ color: '#10b981' }}>✓</span>{p}</p>)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold mb-2" style={{ color: '#ef4444', fontFamily: 'Space Mono' }}>CONS</p>
                      <div className="space-y-1">
                        {selectedRec.cons.length > 0
                          ? selectedRec.cons.map(c => <p key={c} className="text-xs flex items-start gap-1.5" style={{ color: 'var(--text)' }}><span style={{ color: '#ef4444' }}>✗</span>{c}</p>)
                          : <p className="text-xs" style={{ color: 'var(--muted)' }}>No significant cons</p>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--muted)' }}>{label}</label>
      {children}
    </div>
  )
}
