import { useState, useEffect } from 'react'
import { useToast } from '../components/Toast'
import ContactsView from './more/ContactsView'
import AboutView from './more/AboutView'
import MoreMenu from './more/MoreMenu'
import AdminPanel from './more/AdminPanel'
import { CAT_ICONS, CAT_ORDER, HAZARD_ICONS } from './more/moreData'
import { fetchResources, fetchRoutes, fetchDrills, fetchStaff, updateResource, resetTodayCheckins } from '../services/moreService'

export default function More({ user, role, isAdmin, signOut, onStatusChange, onSignalChange }) {
  const toast = useToast()
  const [view, setView] = useState('main')
  const [resources, setResources] = useState([])
  const [routes, setRoutes] = useState([])
  const [drills, setDrills] = useState([])
  const [staff, setStaff] = useState([])
  const [editRes, setEditRes] = useState(null)

  useEffect(() => {
    if (view === 'resources') loadData(fetchResources, setResources)
    if (view === 'evacuation') loadData(fetchRoutes, setRoutes)
    if (view === 'drills') loadData(fetchDrills, setDrills)
    if (view === 'admin' && isAdmin) loadData(fetchStaff, setStaff)
  }, [view, isAdmin])

  async function loadData(loader, setter) { const { data } = await loader(); if (data) setter(data) }
  async function resetCheckins() { await resetTodayCheckins(new Date().toISOString().split('T')[0]); toast('🔄 Check-ins reset.', 'success') }
  async function saveResource() {
    if (!editRes) return
    const payload = {
      quantity: parseInt(document.getElementById('editQty')?.value ?? editRes.quantity),
      condition: document.getElementById('editCond')?.value ?? editRes.condition,
      location: document.getElementById('editLoc')?.value ?? editRes.location,
      last_checked: new Date().toISOString().split('T')[0],
    }
    await updateResource(editRes.id, payload)
    toast('✅ Resource updated!', 'success')
    setEditRes(null)
    loadData(fetchResources, setResources)
  }

  const grouped = CAT_ORDER.reduce((acc, cat) => { const items = resources.filter(r => r.category === cat); if (items.length) acc[cat] = items; return acc }, {})

  if (view === 'resources') return <div className="fade-in"><button className="back-btn" onClick={() => setView('main')}>← Back</button><div className="section-title" style={{ marginBottom: 14 }}>📦 Resource Inventory</div>{Object.entries(grouped).map(([cat, items]) => <div key={cat} className="card"><div className="card-title">{CAT_ICONS[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}</div>{items.map(r => <div key={r.id} className="resource-item"><div className="resource-icon">{r.name.includes('First Aid') ? '🧰' : r.name.includes('Extinguish') ? '🧯' : r.name.includes('Flash') ? '🔦' : r.name.includes('Water') ? '💧' : r.name.includes('Food') ? '🍱' : r.name.includes('Mega') ? '📢' : r.name.includes('Rope') ? '🪢' : r.name.includes('Bandage') ? '🩹' : r.name.includes('Sand') ? '🪣' : '📦'}</div><div className="resource-info"><h4>{r.name}</h4><p>{r.location} · Updated {r.last_checked}</p></div><div className="resource-qty"><div className="qty-num" style={{ color: r.condition === 'replace' ? 'var(--red)' : r.condition === 'low' ? 'var(--yellow)' : 'var(--navy)' }}>{r.quantity}</div><span className={`badge badge-${r.condition}`}>{r.condition}</span></div>{isAdmin && <button className="btn-icon" style={{ background: 'var(--blue-light)', color: '#3b82f6', marginLeft: 8 }} onClick={() => setEditRes(r)}>✏️</button>}</div>)}</div>)}{editRes && <div className="modal-overlay" onClick={() => setEditRes(null)}><div className="modal" onClick={e => e.stopPropagation()}><div className="modal-handle" /><h2>✏️ Update: {editRes.name}</h2><div className="form-group"><label className="form-label">Quantity</label><input id="editQty" type="number" className="form-control" defaultValue={editRes.quantity} /></div><div className="form-group"><label className="form-label">Condition</label><select id="editCond" className="form-control" defaultValue={editRes.condition}><option value="good">✅ Good</option><option value="low">⚠️ Low</option><option value="replace">❌ Replace</option></select></div><div className="form-group"><label className="form-label">Location</label><input id="editLoc" className="form-control" defaultValue={editRes.location} /></div><div style={{ display: 'flex', gap: 10 }}><button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setEditRes(null)}>Cancel</button><button className="btn btn-primary" style={{ flex: 2 }} onClick={saveResource}>💾 Save</button></div></div></div>}</div>

  if (view === 'evacuation') return <div className="fade-in"><button className="back-btn" onClick={() => setView('main')}>← Back</button><div className="section-title" style={{ marginBottom: 14 }}>🗺️ Evacuation Routes</div>{routes.map(r => <div key={r.id} style={{ borderRadius: 'var(--radius-sm)', border: '2px solid var(--border)', padding: 14, marginBottom: 10, background: 'white' }}><h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--navy)' }}>{HAZARD_ICONS[r.hazard_type] || '⚠️'} {r.hazard_type.charAt(0).toUpperCase() + r.hazard_type.slice(1)}</h4><div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>{r.route_description.split('→').map((step, i, arr) => <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ background: 'var(--bg)', padding: '4px 10px', borderRadius: 20, fontWeight: 600, fontSize: 11 }}>{step.trim()}</span>{i < arr.length - 1 && <span style={{ color: 'var(--navy)' }}>→</span>}</span>)}</div><div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', marginTop: 8 }}>🟢 Assembly: {r.assembly_area}</div>{r.map_url && <a href={r.map_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)', display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10 }}>📍 Open in Google Maps</a>}</div>)}</div>

  if (view === 'contacts') return <div className="fade-in"><button className="back-btn" onClick={() => setView('main')}>← Back</button><ContactsView /></div>
  if (view === 'drills') return <div className="fade-in"><button className="back-btn" onClick={() => setView('main')}>← Back</button><div className="section-title" style={{ marginBottom: 14 }}>📅 Drill History</div><div className="card">{drills.length === 0 ? <div className="empty-state"><div className="empty-icon">📅</div><p>No drills recorded yet</p></div> : drills.map(d => { const dt = new Date(d.date); return <div key={d.id} className="drill-item"><div className="drill-date"><div className="drill-dd">{dt.getDate().toString().padStart(2,'0')}</div><div className="drill-mm">{dt.toLocaleString('en',{month:'short'}).toUpperCase()}</div></div><div><h4 style={{ fontSize: 13, fontWeight: 700 }}>{d.type}</h4><p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{d.duration_mins} mins · {d.staff_present}/{d.total_staff} staff · {d.success ? '✅ Successful' : '⚠️ Issues noted'}</p>{d.notes && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{d.notes}</p>}</div></div> })}</div></div>
  if (view === 'admin') return <div className="fade-in"><button className="back-btn" onClick={() => setView('main')}>← Back</button><div className="section-title" style={{ marginBottom: 14 }}>⚙️ Admin Panel</div><AdminPanel isAdmin={isAdmin} user={user} role={role} staff={staff} onResetCheckins={resetCheckins} onStatusChange={onStatusChange} onSignalChange={onSignalChange} toast={toast} onSignOut={() => { signOut(); toast('Logged out.') }} /></div>
  if (view === 'about') return <div className="fade-in"><button className="back-btn" onClick={() => setView('main')}>← Back</button><AboutView /></div>
  return <div className="fade-in"><MoreMenu isAdmin={isAdmin} onSelect={setView} /></div>
}
