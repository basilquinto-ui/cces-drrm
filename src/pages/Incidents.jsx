import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { describeIncidentPhoto } from '../lib/gemini'
import { useToast } from '../components/Toast'

const hazardIcons = { earthquake: '🌍', typhoon: '🌀', flood: '🌊', fire: '🔥', landslide: '⛰️', general: '⚠️' }
const sevBg = { minor: '#dcfce7', moderate: '#fef9c3', severe: '#fee2e2' }
const filters = ['All', '🌍 Earthquake', '🌀 Typhoon', '🌊 Flooding', '🔥 Fire', '⛰️ Landslide']
const filterMap = { 'All': null, '🌍 Earthquake': 'earthquake', '🌀 Typhoon': 'typhoon', '🌊 Flooding': 'flood', '🔥 Fire': 'fire', '⛰️ Landslide': 'landslide' }

export default function Incidents({ isAdmin }) {
  const toast = useToast()
  const [view, setView] = useState('list')
  const [incidents, setIncidents] = useState([])
  const [filter, setFilter] = useState('All')
  const [hazard, setHazard] = useState('earthquake')
  const [location, setLocation] = useState('')
  const [locations, setLocations] = useState([])
  const [severity, setSeverity] = useState('minor')
  const [description, setDescription] = useState('')
  const [reportedBy, setReportedBy] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => { loadIncidents(); loadLocations() }, [])

  async function loadIncidents() {
    let query = supabase.from('incidents').select('*').order('created_at', { ascending: false })
    if (filterMap[filter]) query = query.eq('hazard_type', filterMap[filter])
    const { data } = await query
    if (data) setIncidents(data)
  }

  useEffect(() => { loadIncidents() }, [filter])

  async function loadLocations() {
    const { data } = await supabase.from('hazard_areas').select('name')
    const extra = ['Principal\'s Office', 'Hallway / Corridor', 'Comfort Room', 'Gate / Entrance', 'Grounds / Quadrangle', 'Storage Room']
    setLocations([...(data || []).map(a => a.name), ...extra])
  }

  async function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = async ev => {
      setPhotoPreview(ev.target.result)
      // AI auto-describe
      setAiLoading(true)
      const b64 = ev.target.result.split(',')[1]
      const mime = file.type
      const desc = await describeIncidentPhoto(b64, mime)
      if (desc) { setDescription(desc); toast('✨ AI description generated!', 'success') }
      else toast('Could not generate AI description.', '')
      setAiLoading(false)
    }
    reader.readAsDataURL(file)
  }

  async function submitIncident() {
    if (!description.trim() || !location || !reportedBy.trim()) {
      toast('Please fill in location, description, and your name.', 'error'); return
    }
    setSubmitting(true)
    let photo_url = null
    if (photoFile) {
      const path = `incidents/${Date.now()}_${photoFile.name}`
      const { data: upData } = await supabase.storage.from('incident-photos').upload(path, photoFile)
      if (upData) {
        const { data: urlData } = supabase.storage.from('incident-photos').getPublicUrl(path)
        photo_url = urlData.publicUrl
      }
    }
    const { error } = await supabase.from('incidents').insert({ location, hazard_type: hazard, description, severity, photo_url, reported_by: reportedBy, status: 'reported' })
    setSubmitting(false)
    if (error) { toast('Failed to submit report.', 'error'); return }
    toast('📋 Incident reported!', 'success')
    setDescription(''); setLocation(''); setReportedBy(''); setPhotoFile(null); setPhotoPreview(null); setSeverity('minor'); setHazard('earthquake')
    setView('list'); loadIncidents()
  }

  async function updateStatus(id, status) {
    await supabase.from('incidents').update({ status }).eq('id', id)
    toast('Status updated.', 'success')
    setSelected(s => s ? { ...s, status } : s)
    loadIncidents()
  }

  if (view === 'report') return (
    <div className="fade-in">
      <button className="back-btn" onClick={() => setView('list')}>← Back</button>
      <div className="card">
        <h2>📋 Report Incident</h2>
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
          <label className="form-label">Location</label>
          <select className="form-control" value={location} onChange={e => setLocation(e.target.value)}>
            <option value="">Select location...</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Severity</label>
          <div className="sev-selector">
            {['minor', 'moderate', 'severe'].map(s => (
              <div key={s} className={`sev-option ${severity === s ? s : ''}`} onClick={() => setSeverity(s)}>
                {s === 'minor' ? '🟢' : s === 'moderate' ? '🟡' : '🔴'} {s.charAt(0).toUpperCase() + s.slice(1)}
              </div>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Photo (optional) {aiLoading && <span style={{ color: 'var(--gold)', fontWeight: 700 }}>✨ AI analyzing...</span>}</label>
          <div className="photo-upload" onClick={() => document.getElementById('photoInput').click()}>
            <div className="upload-icon">📷</div>
            <p>Tap to take photo or choose from gallery</p>
            <p style={{ fontSize: 11, marginTop: 4, color: 'var(--gold)' }}>✨ AI will auto-describe the incident</p>
            <input id="photoInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
          </div>
          {photoPreview && <img src={photoPreview} style={{ width: '100%', borderRadius: 10, marginTop: 10, maxHeight: 200, objectFit: 'cover' }} alt="Preview" />}
        </div>
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
            Description
            {aiLoading && <span style={{ color: 'var(--gold)', fontSize: 11 }}>✨ Generating...</span>}
          </label>
          <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what happened..." />
        </div>
        <div className="form-group">
          <label className="form-label">Your Name</label>
          <input className="form-control" value={reportedBy} onChange={e => setReportedBy(e.target.value)} placeholder="Enter your full name..." />
        </div>
        <button className="btn btn-primary" onClick={submitIncident} disabled={submitting || aiLoading}>{submitting ? 'Submitting...' : '📋 Submit Report'}</button>
      </div>
    </div>
  )

  return (
    <div className="fade-in">
      <button className="btn btn-primary" style={{ marginBottom: 14 }} onClick={() => setView('report')}>📋 Report New Incident</button>
      <div className="filter-row">
        {filters.map(f => (
          <div key={f} className={`filter-pill ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</div>
        ))}
      </div>
      <div className="card">
        {incidents.length === 0
          ? <div className="empty-state"><div className="empty-icon">✅</div><p>No incidents found</p></div>
          : incidents.map(inc => (
            <div key={inc.id} className="feed-item" style={{ cursor: 'pointer' }} onClick={() => setSelected(inc)}>
              <div className="feed-icon" style={{ background: sevBg[inc.severity] || '#f1f5f9' }}>{hazardIcons[inc.hazard_type] || '⚠️'}</div>
              <div className="feed-info">
                <h4>{inc.description.slice(0, 60)}{inc.description.length > 60 ? '...' : ''}</h4>
                <p>{inc.location} · {new Date(inc.created_at).toLocaleDateString('en-PH')} · By: {inc.reported_by}</p>
                <div className="feed-badges">
                  <span className={`badge badge-${inc.severity}`}>{inc.severity}</span>
                  <span className={`badge badge-${inc.status}`}>{inc.status}</span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h2>{hazardIcons[selected.hazard_type]} {selected.location}</h2>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              <span className={`badge badge-${selected.severity}`}>{selected.severity}</span>
              <span className={`badge badge-${selected.status}`}>{selected.status}</span>
            </div>
            {selected.photo_url && <img src={selected.photo_url} style={{ width: '100%', borderRadius: 10, marginBottom: 12, maxHeight: 200, objectFit: 'cover' }} alt="Incident" />}
            <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text)' }}>{selected.description}</p>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10 }}>
              👤 {selected.reported_by} · 📅 {new Date(selected.created_at).toLocaleString('en-PH')}
            </div>
            {isAdmin && (
              <div style={{ marginTop: 14 }}>
                <label className="form-label">Update Status</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
                  {['reported', 'acknowledged', 'responding', 'resolved'].map(s => (
                    <button key={s} className={`btn btn-sm ${selected.status === s ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%' }} onClick={() => updateStatus(selected.id, s)}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
