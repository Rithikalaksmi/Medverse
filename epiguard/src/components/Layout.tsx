import { Link, useLocation } from 'wouter'
import { Activity, Map as MapIcon, LineChart, Stethoscope, Workflow, MessageSquare, Shield, GitBranch } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Dashboard', icon: Activity },
  { href: '/map', label: 'World Map', icon: MapIcon },
  { href: '/models', label: 'AI Models', icon: LineChart },
  { href: '/resources', label: 'Resources', icon: Stethoscope },
  { href: '/allocation', label: 'Allocation', icon: Workflow },
  { href: '/chatbot', label: 'AI Assistant', icon: MessageSquare },
  { href: '/pipeline', label: 'CI/CD Pipeline', icon: GitBranch },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation()

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 flex flex-col z-20" style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}>
        {/* Logo */}
        <div className="h-14 flex items-center px-5 gap-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)' }}>
            <Shield size={14} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <div className="font-bold text-sm tracking-wide" style={{ color: 'var(--text)' }}>EpiGuard</div>
            <div className="text-xs" style={{ color: 'var(--muted)', fontFamily: 'Space Mono, monospace' }}>Global Command</div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#ef4444' }}></span>
            <span className="text-xs font-mono" style={{ color: '#ef4444', fontFamily: 'Space Mono, monospace' }}>ALERT LEVEL: HIGH</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href
            return (
              <Link key={item.href} href={item.href}>
                <a className={cn('nav-link', isActive && 'active')}>
                  <item.icon size={15} />
                  {item.label}
                </a>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(124,58,237,0.2)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.3)' }}>
              AH
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Admin User</p>
              <p className="text-xs" style={{ color: 'var(--muted)', fontFamily: 'Space Mono, monospace' }}>WHO Command</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  )
}
