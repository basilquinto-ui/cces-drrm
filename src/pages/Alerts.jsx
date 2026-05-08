import { useState, useEffect } from 'react'
import {
  AlertTriangle,
  CloudLightning,
  Waves,
  Flame,
  Mountain,
  Siren,
  Circle,
  AlertCircle,
  TriangleAlert,
  CheckCircle,
  CalendarClock,
  UserRound,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { suggestAlertMessage } from '../lib/gemini'
import { useToast } from '../components/Toast'

const levelClass = { drill: 'alert-drill', watch: 'alert-watch', warning: 'alert-warning', emergency: 'alert-emergency' }
const hazardIcons = {
  earthquake: AlertTriangle,
  typhoon: CloudLightning,
  flood: Waves,
  fire: Flame,
  landslide: Mountain,
  general: AlertTriangle,
}
const levelIcons = { drill: Circle, watch: AlertCircle, warning: TriangleAlert, emergency: Siren }

const IconLabel = ({ Icon, text }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
    <Icon size={14} aria-hidden="true" />
    {text}
  </span>
)

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
    if (!message.trim()) return toast('Please enter a message.', 'error')
    setSending(true)
    const { error } = await supabase.from('alerts').insert({ hazard_type: hazard, level, message, issued_by: 'DRRM Coordinator', active: true })
    setSending(false)
    if (error) return toast('Failed to send alert.', 'error')
    if (level === 'emergency' || level === 'warning') onStatusChange?.('alert')
    else if (level === 'watch') onStatusChange?.('watch')
    toast('Alert sent.', 'success')
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

  const titleCase = (v) => v.charAt(0).toUpperCase() + v.slice(1)
  const hazardIcon = hazardIcons[hazard]

  if (view === 'send') return <div className="fade-in"><button className="back-btn" onClick={() => setView('list')}> Back</button><div className="card"><h2><IconLabel Icon={Siren} text="Send Emergency Alert" /></h2><div className="form-group"><label className="form-label">Hazard Type</label><div className="hazard-grid">{Object.entries(hazardIcons).map(([k, Icon]) => <div key={k} className={`hazard-option ${hazard === k ? 'active' : ''}`} onClick={() => setHazard(k)}><div className="ho-icon"><Icon size={16} /></div><div className="ho-label">{titleCase(k)}</div></div>)}</div></div><div className="form-group"><label className="form-label">Alert Level</label><select className="form-control" value={level} onChange={e => setLevel(e.target.value)}><option value="drill">Drill</option><option value="watch">Watch</option><option value="warning">Warning</option><option value="emergency">Emergency</option></select></div><div className="form-group"><label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>Message<button style={{ background: 'none', border: 'none', color: 'var(--gold)', fontWeight: 700, fontSize: 11, cursor: 'pointer' }} onClick={aiSuggest} disabled={suggesting}>{suggesting ? 'Thinking...' : 'AI Suggest'}</button></label><textarea className="form-control" value={message} onChange={e => setMessage(e.target.value)} placeholder="Enter message for all staff..." /></div><button className="btn btn-danger" onClick={sendAlert} disabled={sending}>{sending ? 'Sending...' : 'Send Alert to All Staff'}</button></div></div>

  return <div className="fade-in">{isAdmin && <button className="btn btn-danger" style={{ marginBottom: 14 }} onClick={() => setView('send')}><IconLabel Icon={Siren} text="Send Emergency Alert" /></button>}<div className="section-header"><span className="section-title">Active Alerts</span></div>{active.length === 0 ? <div className="empty-state"><div className="empty-icon"><CheckCircle size={20} /></div><p>No active alerts</p></div> : active.map(a => { const Hazard = hazardIcons[a.hazard_type] || AlertTriangle; const Level = levelIcons[a.level] || Circle; return <div key={a.id} className={`alert-item ${levelClass[a.level]}`}><h4><IconLabel Icon={Hazard} text={`${titleCase(a.hazard_type)} `} /> <IconLabel Icon={Level} text={a.level.toUpperCase()} /></h4><p>{a.message}</p><div className="alert-meta"><span><CalendarClock size={14} /> {new Date(a.created_at).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span><span><UserRound size={14} /> {a.issued_by}</span><span style={{ color: 'var(--red)' }}><Circle size={10} fill="currentColor" /> Active</span></div>{isAdmin && <button className="btn btn-outline btn-sm" style={{ marginTop: 10 }} onClick={() => cancelAlert(a.id)}>Cancel Alert</button>}</div> })}<div className="section-header" style={{ marginTop: 16 }}><span className="section-title">Alert History</span></div>{history.length === 0 ? <div className="empty-state"><div className="empty-icon"><AlertCircle size={20} /></div><p>No alert history yet</p></div> : history.map(a => { const Hazard = hazardIcons[a.hazard_type] || AlertTriangle; const Level = levelIcons[a.level] || Circle; return <div key={a.id} className={`alert-item ${levelClass[a.level]}`}><h4><IconLabel Icon={Hazard} text={`${titleCase(a.hazard_type)} `} /> <IconLabel Icon={Level} text={a.level.toUpperCase()} /></h4><p>{a.message}</p><div className="alert-meta"><span><CalendarClock size={14} /> {new Date(a.created_at).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span><span><UserRound size={14} /> {a.issued_by}</span><span style={{ color: 'var(--green)' }}><CheckCircle size={14} /> Resolved</span></div></div> })}</div>
}
