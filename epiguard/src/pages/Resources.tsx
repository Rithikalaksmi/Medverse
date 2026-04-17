import { useState } from 'react'
import { medicalResources, hospitals } from '@/data/mockData'
import { Stethoscope, Bed, Wind, Users, Building2, Filter } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const statusColor: Record<string, string> = {
  critical: '#ef4444', moderate: '#f97316', stable: '#10b981', full: '#ef4444'
}

const statusBadge: Record<string, string> = {
  critical: 'badge-critical', moderate: 'badge-high', stable: 'badge-low', full: 'badge-critical'
}

const hospitalStatusColor: Record<string, string> = {
  available: '#10b981', limited: '#f59e0b', full: '#ef4444'
}

export default function Resources() {
  const [tab, setTab] = useState<'facilities' | 'hospitals'>('facilities')
  const [filter, setFilter] = useState('all')

  const totalBeds = medicalResources.reduce((s, r) => s + r.totalBeds, 0)
  const availBeds = medicalResources.reduce((s, r) => s + r.availableBeds, 0)
  const totalICU = medicalResources.reduce((s, r) => s + r.icuBeds, 0)
  const availICU = medicalResources.reduce((s, r) => s + r.availableIcuBeds, 0)
  const totalVent = medicalResources.reduce((s, r) => s + r.ventilators, 0)
  const availVent = medicalResources.reduce((s, r) => s + r.availableVentilators, 0)
  const occupancy = Math.round(((totalBeds - availBeds) / totalBeds) * 100)

  const bedChartData = medicalResources.map(r => ({
    name: r.cityName,
    total: r.totalBeds,
    available: r.availableBeds,
    occupied: r.totalBeds - r.availableBeds,
  }))

  const filteredHospitals = filter === 'all' ? hospitals : hospitals.filter(h => h.status === filter)

  return (
    <div className="page fade-in">
      <div className="page-title">Medical Resources</div>
      <div className="page-sub">Global hospital capacity · ICU · Ventilators · Personnel</div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <ResourceCard label="Total Beds" total={totalBeds} available={availBeds} icon={<Bed size={16}/>} color="#00d4ff" />
        <ResourceCard label="ICU Beds" total={totalICU} available={availICU} icon={<Stethoscope size={16}/>} color="#a78bfa" />
        <ResourceCard label="Ventilators" total={totalVent} available={availVent} icon={<Wind size={16}/>} color="#f97316" />
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
              <Building2 size={14}/>
            </div>
            <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>Occupancy Rate</span>
          </div>
          <p className="text-2xl font-bold mb-1" style={{ color: occupancy > 85 ? '#ef4444' : occupancy > 70 ? '#f97316' : '#10b981' }}>{occupancy}%</p>
          <div className="h-2 rounded-full" style={{ background: 'var(--border)' }}>
            <div className="h-2 rounded-full" style={{ width: `${occupancy}%`, background: occupancy > 85 ? '#ef4444' : occupancy > 70 ? '#f97316' : '#10b981' }}></div>
          </div>
          <p className="text-xs mt-1" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>{medicalResources.filter(r => r.status === 'critical').length} critical facilities</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(['facilities', 'hospitals'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all"
            style={{
              background: tab === t ? 'rgba(0,212,255,0.12)' : 'var(--surface)',
              border: `1px solid ${tab === t ? 'rgba(0,212,255,0.3)' : 'var(--border)'}`,
              color: tab === t ? 'var(--accent)' : 'var(--muted)'
            }}>
            {t === 'facilities' ? '🏥 Facility Capacity' : '🌍 Global Hospitals'}
          </button>
        ))}
      </div>

      {tab === 'facilities' && (
        <div className="fade-in grid grid-cols-2 gap-4">
          {/* Bed Chart */}
          <div className="stat-card">
            <p className="text-sm font-bold mb-1" style={{ color: 'var(--text)' }}>Bed Availability by City</p>
            <p className="text-xs mb-4" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>Total vs available beds</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={bedChartData} barCategoryGap="30%">
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--muted)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="occupied" stackId="a" fill="#ef444460" radius={[0,0,0,0]} name="Occupied" />
                <Bar dataKey="available" stackId="a" fill="#10b98160" radius={[4,4,0,0]} name="Available" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Facilities Table */}
          <div className="stat-card overflow-auto">
            <p className="text-sm font-bold mb-3" style={{ color: 'var(--text)' }}>Facility Details</p>
            <table>
              <thead>
                <tr>
                  <th>Facility</th>
                  <th>Beds</th>
                  <th>ICU</th>
                  <th>Vents</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {medicalResources.map(r => (
                  <tr key={r.id}>
                    <td>
                      <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{r.facilityName}</p>
                      <p className="text-xs" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>{r.cityName} · {r.countryCode}</p>
                    </td>
                    <td>
                      <p className="text-xs font-mono" style={{ color: 'var(--text)' }}>{r.availableBeds}<span style={{ color: 'var(--muted)' }}>/{r.totalBeds}</span></p>
                    </td>
                    <td>
                      <p className="text-xs font-mono" style={{ color: 'var(--text)' }}>{r.availableIcuBeds}<span style={{ color: 'var(--muted)' }}>/{r.icuBeds}</span></p>
                    </td>
                    <td>
                      <p className="text-xs font-mono" style={{ color: 'var(--text)' }}>{r.availableVentilators}<span style={{ color: 'var(--muted)' }}>/{r.ventilators}</span></p>
                    </td>
                    <td><span className={`badge ${statusBadge[r.status] || 'badge-medium'}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'hospitals' && (
        <div className="fade-in">
          <div className="flex gap-2 mb-3">
            {['all', 'available', 'limited'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className="px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all"
                style={{
                  background: filter === f ? 'rgba(0,212,255,0.1)' : 'var(--surface)',
                  border: `1px solid ${filter === f ? 'rgba(0,212,255,0.3)' : 'var(--border)'}`,
                  color: filter === f ? 'var(--accent)' : 'var(--muted)'
                }}>
                {f === 'all' ? `All (${hospitals.length})` : `${f.charAt(0).toUpperCase()+f.slice(1)} (${hospitals.filter(h=>h.status===f).length})`}
              </button>
            ))}
          </div>
          <div className="stat-card overflow-auto" style={{ maxHeight: 420 }}>
            <table>
              <thead>
                <tr>
                  <th>Hospital</th>
                  <th>Country</th>
                  <th>Type</th>
                  <th>Beds</th>
                  <th>Specialties</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredHospitals.map(h => (
                  <tr key={h.id}>
                    <td>
                      <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{h.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>{h.city} · {h.phone}</p>
                    </td>
                    <td><span className="text-xs font-mono" style={{ color: 'var(--accent)' }}>{h.countryCode}</span></td>
                    <td><span className="text-xs" style={{ color: 'var(--muted)' }}>{h.type}</span></td>
                    <td><span className="text-xs font-mono font-bold" style={{ color: 'var(--text)' }}>{h.beds.toLocaleString()}</span></td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {h.specialties.slice(0,2).map(s => (
                          <span key={s} className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,212,255,0.08)', color: 'var(--accent)', fontSize: '10px' }}>{s}</span>
                        ))}
                        {h.specialties.length > 2 && <span className="text-xs" style={{ color: 'var(--muted)' }}>+{h.specialties.length - 2}</span>}
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{
                        background: `${hospitalStatusColor[h.status]}15`,
                        color: hospitalStatusColor[h.status],
                        border: `1px solid ${hospitalStatusColor[h.status]}40`
                      }}>{h.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function ResourceCard({ label, total, available, icon, color }: { label: string, total: number, available: number, icon: React.ReactNode, color: string }) {
  const pct = Math.round((available / total) * 100)
  return (
    <div className="stat-card">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20`, color }}>
          {icon}
        </div>
        <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>{label}</span>
      </div>
      <p className="text-xl font-bold mb-0.5" style={{ color }}>{available.toLocaleString()}</p>
      <p className="text-xs mb-2" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>of {total.toLocaleString()} available</p>
      <div className="h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: color }}></div>
      </div>
      <p className="text-xs mt-1" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>{pct}% free</p>
    </div>
  )
}
