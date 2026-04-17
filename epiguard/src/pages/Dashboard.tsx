import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import { TrendingUp, Globe, AlertTriangle, Activity, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react'
import { fetchGlobalStats, fetchTimeline, fetchAllCountries, fetchHotspots } from '@/lib/api'
import { globalStats as fallbackStats, globalDiseaseData as fallbackDisease, hotspots as fallbackHotspots, generateTimeline } from '@/data/mockData'

const severityColor: Record<string, string> = {
  critical: '#ff3b5c', high: '#ff7c2a', medium: '#f5c842', low: '#00e5a0'
}

export default function Dashboard() {
  const [stats, setStats]         = useState<any>(fallbackStats)
  const [timeline, setTimeline]   = useState<any[]>(generateTimeline(20))
  const [countries, setCountries] = useState<any[]>(fallbackDisease)
  const [hotspots, setHotspots]   = useState<any[]>(fallbackHotspots)
  const [loading, setLoading]     = useState(true)
  const [backendOk, setBackendOk] = useState<boolean | null>(null)

  async function loadData() {
    setLoading(true)
    try {
      const [s, t, c, h] = await Promise.all([
        fetchGlobalStats(),
        fetchTimeline(20),
        fetchAllCountries(),
        fetchHotspots(),
      ])
      setStats(s); setTimeline(t); setCountries(c); setHotspots(h)
      setBackendOk(true)
    } catch {
      // Backend not running — fall back to mock data silently
      setBackendOk(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  return (
    <div className="page fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4 }}>
        <div>
          <div className="page-title">Global Command Center</div>
          <div className="page-sub">
            Real-time epidemic intelligence · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Backend status pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 10px', borderRadius: 20, fontSize: 10, fontFamily: 'Space Mono',
            background: backendOk === null ? 'rgba(100,100,100,0.1)'
              : backendOk ? 'rgba(0,229,160,0.1)' : 'rgba(245,200,66,0.1)',
            border: `1px solid ${backendOk === null ? 'rgba(100,100,100,0.2)'
              : backendOk ? 'rgba(0,229,160,0.3)' : 'rgba(245,200,66,0.3)'}`,
            color: backendOk === null ? 'var(--muted)' : backendOk ? '#00e5a0' : '#f5c842',
          }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%',
              background: backendOk === null ? '#666' : backendOk ? '#00e5a0' : '#f5c842',
            }} />
            {backendOk === null ? 'Connecting...' : backendOk ? 'FastAPI Live' : 'Using Mock Data'}
          </div>
          <button onClick={loadData} style={{
            width: 30, height: 30, borderRadius: 8, border: '1px solid var(--border)',
            background: 'var(--surface)', color: 'var(--muted)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <RefreshCw size={13} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6" style={{ marginTop: 16 }}>
        <StatCard label="Total Global Cases"  value={stats.totalGlobalCases?.toLocaleString() ?? '—'} sub="+245,600 this week"        icon={<Globe size={18} />}         color="var(--accent)" up />
        <StatCard label="Active Countries"    value={stats.activeCountries?.toString() ?? '—'}         sub="Tracking active outbreaks"  icon={<Activity size={18} />}      color="#a78bfa"       up />
        <StatCard label="Fatality Rate"       value={`${stats.fatalityRate ?? '—'}%`}                  sub="Global average"             icon={<AlertTriangle size={18} />} color="#ff3b5c"          />
        <StatCard label="Recovery Rate"       value={`${stats.recoveryRate ?? '—'}%`}                  sub="Of confirmed cases"         icon={<TrendingUp size={18} />}    color="#00e5a0"       up />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Timeline Chart */}
        <div className="col-span-2 stat-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Weekly Case Timeline</p>
              <p className="text-xs" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>Active infections — last 20 weeks</p>
            </div>
            <span className="badge badge-high">ELEVATED</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={timeline}>
              <defs>
                <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="var(--accent)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'var(--muted)', fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'var(--text)' }}
                formatter={(v: number) => [v.toLocaleString(), 'Cases']}
              />
              <Area type="monotone" dataKey="cases" stroke="var(--accent)" strokeWidth={2} fill="url(#gc)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Regions */}
        <div className="stat-card">
          <p className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>Top Affected Regions</p>
          <p className="text-xs mb-4" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>Current active cases</p>
          <div className="space-y-3">
            {countries.slice(0, 6).map((c: any) => (
              <div key={c.countryCode} className="flex items-center gap-3">
                <div className="text-xs w-6 font-mono" style={{ color: 'var(--muted)' }}>{c.countryCode}</div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs" style={{ color: 'var(--text)' }}>{c.countryName}</span>
                    <span className="text-xs font-mono" style={{ color: severityColor[c.severity] }}>{c.activeCases.toLocaleString()}</span>
                  </div>
                  <div className="h-1 rounded-full" style={{ background: 'var(--border)' }}>
                    <div className="h-1 rounded-full" style={{
                      width: `${Math.min(100, (c.activeCases / 412000) * 100)}%`,
                      background: severityColor[c.severity],
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hotspots + Bar Chart */}
      <div className="grid grid-cols-2 gap-4">
        <div className="stat-card">
          <p className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>Active Hotspots</p>
          <p className="text-xs mb-3" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>Ranked by risk score</p>
          <div className="space-y-2">
            {hotspots.map((h: any, i: number) => (
              <div key={h.id} className="flex items-center gap-3 py-2 px-3 rounded-lg" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                <span className="text-xs font-mono w-5" style={{ color: 'var(--muted)' }}>#{i+1}</span>
                <div className="flex-1">
                  <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{h.location}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>{h.cases.toLocaleString()} cases</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: h.riskScore > 9 ? '#ff3b5c' : h.riskScore > 8 ? '#ff7c2a' : '#f5c842' }}>{h.riskScore}</p>
                  <p className="text-xs" style={{ color: h.trend === 'rising' ? '#ff3b5c' : h.trend === 'declining' ? '#00e5a0' : '#f5c842', fontFamily: 'Space Mono' }}>{h.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card">
          <p className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>Weekly Change by Country</p>
          <p className="text-xs mb-4" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>% increase in active cases</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={countries.slice(0, 8)} barSize={14}>
              <XAxis dataKey="countryCode" tick={{ fontSize: 10, fill: 'var(--muted)', fontFamily: 'Space Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip
                contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => [`${v}%`, 'Weekly Change']}
              />
              <Bar dataKey="weeklyChange" radius={[4, 4, 0, 0]}>
                {countries.slice(0, 8).map((entry: any, i: number) => (
                  <Cell key={i} fill={severityColor[entry.severity]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function StatCard({ label, value, sub, icon, color, up }: {
  label: string; value: string; sub: string; icon: React.ReactNode; color: string; up?: boolean
}) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20`, color }}>
          {icon}
        </div>
        {up !== undefined && (
          up ? <ArrowUpRight size={14} style={{ color: '#ff3b5c' }} /> : <ArrowDownRight size={14} style={{ color: '#00e5a0' }} />
        )}
      </div>
      <p className="text-2xl font-bold mb-1" style={{ color: 'var(--text)' }}>{value}</p>
      <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text)' }}>{label}</p>
      <p className="text-xs" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>{sub}</p>
    </div>
  )
}
