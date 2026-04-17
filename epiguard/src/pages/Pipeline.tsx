import { useState } from 'react'
import { CheckCircle, Circle, Clock, GitBranch, Package, Shield, Cloud, Monitor, GitMerge, Cpu } from 'lucide-react'

interface PipelineStep {
  id: string
  phase: string
  tool: string
  description: string
  status: 'done' | 'running' | 'pending' | 'failed'
  member: 1 | 2
  details: string[]
  color: string
  icon: React.ReactNode
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'code',
    phase: 'Phase 1 — Source Control',
    tool: 'Git / GitHub',
    description: 'Python FastAPI microservice. App Repo (source) + Config Repo (K8s manifests).',
    status: 'done',
    member: 1,
    details: ['EpiGuard FastAPI backend', 'Two-repo strategy: app + config', 'Feature branches → PR → main', 'Conventional commits enforced'],
    color: '#f97316',
    icon: <GitBranch size={18} />,
  },
  {
    id: 'docker',
    phase: 'Phase 2 — Containerization',
    tool: 'Docker',
    description: 'Multi-stage Dockerfile. Docker Compose for local dev with Redis.',
    status: 'done',
    member: 1,
    details: ['Multi-stage build (builder → slim)', 'Docker Compose: app + redis + db', 'Image tagged with SHA + semver', '.dockerignore optimized'],
    color: '#00d4ff',
    icon: <Package size={18} />,
  },
  {
    id: 'ci',
    phase: 'Phase 3 — CI Pipeline',
    tool: 'GitHub Actions',
    description: 'On every push: lint → test → build → scan → push to Docker Hub.',
    status: 'running',
    member: 1,
    details: ['Pytest unit + integration tests', 'Selenium E2E test suite', 'SonarQube static analysis', 'Trivy container vulnerability scan', 'OWASP ZAP DAST scan', 'Docker Hub push on green'],
    color: '#a78bfa',
    icon: <GitMerge size={18} />,
  },
  {
    id: 'devsecops',
    phase: 'Phase 3b — DevSecOps',
    tool: 'SonarQube · Trivy · OWASP ZAP',
    description: 'Security gates integrated into CI. Pipeline fails on critical CVEs.',
    status: 'done',
    member: 1,
    details: ['SonarQube: code quality & SAST', 'Trivy: image CVE scanning', 'OWASP ZAP: DAST on staging URL', 'Snyk: dependency vulnerability check', 'Quality gate blocks merge on failure'],
    color: '#ef4444',
    icon: <Shield size={18} />,
  },
  {
    id: 'iac',
    phase: 'Phase 4 — Infrastructure as Code',
    tool: 'Terraform',
    description: 'Provisions EKS cluster on AWS. Installs Argo CD via Helm post-provision.',
    status: 'done',
    member: 2,
    details: ['AWS EKS cluster provisioning', 'VPC, subnets, security groups', 'Helm provider installs Argo CD', 'Remote state in S3 + DynamoDB lock', 'Terraform Cloud for plan/apply'],
    color: '#7c3aed',
    icon: <Cloud size={18} />,
  },
  {
    id: 'gitops',
    phase: 'Phase 5 — GitOps CD',
    tool: 'Argo CD',
    description: 'Watches Config Repo. Auto-syncs on manifest change. SAML SSO enabled.',
    status: 'done',
    member: 2,
    details: ['Tracks Config Repo /manifests dir', 'Auto-sync on image tag update', 'Self-healing: reverts manual changes', 'SAML SSO via Okta integration', 'Multi-cluster app management'],
    color: '#f59e0b',
    icon: <GitBranch size={18} />,
  },
  {
    id: 'k8s',
    phase: 'Phase 6 — Orchestration',
    tool: 'Kubernetes',
    description: 'Deployment, Service, HPA, PodDisruptionBudget. Demonstrates self-healing.',
    status: 'done',
    member: 2,
    details: ['Deployment with 3 replicas', 'HPA: scale 3–10 on CPU > 70%', 'Liveness + readiness probes', 'ConfigMaps + Sealed Secrets', 'Self-healing demo via Argo CD OutOfSync'],
    color: '#10b981',
    icon: <Cpu size={18} />,
  },
  {
    id: 'monitoring',
    phase: 'Phase 7 — Monitoring',
    tool: 'Prometheus · Grafana',
    description: 'Scrapes pod metrics. Grafana dashboard for Argo CD sync status + resource usage.',
    status: 'pending',
    member: 2,
    details: ['Prometheus scrapes kube-state-metrics', 'Custom /metrics endpoint on FastAPI', 'Grafana: Argo CD sync status panel', 'Grafana: CPU/memory per pod', 'Grafana SAML SSO (same IdP as Argo CD)', 'Alertmanager → Slack webhook'],
    color: '#f97316',
    icon: <Monitor size={18} />,
  },
]

const STATUS_ICON = {
  done: <CheckCircle size={14} style={{ color: '#10b981' }} />,
  running: <Clock size={14} style={{ color: '#f59e0b', animation: 'spin 2s linear infinite' }} />,
  pending: <Circle size={14} style={{ color: '#64748b' }} />,
  failed: <CheckCircle size={14} style={{ color: '#ef4444' }} />,
}

