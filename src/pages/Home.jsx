import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import WeatherCard from '../components/WeatherCard'

const riskClasses = { high: 'risk-high', moderate: 'risk-moderate', low: 'risk-low', safe: 'risk-safe' }
const riskLabels = { high: '🔴 High Risk', moderate: '🟡 Moderate', low: '🟢 Low Risk', safe: '🔵 Assembly' }
const riskColors = { high: '#dc2626', moderate: '#ca8a04', low: '#16a34a', safe: '#3b82f6' }
const sevBg = { minor: '#dcfce7', moderate: '#fef9c3', severe: '#fee2e2' }
const hazardIcon = { earthquake: '🌍', typhoon: '🌀', flood: '🌊', fire: '🔥', landslide: '⛰️', general: '⚠️' }

export default function Home({ weather, signal, onSignalChange, onTabChange, status, onStatusChange }) {
  const [areas, setAreas] = useState([])
  const [incidents, setIncidents] = useState([])
  const [stats, setStats] = useState({ incidents: 0, alerts: 0, checkins: 0 })
  const [selectedArea, setSelectedArea] = useState(null)
  const [showManage, setShowManage] = useState(false)
  const [editArea, setEditArea] = useState(null)
  const [editRisk, setEditRisk] = useState('moderate')
  const [addForm, setAddForm] = useState(false)
  const [newArea, setNewArea] = useState({ name: '', icon: '📍', risk_level: 'moderate', description: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    const [{ data: areaData }, { data: incData }, { count: incCount }, { count: alertCount }, { count: checkinCount }] = await Promise.all([
      supabase.from('hazard_areas').select('*').order('created_at'),
      supabase.from('incidents').select('*').order('created_at', { ascending: false }).limit(3),
      supabase.from('incidents').select('*', { count: 'exact', head: true }),
      supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('active', true),
      supabase.from('checkins').select('*', { count: 'exact', head: true }).eq('date', new Date().toISOString().split('T')[0]),
    ])
    if (areaData) setAreas(areaData)
    if (incData) setIncidents(incData)
    setStats({ incidents: incCount || 0, alerts: alertCount || 0, checkins: checkinCount || 0 })
  }

  async function saveAreaEdit() {
    if (!editArea) return
    setSaving(true)
    const score = parseInt(document.getElementById('riskScore')?.value || editArea.risk_score)
    const desc = document.getElementById('editDesc')?.value || editArea.description
    const obs = (document.getElementById('editObs')?.value || '').split('\n').filter(l => l.trim())
    const assessedBy = document.getElementById('editAssessedBy')?.value || editArea.assessed_by
    const { error } = await supabase.from('hazard_areas').update({
      risk_level: editRisk, risk_score: score, description: desc,
      observations: obs, assessed_by: assessedBy,
      assessed_date: new Date().toISOString().split('T')[0]
    }).eq('id', editArea.id)
    setSaving(false)
    if (!error) { loadAll(); setEditArea(null); setSelectedArea(null) }
  }

  async function deleteArea(id) {
    if (areas.length <= 1) return
    await supabase.from('hazard_areas').delete().eq('id', id)
    loadAll()
    setShowManage(false)
  }

  async function addAreaSubmit() {
    if (!newArea.name.trim()) return
    setSaving(true)
    const pctMap = { high: 75, moderate: 50, low: 20, safe: 5 }
    await supabase.from('hazard_areas').insert({
      ...newArea, risk_score: pctMap[newArea.risk_level],
      observations: [], assessed_by: 'DRRM Coordinator',
      assessed_date: new Date().toISOString().split('T')[0]
    })
    setSaving(false)
    setNewArea({ name: '', icon: '📍', risk_level: 'moderate', description: '' })
    setAddForm(false)
    loadAll()
  }

  const today = new Date().toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const statusCfg = {
    normal: { cls: 'normal', icon: '🟢', h: 'ALL CLEAR', p: 'No active alerts · ' + today },
    watch: { cls: 'watch', icon: '🟡', h: 'WATCH', p: 'Stay alert and monitor updates · ' + today },
    alert: { cls: 'alert', icon: '🔴', h: 'ALERT!', p: 'Emergency — follow DRRM protocols · ' + today },
  }[status] || { cls: 'normal', icon: '🟢', h: 'ALL CLEAR', p: today }

  return (
    <div className="fade-in">
      {/* Status Banner */}
      <div className={`status-banner ${statusCfg.cls}`}>
        <div className="status-icon">{statusCfg.icon}</div>
        <div className="status-info"><h2>{statusCfg.h}</h2><p>{statusCfg.p}</p></div>
      </div>

      {/* Weather */}
      <WeatherCard weather={weather} signal={signal} onSignalChange={onSignalChange} />

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card"><div className="stat-num">{stats.incidents}</div><div className="stat-label">Total Incidents</div></div>
        <div className="stat-card"><div className="stat-num">{stats.alerts}</div><div className="stat-label">Active Alerts</div></div>
        <div className="stat-card"><div className="stat-num">{stats.checkins}</div><div className="stat-label">Checked In Today</div></div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="quick-btn danger" onClick={() => onTabChange('alerts')}><span className="qb-icon">🚨</span><span className="qb-label">Send Alert</span></button>
        <button className="quick-btn" onClick={() => onTabChange('incidents')}><span className="qb-icon">📋</span><span className="qb-label">Report Incident</span></button>
        <button className="quick-btn" onClick={() => onTabChange('checkin')}><span className="qb-icon">✅</span><span className="qb-label">Check In</span></button>
      </div>

      {/* Hazard Map */}
      <div className="hazard-map-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--navy)' }}>🗺️ Daily Hazard Map</div>
          <button className="see-all" onClick={() => setShowManage(true)}>+ Manage Areas</button>
        </div>
        <div className="campus-grid">
          {areas.map(a => (
            <div key={a.id} className={`campus-area ${riskClasses[a.risk_level]}`} onClick={() => setSelectedArea(a)}>
              <span className="area-icon">{a.icon}</span>
              <div className="area-info"><h4>{a.name}</h4><p>{riskLabels[a.risk_level]}</p></div>
              <div className={`risk-dot ${a.risk_level}`} />
            </div>
          ))}
        </div>
        <div className="hazard-legend">
          {Object.entries(riskLabels).map(([k, v]) => (
            <div key={k} className="legend-item"><div className="legend-dot" style={{ background: riskColors[k] }} />{v.replace(/^../,'')}</div>
          ))}
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="card">
        <div className="section-header">
          <span className="section-title">Recent Incidents</span>
          <button className="see-all" onClick={() => onTabChange('incidents')}>View all →</button>
        </div>
        {incidents.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">✅</div><p>No incidents reported yet</p></div>
        ) : incidents.map(inc => (
          <div key={inc.id} className="feed-item">
            <div className="feed-icon" style={{ background: sevBg[inc.severity] || '#f1f5f9' }}>{hazardIcon[inc.hazard_type] || '⚠️'}</div>
            <div className="feed-info">
              <h4>{inc.description.slice(0, 50)}{inc.description.length > 50 ? '...' : ''}</h4>
              <p>{inc.location} · {new Date(inc.created_at).toLocaleDateString('en-PH')}</p>
              <div className="feed-badges">
                <span className={`badge badge-${inc.severity}`}>{inc.severity}</span>
                <span className={`badge badge-${inc.status}`}>{inc.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AREA DETAIL MODAL */}
      {selectedArea && !editArea && (
        <div className="modal-overlay" onClick={() => setSelectedArea(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h2 style={{ marginBottom: 0, fontSize: 17 }}>{selectedArea.icon} {selectedArea.name}</h2>
              <button className="btn btn-outline btn-sm" onClick={() => { setEditArea(selectedArea); setEditRisk(selectedArea.risk_level) }}>✏️ Edit</button>
            </div>
            <div style={{ color: riskColors[selectedArea.risk_level], fontWeight: 700, fontSize: 12, marginBottom: 10 }}>{riskLabels[selectedArea.risk_level]} — Score: {selectedArea.risk_score}/100</div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: selectedArea.risk_score + '%', background: `linear-gradient(90deg,${riskColors[selectedArea.risk_level]},${riskColors[selectedArea.risk_level]}88)` }} /></div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 12, lineHeight: 1.6 }}>{selectedArea.description}</p>
            {(selectedArea.observations || []).map((o, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, padding: '8px 10px', background: 'var(--bg)', borderRadius: 10, marginTop: 6, fontSize: 12 }}>📌 {o}</div>
            ))}
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
              👤 {selectedArea.assessed_by} · 📅 {selectedArea.assessed_date}
            </div>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setSelectedArea(null)}>Close</button>
          </div>
        </div>
      )}

      {/* AREA EDIT MODAL */}
      {editArea && (
        <div className="modal-overlay" onClick={() => setEditArea(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h2>✏️ Edit: {editArea.name}</h2>
            <div className="form-group">
              <label className="form-label">Risk Level</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
                {Object.entries(riskLabels).map(([k, v]) => (
                  <div key={k} onClick={() => setEditRisk(k)} style={{ padding: '8px 4px', borderRadius: 10, textAlign: 'center', cursor: 'pointer', fontSize: 10, fontWeight: 700, border: `2px solid ${editRisk === k ? riskColors[k] : 'var(--border)'}`, background: editRisk === k ? riskColors[k] + '22' : 'white', color: editRisk === k ? riskColors[k] : 'var(--text-muted)' }}>{v}</div>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Risk Score: <strong>{editArea.risk_score}</strong>/100</label>
              <input id="riskScore" type="range" min="0" max="100" defaultValue={editArea.risk_score} style={{ width: '100%', accentColor: 'var(--navy)' }} />
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea id="editDesc" className="form-control" defaultValue={editArea.description} rows={3} />
            </div>
            <div className="form-group">
              <label className="form-label">Observations (one per line)</label>
              <textarea id="editObs" className="form-control" defaultValue={(editArea.observations || []).join('\n')} rows={4} />
            </div>
            <div className="form-group">
              <label className="form-label">Assessed By</label>
              <input id="editAssessedBy" className="form-control" defaultValue={editArea.assessed_by} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setEditArea(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={saveAreaEdit} disabled={saving}>{saving ? 'Saving...' : '💾 Save Assessment'}</button>
            </div>
          </div>
        </div>
      )}

      {/* MANAGE AREAS MODAL */}
      {showManage && (
        <div className="modal-overlay" onClick={() => setShowManage(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ marginBottom: 0 }}>🗺️ Manage Areas</h2>
              <button className="btn btn-primary btn-sm" onClick={() => setAddForm(!addForm)}>+ Add Area</button>
            </div>
            {areas.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 10, border: '2px solid var(--border)', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{a.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 13 }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: riskColors[a.risk_level], fontWeight: 700 }}>{riskLabels[a.risk_level]}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn-icon" style={{ background: 'var(--blue-light)', color: '#3b82f6' }} onClick={() => { setShowManage(false); setEditArea(a); setEditRisk(a.risk_level) }}>✏️</button>
                  <button className="btn-icon" style={{ background: 'var(--red-light)', color: 'var(--red)' }} onClick={() => deleteArea(a.id)} disabled={areas.length <= 1}>🗑️</button>
                </div>
              </div>
            ))}
            {addForm && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '2px solid var(--border)' }}>
                <div style={{ fontWeight: 800, color: 'var(--navy)', marginBottom: 12 }}>➕ Add New Area</div>
                <div className="form-group"><label className="form-label">Area Name</label><input className="form-control" value={newArea.name} onChange={e => setNewArea(n => ({ ...n, name: e.target.value }))} placeholder="e.g. Computer Lab" /></div>
                <div className="form-group"><label className="form-label">Icon (emoji)</label><input className="form-control" value={newArea.icon} onChange={e => setNewArea(n => ({ ...n, icon: e.target.value }))} maxLength={4} /></div>
                <div className="form-group"><label className="form-label">Risk Level</label>
                  <select className="form-control" value={newArea.risk_level} onChange={e => setNewArea(n => ({ ...n, risk_level: e.target.value }))}>
                    <option value="high">🔴 High Risk</option><option value="moderate">🟡 Moderate</option><option value="low">🟢 Low Risk</option><option value="safe">🔵 Assembly Area</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Description</label><textarea className="form-control" value={newArea.description} onChange={e => setNewArea(n => ({ ...n, description: e.target.value }))} rows={2} /></div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setAddForm(false)}>Cancel</button>
                  <button className="btn btn-primary" style={{ flex: 2 }} onClick={addAreaSubmit} disabled={saving}>{saving ? 'Adding...' : '✅ Add Area'}</button>
                </div>
              </div>
            )}
            <button className="btn btn-outline" style={{ marginTop: 12 }} onClick={() => setShowManage(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  )
}
