import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { suggestAlertMessage } from '../lib/gemini'
import { useToast } from '../components/Toast'

const levelClass = { drill: 'alert-drill', watch: 'alert-watch', warning: 'alert-warning', emergency: 'alert-emergency' }
const hazardIcons = { earthquake: '🌍', typhoon: '🌀', flood: '🌊', fire: '🔥', landslide: '⛰️', general: '⚠️' }
const levelEmoji = { drill: '🔵', watch: '🟡', warning: '🟠', emergency: '🔴' }

export default function Alerts({ isAdmin, onStatusChange }) {
  const toast = useToast()
  const [view, setView] = useState('list')
  const [active, setActive] = useState([])
  const [history, setHistory] = useState([])
  const [hazard, setHazard] = useState('earthquake')
  const [level, setLevel] = useState('drill')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [suggesting, setSuggesting] = useState(false)

  useEffect(() => { loadAlerts() }, [])

  async function loadAlerts() {
    const { data: activeData } = await supabase.from('alerts').select('*').eq('active', true).order('created_at', { ascending: false })
    const { data: histData } = await supabase.from('alerts').select('*').eq('active', false).order('created_at', { ascending: false }).limit(10)
    if (activeData) setActive(activeData)
    if (histData) setHistory(histData)
  }

  async function sendAlert() {
    if (!message.trim()) { toast('Please enter a message.', 'error'); return }
    setSending(true)
    const { error } = await supabase.from('alerts').insert({ hazard_type: hazard, level, message, issued_by: 'DRRM Coordinator', active: true })
    setSending(false)
    if (error) { toast('Failed to send alert.', 'error'); return }
    if (level === 'emergency' || level === 'warning') onStatusChange?.('alert')
    else if (level === 'watch') onStatusChange?.('watch')
    toast('🚨 Alert sent!', 'success')
    setMessage('')
    setView('list')
    loadAlerts()
  }

  async function cancelAlert(id) {
    await supabase.from('alerts').update({ active: false, cancelled_at: new Date().toISOString() }).eq('id', id)
    toast('Alert cancelled.', 'success')
    onStatusChange?.('normal')
    loadAlerts()
  }

  async function aiSuggest() {
    setSuggesting(true)
    const suggestion = await suggestAlertMessage(hazard, level)
    if (suggestion) setMessage(suggestion.trim())
    else toast('AI suggestion unavailable. Check your Gemini key.', 'error')
    setSuggesting(false)
  }

  if (view === 'send') return (
    <div className="fade-in">
      <button className="back-btn" onClick={() => setView('list')}>← Back</button>
      <div className="card">
        <h2>🚨 Send Emergency Alert</h2>
        <div className="form-group">
          <label className="form-label">Hazard Type</label>
          <div className="hazard-grid">
            {Object.entries(hazardIcons).map(([k, v]) => (
              <div key={k} className={`hazard-option ${hazard === k ? 'active' : ''}`} onClick={() => setHazard(k)}>
                <div className="ho-icon">{v}</div>
                <div className="ho-label">{k.charAt(0).toUpperCase() + k.slice(1)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Alert Level</label>
          <select className="form-control" value={level} onChange={e => setLevel(e.target.value)}>
            <option value="drill">🔵 Drill</option>
            <option value="watch">🟡 Watch</option>
            <option value="warning">🟠 Warning</option>
            <option value="emergency">🔴 Emergency</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
            Message
            <button style={{ background: 'none', border: 'none', color: 'var(--gold)', fontWeight: 700, fontSize: 11, cursor: 'pointer' }} onClick={aiSuggest} disabled={suggesting}>
              {suggesting ? '✨ Thinking...' : '✨ AI Suggest'}
            </button>
          </label>
          <textarea className="form-control" value={message} onChange={e => setMessage(e.target.value)} placeholder="Enter message for all staff..." />
        </div>
        <button className="btn btn-danger" onClick={sendAlert} disabled={sending}>{sending ? 'Sending...' : '🚨 Send Alert to All Staff'}</button>
      </div>
    </div>
  )

  return (
    <div className="fade-in">
      {isAdmin && <button className="btn btn-danger" style={{ marginBottom: 14 }} onClick={() => setView('send')}>🚨 Send Emergency Alert</button>}
      <div className="section-header"><span className="section-title">Active Alerts</span></div>
      {active.length === 0
        ? <div className="empty-state"><div className="empty-icon">✅</div><p>No active alerts</p></div>
        : active.map(a => (
          <div key={a.id} className={`alert-item ${levelClass[a.level]}`}>
            <h4>{hazardIcons[a.hazard_type]} {a.hazard_type.charAt(0).toUpperCase() + a.hazard_type.slice(1)} {levelEmoji[a.level]} {a.level.toUpperCase()}</h4>
            <p>{a.message}</p>
            <div className="alert-meta">
              <span>📅 {new Date(a.created_at).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              <span>👤 {a.issued_by}</span>
              <span style={{ color: 'var(--red)' }}>● Active</span>
            </div>
            {isAdmin && <button className="btn btn-outline btn-sm" style={{ marginTop: 10 }} onClick={() => cancelAlert(a.id)}>✕ Cancel Alert</button>}
          </div>
        ))}

      <div className="section-header" style={{ marginTop: 16 }}><span className="section-title">Alert History</span></div>
      {history.length === 0
        ? <div className="empty-state"><div className="empty-icon">📋</div><p>No alert history yet</p></div>
        : history.map(a => (
          <div key={a.id} className={`alert-item ${levelClass[a.level]}`}>
            <h4>{hazardIcons[a.hazard_type]} {a.hazard_type.charAt(0).toUpperCase() + a.hazard_type.slice(1)} {levelEmoji[a.level]} {a.level.toUpperCase()}</h4>
            <p>{a.message}</p>
            <div className="alert-meta">
              <span>📅 {new Date(a.created_at).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              <span>👤 {a.issued_by}</span>
              <span style={{ color: 'var(--green)' }}>✓ Resolved</span>
            </div>
          </div>
        ))}
    </div>
  )
}