export default function Pipeline() {
  const [selected, setSelected] = useState<string>('ci')

  const step = PIPELINE_STEPS.find(s => s.id === selected)!

  return (
    <div className="page fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="page-title">DevOps CI/CD Pipeline</div>
      <div className="page-sub">EpiGuard deployment lifecycle · CAT II Project · 22MDCEL9</div>

      {/* Member legend */}
      <div className="flex gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
          <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>Member 1 — App & Pipeline (Python · Docker · GitHub Actions)</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
          <div className="w-2 h-2 rounded-full" style={{ background: '#a78bfa' }} />
          <span className="text-xs font-semibold" style={{ color: '#a78bfa' }}>Member 2 — Infrastructure & GitOps (Terraform · Kubernetes · Argo CD · Prometheus)</span>
        </div>
      </div>

      {/* Pipeline rail */}
      <div className="relative mb-4 overflow-x-auto">
        <div className="flex items-start gap-0 min-w-max pb-2">
          {PIPELINE_STEPS.map((s, i) => (
            <div key={s.id} className="flex items-start">
              <button onClick={() => setSelected(s.id)}
                className="flex flex-col items-center gap-2 px-3 transition-all"
                style={{ opacity: selected === s.id ? 1 : 0.7 }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background: selected === s.id ? `${s.color}25` : 'var(--surface)',
                    border: `2px solid ${selected === s.id ? s.color : 'var(--border)'}`,
                    color: selected === s.id ? s.color : 'var(--muted)',
                    boxShadow: selected === s.id ? `0 0 16px ${s.color}40` : 'none',
                  }}>
                  {s.icon}
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold whitespace-nowrap" style={{ color: selected === s.id ? s.color : 'var(--muted)' }}>{s.tool.split(' ')[0]}</p>
                  <div className="flex justify-center mt-0.5">{STATUS_ICON[s.status]}</div>
                </div>
              </button>
              {i < PIPELINE_STEPS.length - 1 && (
                <div className="flex items-center" style={{ paddingTop: 20 }}>
                  <div style={{ width: 24, height: 2, background: `linear-gradient(90deg, ${s.color}60, ${PIPELINE_STEPS[i+1].color}60)` }} />
                  <div style={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: `6px solid ${PIPELINE_STEPS[i+1].color}60` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected step detail */}
      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        <div className="col-span-2 stat-card overflow-auto fade-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${step.color}20`, color: step.color, border: `1px solid ${step.color}40` }}>
                  {step.icon}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text)' }}>{step.phase}</p>
                  <p className="text-xs" style={{ color: step.color, fontFamily: 'Space Mono' }}>{step.tool}</p>
                </div>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--muted)' }}>{step.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`badge ${step.status === 'done' ? 'badge-low' : step.status === 'running' ? 'badge-medium' : step.status === 'failed' ? 'badge-critical' : ''}`} style={step.status === 'pending' ? { background: 'rgba(100,116,139,0.15)', color: '#64748b', border: '1px solid rgba(100,116,139,0.3)' } : {}}>
                {step.status.toUpperCase()}
              </span>
              <span className="badge" style={{ background: step.member === 1 ? 'rgba(0,212,255,0.1)' : 'rgba(124,58,237,0.1)', color: step.member === 1 ? 'var(--accent)' : '#a78bfa', border: `1px solid ${step.member === 1 ? 'rgba(0,212,255,0.3)' : 'rgba(124,58,237,0.3)'}` }}>
                Member {step.member}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold" style={{ color: 'var(--muted)', fontFamily: 'Space Mono', letterSpacing: '0.08em' }}>IMPLEMENTATION DETAILS</p>
            {step.details.map((d, i) => (
              <div key={i} className="flex items-start gap-3 px-3 py-2.5 rounded-lg" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                <span className="text-xs font-mono w-5 flex-shrink-0" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>0{i+1}</span>
                <span className="text-xs" style={{ color: 'var(--text)' }}>{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: all steps summary */}
        <div className="stat-card overflow-auto">
          <p className="text-xs font-bold mb-3" style={{ color: 'var(--muted)', fontFamily: 'Space Mono', letterSpacing: '0.08em' }}>ALL PHASES</p>
          <div className="space-y-2">
            {PIPELINE_STEPS.map(s => (
              <button key={s.id} onClick={() => setSelected(s.id)}
                className="w-full text-left px-3 py-2.5 rounded-lg transition-all"
                style={{
                  background: selected === s.id ? `${s.color}12` : 'var(--surface2)',
                  border: `1px solid ${selected === s.id ? `${s.color}40` : 'var(--border)'}`,
                }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold" style={{ color: selected === s.id ? s.color : 'var(--text)' }}>{s.tool.split(' ')[0]}</span>
                  {STATUS_ICON[s.status]}
                </div>
                <p className="text-xs" style={{ color: 'var(--muted)', lineHeight: 1.4 }}>{s.phase.split('—')[1]?.trim()}</p>
              </button>
            ))}
          </div>

          {/* Progress */}
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs font-bold mb-2" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>OVERALL PROGRESS</p>
            <div className="h-2 rounded-full mb-1" style={{ background: 'var(--border)' }}>
              <div className="h-2 rounded-full" style={{ width: `${(PIPELINE_STEPS.filter(s=>s.status==='done').length / PIPELINE_STEPS.length) * 100}%`, background: 'linear-gradient(90deg, var(--accent), #a78bfa)' }}></div>
            </div>
            <p className="text-xs font-mono" style={{ color: 'var(--muted)', fontFamily: 'Space Mono' }}>
              {PIPELINE_STEPS.filter(s=>s.status==='done').length}/{PIPELINE_STEPS.length} phases complete
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
