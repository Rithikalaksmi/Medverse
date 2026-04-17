import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, AlertTriangle, Zap, Sparkles } from 'lucide-react'
import { sendChatMessage } from '@/lib/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
  ts: Date
}

const SUGGESTIONS = [
  "What is the current global flu risk level?",
  "Explain the SEIRD model parameters",
  "How do I allocate resources for a dengue outbreak?",
  "Explain the EpiGuard CI/CD pipeline",
  "What is Argo CD and how does GitOps work?",
  "How does Prometheus monitor Kubernetes pods?",
]

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm **EpiGuard AI**, your epidemiological intelligence assistant.\n\nI'm now powered by a **FastAPI backend** — your API key stays safe on the server, never in the browser.\n\nWhat would you like to know?",
      ts: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text?: string) {
    const userText = text || input.trim()
    if (!userText || loading) return
    setInput('')
    setError(null)

    const userMsg: Message = { role: 'user', content: userText, ts: new Date() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setLoading(true)

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }))
      const data = await sendChatMessage(apiMessages)
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, ts: new Date() }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to backend.')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  function parseBold(text: string): React.ReactNode[] {
    return text.split(/\*\*(.*?)\*\*/g).map((p, i) =>
      i % 2 === 1 ? <strong key={i} style={{ color: 'var(--text)', fontWeight: 700 }}>{p}</strong> : p
    )
  }

  function renderContent(text: string): React.ReactNode[] {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('- ') || line.startsWith('• '))
        return <li key={i} style={{ marginLeft: 16, marginBottom: 2 }}>{parseBold(line.slice(2))}</li>
      if (line.startsWith('# '))
        return <p key={i} style={{ fontWeight: 800, color: 'var(--accent)', marginBottom: 6, fontSize: 13 }}>{line.slice(2)}</p>
      if (line.startsWith('## '))
        return <p key={i} style={{ fontWeight: 700, color: '#a78bfa', marginBottom: 4, fontSize: 12 }}>{line.slice(3)}</p>
      if (line === '') return <br key={i} />
      return <p key={i} style={{ marginBottom: 2 }}>{parseBold(line)}</p>
    })
  }

  return (
    <div className="page fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))',
          border: '1px solid rgba(0,212,255,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Sparkles size={16} style={{ color: 'var(--accent)' }} />
        </div>
        <div>
          <div className="page-title" style={{ marginBottom: 0 }}>EpiGuard AI Assistant</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
            <span className="page-sub" style={{ margin: 0, fontSize: 11 }}>
              Gemini 2.5 Flash via FastAPI backend · API key secured server-side
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex gap-4" style={{ marginTop: 12 }}>
        {/* Chat column */}
        <div className="flex-1 flex flex-col" style={{ minHeight: 0 }}>
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-3" style={{ minHeight: 0 }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 fade-in ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                  background: m.role === 'assistant'
                    ? 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,212,255,0.05))'
                    : 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(124,58,237,0.08))',
                  border: `1px solid ${m.role === 'assistant' ? 'rgba(0,212,255,0.35)' : 'rgba(124,58,237,0.35)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2,
                }}>
                  {m.role === 'assistant'
                    ? <Bot size={14} style={{ color: 'var(--accent)' }} />
                    : <User size={14} style={{ color: '#a78bfa' }} />}
                </div>
                <div style={{
                  maxWidth: '80%', padding: '12px 16px',
                  borderRadius: 16,
                  borderTopLeftRadius: m.role === 'assistant' ? 4 : 16,
                  borderTopRightRadius: m.role === 'user' ? 4 : 16,
                  background: m.role === 'assistant'
                    ? 'var(--surface)'
                    : 'linear-gradient(135deg, rgba(124,58,237,0.18), rgba(124,58,237,0.08))',
                  border: `1px solid ${m.role === 'assistant' ? 'var(--border)' : 'rgba(124,58,237,0.3)'}`,
                  color: 'var(--text)', fontSize: 12, lineHeight: 1.6,
                }}>
                  {renderContent(m.content)}
                  <p style={{ marginTop: 8, color: 'var(--muted)', fontFamily: 'Space Mono', fontSize: 10, opacity: 0.6 }}>
                    {m.ts.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 fade-in">
                <div style={{
                  width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,212,255,0.05))',
                  border: '1px solid rgba(0,212,255,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Bot size={14} style={{ color: 'var(--accent)' }} />
                </div>
                <div style={{
                  padding: '12px 16px', borderRadius: 16, borderTopLeftRadius: 4,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map(n => (
                      <div key={n} style={{
                        width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
                        animation: `dotBounce 1.2s ease-in-out ${n * 0.2}s infinite`,
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'Space Mono' }}>Analyzing via backend...</span>
                </div>
              </div>
            )}

            {error && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '12px 16px', borderRadius: 12,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
              }}>
                <AlertTriangle size={14} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#ef4444', marginBottom: 2 }}>Backend Error</p>
                  <p style={{ fontSize: 11, color: '#f87171' }}>{error}</p>
                  <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                    Make sure the FastAPI backend is running: <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: 4 }}>python run.py</code>
                  </p>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            display: 'flex', gap: 8, padding: '10px 12px',
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16,
          }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about outbreaks, resource allocation, DevOps pipelines…"
              rows={2}
              style={{
                flex: 1, background: 'transparent', border: 'none',
                color: 'var(--text)', outline: 'none',
                fontFamily: 'Syne, sans-serif', fontSize: 12, lineHeight: 1.6, resize: 'none',
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0, alignSelf: 'flex-end',
                background: loading || !input.trim() ? 'rgba(0,212,255,0.05)' : 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,212,255,0.1))',
                border: `1px solid ${loading || !input.trim() ? 'var(--border)' : 'rgba(0,212,255,0.4)'}`,
                color: loading || !input.trim() ? 'var(--muted)' : 'var(--accent)',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
                boxShadow: loading || !input.trim() ? 'none' : '0 0 12px rgba(0,212,255,0.15)',
              }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <div className="stat-card h-full" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '7px 10px', borderRadius: 8, marginBottom: 14,
              background: 'linear-gradient(135deg, rgba(66,133,244,0.12), rgba(52,168,83,0.08))',
              border: '1px solid rgba(66,133,244,0.3)',
            }}>
              <Zap size={11} style={{ color: '#4285f4' }} />
              <span style={{ color: '#4285f4', fontSize: 10, fontFamily: 'Space Mono', fontWeight: 700 }}>
                FASTAPI + GEMINI 1.5
              </span>
            </div>

            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', fontFamily: 'Space Mono', letterSpacing: '0.08em', marginBottom: 10 }}>
              QUICK QUERIES
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)} style={{
                  width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 8,
                  fontSize: 11, lineHeight: 1.4,
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  color: 'var(--text)', cursor: 'pointer',
                }}>
                  {s}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', fontFamily: 'Space Mono', marginBottom: 8 }}>CAPABILITIES</p>
              {['Outbreak analysis', 'SEIRD modelling', 'Resource triage', 'CI/CD DevOps', 'Kubernetes/GitOps', 'Prometheus monitoring'].map(c => (
                <p key={c} style={{ fontSize: 11, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)' }}>
                  <span style={{ color: 'var(--accent)' }}>·</span>{c}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
