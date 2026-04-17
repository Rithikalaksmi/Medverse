import { useState } from 'react'
import { generateSEIRD, generateTFT, generateXGBoost } from '@/data/mockData'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter, Cell
} from 'recharts'
import { Brain, TrendingUp, AlertTriangle, BarChart2, Cpu } from 'lucide-react'

const tabs = [
  { id: 'seird', label: 'SEIRD Model', icon: <TrendingUp size={13} /> },
  { id: 'tft', label: 'TFT Forecast', icon: <Brain size={13} /> },
  { id: 'xgboost', label: 'XGBoost', icon: <BarChart2 size={13} /> },
  { id: 'anomaly', label: 'Anomaly', icon: <AlertTriangle size={13} /> },
]

export default function Models() {
  const [active, setActive] = useState('seird')
  const seird = generateSEIRD(90)
  const tft = generateTFT(16)
  const xgb = generateXGBoost()

  // Anomaly data
  const anomalyData = Array.from({ length: 52 }, (_, i) => {
    const base = 40000 + Math.sin(i * 0.3) * 8000 + (Math.random() - 0.4) * 5000
    const isAnomaly = Math.random() < 0.08
    return { week: `W${i+1}`, cases: isAnomaly ? base * 1.8 : base, isAnomaly, score: isAnomaly ? 0.8 + Math.random() * 0.2 : Math.random() * 0.3 }
  })

  return (
    <div className="page fade-in">
      <div className="page-title">AI Predictive Models</div>
      <div className="page-sub">Epidemiological forecasting · SEIRD · TFT · XGBoost · Anomaly Detection</div>

      {/* Model summary cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'SEIRD R₀', value: '3.50', sub: 'Basic reproduction', color: '#00d4ff' },
          { label: 'TFT Accuracy', value: '91.2%', sub: '8-week forecast', color: '#a78bfa' },
          { label: 'XGBoost Conf.', value: '87.4%', sub: 'Feature-based pred.', color: '#f59e0b' },
          { label: 'Anomalies', value: '4', sub: 'Detected this month', color: '#ef4444' },
        ].map(m => (
          <div key={m.label} className="stat-card py-3">
            <p className="text-2xl font-bold mb-1" style={{ color: m.color }}>{m.value}</p>
            <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{m.label}</p>
            <p className="text-xs" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: active === t.id ? 'rgba(0,212,255,0.12)' : 'var(--surface)',
              border: `1px solid ${active === t.id ? 'rgba(0,212,255,0.3)' : 'var(--border)'}`,
              color: active === t.id ? 'var(--accent)' : 'var(--muted)'
            }}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {active === 'seird' && (
        <div className="fade-in">
          <div className="stat-card mb-4">
            <p className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>SEIRD Compartmental Model</p>
            <p className="text-xs mb-4" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>β=0.35 · σ=0.2 · γ=0.1 · δ=0.005 · N=1,000,000</p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={seird.filter((_, i) => i % 2 === 0)}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} formatter={(v: number) => v.toLocaleString()} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="susceptible" stroke="#64748b" strokeWidth={1.5} dot={false} name="Susceptible" />
                <Line type="monotone" dataKey="exposed" stroke="#f59e0b" strokeWidth={2} dot={false} name="Exposed" />
                <Line type="monotone" dataKey="infected" stroke="#ef4444" strokeWidth={2.5} dot={false} name="Infected" />
                <Line type="monotone" dataKey="recovered" stroke="#10b981" strokeWidth={2} dot={false} name="Recovered" />
                <Line type="monotone" dataKey="deceased" stroke="#7c3aed" strokeWidth={1.5} dot={false} name="Deceased" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Peak Infected', value: Math.round(Math.max(...seird.map(d => d.infected))).toLocaleString(), color: '#ef4444' },
              { label: 'R₀ Value', value: '3.50', color: '#f97316' },
              { label: 'Total Deaths (90d)', value: Math.round(seird[89].deceased).toLocaleString(), color: '#7c3aed' },
            ].map(s => (
              <div key={s.label} className="stat-card py-3 text-center">
                <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs" style={{ color: 'var(--muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {active === 'tft' && (
        <div className="fade-in stat-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Temporal Fusion Transformer</p>
              <p className="text-xs" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>16-week probabilistic forecast with P10/P50/P90 bands</p>
            </div>
            <span className="badge badge-medium">91.2% ACCURACY</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={tft}>
              <defs>
                <linearGradient id="band" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: 'var(--muted)' }} axisLine={false} tickLine={false} tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} formatter={(v: number) => v ? v.toLocaleString() : 'N/A'} />
              <Area type="monotone" dataKey="p90" fill="url(#band)" stroke="none" name="P90" />
              <Line type="monotone" dataKey="p10" stroke="#7c3aed" strokeWidth={1} dot={false} strokeDasharray="3 3" name="P10" />
              <Line type="monotone" dataKey="predicted" stroke="#a78bfa" strokeWidth={2.5} dot={false} name="Forecast" />
              <Line type="monotone" dataKey="actual" stroke="#00d4ff" strokeWidth={2} dot={false} name="Actual" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {active === 'xgboost' && (
        <div className="fade-in stat-card">
          <p className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>XGBoost Feature Importance (SHAP Values)</p>
          <p className="text-xs mb-4" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>Feature contribution to case prediction</p>
          <div className="space-y-3">
            {xgb.map((f, i) => (
              <div key={f.feature}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{f.feature}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono" style={{ color: f.direction === 'positive' ? '#ef4444' : '#10b981' }}>{f.direction === 'positive' ? '+' : '-'}{f.impact.toFixed(3)}</span>
                    <span className="badge" style={{ background: f.direction === 'positive' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', color: f.direction === 'positive' ? '#ef4444' : '#10b981', border: 'none' }}>{f.direction}</span>
                  </div>
                </div>
                <div className="h-2 rounded-full" style={{ background: 'var(--border)' }}>
                  <div className="h-2 rounded-full transition-all duration-700" style={{
                    width: `${(f.impact / xgb[0].impact) * 100}%`,
                    background: f.direction === 'positive' ? 'linear-gradient(90deg, #f97316, #ef4444)' : 'linear-gradient(90deg, #059669, #10b981)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {active === 'anomaly' && (
        <div className="fade-in stat-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>Anomaly Detection — Last 52 Weeks</p>
              <p className="text-xs" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>Isolation Forest · red dots = anomalies detected</p>
            </div>
            <span className="badge badge-critical">4 ANOMALIES</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <XAxis dataKey="week" tick={{ fontSize: 9, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="cases" tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} formatter={(v: number) => v.toLocaleString()} />
              <Scatter data={anomalyData}>
                {anomalyData.map((d, i) => (
                  <Cell key={i} fill={d.isAnomaly ? '#ef4444' : '#00d4ff'} opacity={d.isAnomaly ? 1 : 0.5} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
