import { useState, useEffect, useRef } from 'react'
import { globalDiseaseData, hospitals, hotspots } from '@/data/mockData'
import { MapPin, Activity, Building2, Globe, AlertCircle, Loader2 } from 'lucide-react'

const SEVERITY_COLOR: Record<string, string> = {
  critical: '#ff3b5c', high: '#ff7c2a', medium: '#f5c842', low: '#00e5a0'
}
const SEVERITY_GLOW: Record<string, string> = {
  critical: 'rgba(255,59,92,0.6)', high: 'rgba(255,124,42,0.5)',
  medium: 'rgba(245,200,66,0.4)', low: 'rgba(0,229,160,0.4)'
}
const SEVERITY_SIZE: Record<string, number> = {
  critical: 22, high: 16, medium: 12, low: 9
}

function latLngToPercent(lat: number, lng: number) {
  return {
    x: ((lng + 180) / 360) * 100,
    y: ((90 - lat) / 180) * 100,
  }
}

interface WorldMapProps {
  selected: string | null
  onSelect: (code: string) => void
  layer: string
}

function WorldMap({ selected, onSelect, layer }: WorldMapProps) {
  const [paths, setPaths] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [hovered, setHovered] = useState<string | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    Promise.all([
      import('d3-geo'),
      import('topojson-client'),
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json').then(r => r.json()),
    ])
      .then(([d3geo, topo, topology]) => {
        const projection = (d3geo as any).geoEquirectangular()
          .scale(153)
          .translate([504, 258])
        const pathGen = (d3geo as any).geoPath().projection(projection)
        const countries = (topo as any).feature(topology, topology.objects.countries)
        const ps: string[] = countries.features
          .map((f: any) => pathGen(f))
          .filter(Boolean)
        setPaths(ps)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: 'linear-gradient(160deg, #030d1a 0%, #050f1e 100%)',
      borderRadius: 16, overflow: 'hidden',
    }}>
      {/* Background dots + grid lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <defs>
          <pattern id="dotgrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="0.5" cy="0.5" r="0.45" fill="rgba(0,212,255,0.07)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotgrid)" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(0,212,255,0.09)" strokeWidth="1" strokeDasharray="6,12" />
        <line x1="0" y1="27.7%" x2="100%" y2="27.7%" stroke="rgba(0,212,255,0.04)" strokeWidth="0.5" strokeDasharray="3,16" />
        <line x1="0" y1="72.3%" x2="100%" y2="72.3%" stroke="rgba(0,212,255,0.04)" strokeWidth="0.5" strokeDasharray="3,16" />
        {[16.7, 33.3, 50, 66.7, 83.3].map(p => (
          <line key={p} x1={`${p}%`} y1="0" x2={`${p}%`} y2="100%" stroke="rgba(0,212,255,0.025)" strokeWidth="0.5" />
        ))}
      </svg>

      {/* World map SVG rendered by d3-geo */}
      {loading ? (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10,
        }}>
          <Loader2 size={22} style={{ color: 'var(--accent)', animation: 'spin 1s linear infinite' }} />
          <span style={{ color: 'var(--muted)', fontSize: 11, fontFamily: 'Space Mono' }}>Loading world map...</span>
        </div>
      ) : (
        <svg
          ref={svgRef}
          viewBox="0 0 1008 516"
          preserveAspectRatio="xMidYMid meet"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <g fill="#0d2236" stroke="#1b3f5c" strokeWidth="0.55" strokeLinejoin="round">
            {paths.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </svg>
      )}

      {/* DISEASE MARKERS */}
      {!loading && layer !== 'hospitals' && globalDiseaseData.map(c => {
        const { x, y } = latLngToPercent(c.lat, c.lng)
        const size = SEVERITY_SIZE[c.severity]
        const color = SEVERITY_COLOR[c.severity]
        const glow = SEVERITY_GLOW[c.severity]
        const isSelected = selected === c.countryCode
        const isHovered = hovered === c.countryCode
        return (
          <div
            key={c.countryCode}
            onClick={() => onSelect(c.countryCode)}
            onMouseEnter={() => setHovered(c.countryCode)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'absolute',
              left: `${x}%`, top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer',
              zIndex: isSelected ? 20 : isHovered ? 15 : 2,
            }}
          >
            {(isSelected || c.severity === 'critical') && (
              <div style={{
                position: 'absolute', inset: -(size * 0.9), borderRadius: '50%',
                border: `1.5px solid ${color}`, background: `${color}06`,
                animation: 'mapPulse 1.8s ease-in-out infinite', pointerEvents: 'none',
              }} />
            )}
            <div style={{
              width: size + 12, height: size + 12, borderRadius: '50%',
              background: `${color}10`, border: `1px solid ${color}28`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 ${isSelected || isHovered ? 22 : 8}px ${glow}`,
              transition: 'all 0.2s ease',
              transform: isHovered ? 'scale(1.25)' : isSelected ? 'scale(1.15)' : 'scale(1)',
            }}>
              <div style={{
                width: size + 2, height: size + 2, borderRadius: '50%',
                background: `${color}1a`, border: `1px solid ${color}45`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: size * 0.55, height: size * 0.55, borderRadius: '50%',
                  background: color, boxShadow: `0 0 6px ${color}, 0 0 14px ${glow}`,
                }} />
              </div>
            </div>
          </div>
        )
      })}

      {/* HOTSPOT MARKERS */}
      {!loading && layer === 'hotspots' && hotspots.map(h => {
        const { x, y } = latLngToPercent(h.lat, h.lng)
        const color = h.riskScore >= 9 ? '#ff3b5c' : h.riskScore >= 8 ? '#ff7c2a' : '#f5c842'
        const size = h.riskScore >= 9 ? 26 : h.riskScore >= 8 ? 18 : 13
        return (
          <div key={h.id} style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            transform: 'translate(-50%,-50%)', zIndex: 5,
          }}>
            <div style={{
              width: size, height: size, borderRadius: '50%',
              background: `${color}22`, border: `2px solid ${color}`,
              boxShadow: `0 0 18px ${color}70, 0 0 36px ${color}25`,
              animation: 'hotspotPulse 1.8s ease-in-out infinite',
            }} />
          </div>
        )
      })}

      {/* HOSPITAL MARKERS */}
      {!loading && layer === 'hospitals' && hospitals.map(h => {
        const { x, y } = latLngToPercent(h.lat, h.lng)
        const color = h.status === 'available' ? '#00e5a0' : h.status === 'limited' ? '#f5c842' : '#ff3b5c'
        return (
          <div key={h.id} style={{
            position: 'absolute', left: `${x}%`, top: `${y}%`,
            transform: 'translate(-50%,-50%)', zIndex: 3,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: color, boxShadow: `0 0 8px ${color}80` }} />
          </div>
        )
      })}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes mapPulse {
          0% { transform: scale(0.8); opacity: 0.9; }
          55% { transform: scale(1.6); opacity: 0.1; }
          100% { transform: scale(0.8); opacity: 0.9; }
        }
        @keyframes hotspotPulse {
          0% { transform: scale(0.85); opacity: 1; }
          60% { transform: scale(1.7); opacity: 0.12; }
          100% { transform: scale(0.85); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default function MapPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [layer, setLayer] = useState('disease')
  const selectedData = selected ? globalDiseaseData.find(c => c.countryCode === selected) : null
  const criticalCount = globalDiseaseData.filter(c => c.severity === 'critical').length
  const totalActive = globalDiseaseData.reduce((s, c) => s + c.activeCases, 0)

  const layerTabs = [
    { id: 'disease', label: 'Disease Spread', icon: <Activity size={12} /> },
    { id: 'hospitals', label: 'Hospitals', icon: <Building2 size={12} /> },
    { id: 'hotspots', label: 'Hotspots', icon: <AlertCircle size={12} /> },
  ]

  return (
    <div className="page fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={18} style={{ color: 'var(--accent)' }} />
            <div className="page-title" style={{ marginBottom: 0 }}>Global Epidemic Map</div>
          </div>
          <div className="page-sub" style={{ marginTop: 2 }}>Real-time outbreak surveillance · Click markers for details</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: 'Critical Zones', value: criticalCount, color: '#ff3b5c' },
            { label: 'Active Cases', value: `${(totalActive / 1000).toFixed(0)}K`, color: 'var(--accent)' },
            { label: 'Countries', value: globalDiseaseData.length, color: '#a78bfa' },
          ].map(s => (
            <div key={s.label} style={{
              padding: '7px 14px', borderRadius: 10,
              background: 'var(--surface)', border: '1px solid var(--border)',
              textAlign: 'center', minWidth: 80,
            }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: s.color, fontFamily: 'Space Mono' }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        {layerTabs.map(l => (
          <button key={l.id} onClick={() => setLayer(l.id)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600,
            background: layer === l.id ? 'linear-gradient(135deg, rgba(0,212,255,0.18), rgba(0,212,255,0.08))' : 'var(--surface)',
            border: `1px solid ${layer === l.id ? 'rgba(0,212,255,0.45)' : 'var(--border)'}`,
            color: layer === l.id ? 'var(--accent)' : 'var(--muted)',
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: layer === l.id ? '0 0 12px rgba(0,212,255,0.1)' : 'none',
          }}>
            {l.icon}{l.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 14, flex: 1, minHeight: 0 }}>
        <div style={{
          flex: 1, borderRadius: 16, overflow: 'hidden',
          border: '1px solid rgba(0,212,255,0.14)',
          boxShadow: '0 0 40px rgba(0,0,0,0.5)',
        }}>
          <WorldMap selected={selected} onSelect={cc => setSelected(p => p === cc ? null : cc)} layer={layer} />
        </div>

        <div style={{ width: 250, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
          {selectedData ? (
            <div className="stat-card fade-in" style={{
              border: `1px solid ${SEVERITY_COLOR[selectedData.severity]}30`,
              boxShadow: `0 0 20px ${SEVERITY_GLOW[selectedData.severity]}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{selectedData.countryName}</span>
                <span style={{
                  fontSize: 10, padding: '3px 8px', borderRadius: 20, fontWeight: 700, textTransform: 'uppercase',
                  background: `${SEVERITY_COLOR[selectedData.severity]}18`,
                  color: SEVERITY_COLOR[selectedData.severity],
                  border: `1px solid ${SEVERITY_COLOR[selectedData.severity]}40`,
                }}>{selectedData.severity}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  ['Disease', selectedData.disease, 'var(--accent)'],
                  ['Total Cases', selectedData.totalCases.toLocaleString(), 'var(--text)'],
                  ['Active Cases', selectedData.activeCases.toLocaleString(), SEVERITY_COLOR[selectedData.severity]],
                  ['Weekly Change', `+${selectedData.weeklyChange}%`, '#f59e0b'],
                ].map(([k, v, c]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{k}</span>
                    <span style={{ fontSize: 11, fontFamily: 'Space Mono', fontWeight: 700, color: c as string }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ height: 5, borderRadius: 3, background: 'var(--surface2)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min((selectedData.activeCases / selectedData.totalCases) * 100, 100).toFixed(0)}%`,
                    background: `linear-gradient(90deg, ${SEVERITY_COLOR[selectedData.severity]}, ${SEVERITY_COLOR[selectedData.severity]}70)`,
                    borderRadius: 3, transition: 'width 0.6s ease',
                  }} />
                </div>
                <p style={{ fontSize: 10, marginTop: 4, color: 'var(--muted)' }}>
                  {((selectedData.activeCases / selectedData.totalCases) * 100).toFixed(1)}% currently active
                </p>
              </div>
            </div>
          ) : (
            <div className="stat-card" style={{ textAlign: 'center', padding: '24px 16px' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, margin: '0 auto 10px',
                background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <MapPin size={20} style={{ color: 'var(--muted)' }} />
              </div>
              <p style={{ fontSize: 12, color: 'var(--muted)' }}>Click a marker to view outbreak details</p>
            </div>
          )}

          <div className="stat-card">
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', fontFamily: 'Space Mono', letterSpacing: '0.08em', marginBottom: 10 }}>SEVERITY</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {Object.entries(SEVERITY_COLOR).map(([s, c]) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: c, boxShadow: `0 0 8px ${SEVERITY_GLOW[s]}`, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: 'var(--text)', textTransform: 'capitalize' }}>{s}</span>
                      <span style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'Space Mono' }}>{globalDiseaseData.filter(d => d.severity === s).length}</span>
                    </div>
                    <div style={{ height: 2, borderRadius: 1, background: 'var(--surface2)', marginTop: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 1, background: c,
                        width: `${(globalDiseaseData.filter(d => d.severity === s).length / globalDiseaseData.length) * 100}%`,
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="stat-card" style={{ flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', fontFamily: 'Space Mono', letterSpacing: '0.08em', marginBottom: 10 }}>ALL REGIONS</p>
            <div style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {globalDiseaseData.slice().sort((a, b) => b.activeCases - a.activeCases).map(c => (
                <div key={c.countryCode} onClick={() => setSelected(c.countryCode === selected ? null : c.countryCode)} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '6px 8px', borderRadius: 8, cursor: 'pointer',
                  background: selected === c.countryCode ? `${SEVERITY_COLOR[c.severity]}10` : 'transparent',
                  border: selected === c.countryCode ? `1px solid ${SEVERITY_COLOR[c.severity]}25` : '1px solid transparent',
                  transition: 'all 0.15s',
                }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: SEVERITY_COLOR[c.severity], flexShrink: 0 }} />
                  <span style={{ fontSize: 10, fontFamily: 'Space Mono', color: 'var(--muted)', minWidth: 26 }}>{c.countryCode}</span>
                  <span style={{ fontSize: 11, flex: 1, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.countryName}</span>
                  <span style={{ fontSize: 10, fontFamily: 'Space Mono', color: SEVERITY_COLOR[c.severity], flexShrink: 0 }}>{(c.activeCases / 1000).toFixed(0)}K</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
