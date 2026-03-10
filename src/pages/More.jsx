import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../components/Toast'
import logo from '../assets/logo.png'

export default function More({ onStatusChange, onSignalChange }) {
  const { user, signIn, signOut, isAdmin } = useAuth()
  const toast = useToast()
  const [view, setView] = useState('main')
  const [resources, setResources] = useState([])
  const [routes, setRoutes] = useState([])
  const [drills, setDrills] = useState([])
  const [staff, setStaff] = useState([])
  const [editRes, setEditRes] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [logging, setLogging] = useState(false)

  useEffect(() => {
    if (view === 'resources') loadResources()
    if (view === 'evacuation') loadRoutes()
    if (view === 'drills') loadDrills()
    if (view === 'admin' && isAdmin) loadStaff()
  }, [view, isAdmin])

  async function loadResources() {
    const { data } = await supabase.from('resources').select('*').order('category').order('name')
    if (data) setResources(data)
  }
  async function loadRoutes() {
    const { data } = await supabase.from('evacuation_routes').select('*')
    if (data) setRoutes(data)
  }
  async function loadDrills() {
    const { data } = await supabase.from('drills').select('*').order('date', { ascending: false })
    if (data) setDrills(data)
  }
  async function loadStaff() {
    const { data } = await supabase.from('staff').select('*').order('name')
    if (data) setStaff(data)
  }

  async function saveResource() {
    if (!editRes) return
    const qty = parseInt(document.getElementById('editQty')?.value ?? editRes.quantity)
    const cond = document.getElementById('editCond')?.value ?? editRes.condition
    const loc = document.getElementById('editLoc')?.value ?? editRes.location
    await supabase.from('resources').update({ quantity: qty, condition: cond, location: loc, last_checked: new Date().toISOString().split('T')[0] }).eq('id', editRes.id)
    toast('✅ Resource updated!', 'success')
    setEditRes(null)
    loadResources()
  }

  async function adminLogin() {
    setLogging(true)
    const { error } = await signIn(email, password)
    setLogging(false)
    if (error) toast('❌ Invalid credentials.', 'error')
    else toast('✅ Logged in as Admin!', 'success')
  }

  async function resetCheckins() {
    const today = new Date().toISOString().split('T')[0]
    await supabase.from('checkins').delete().eq('date', today)
    toast('🔄 Check-ins reset.', 'success')
  }

  const catIcons = { medical: '🏥', fire: '🔥', equipment: '🔧', supplies: '📦' }
  const catOrder = ['medical', 'fire', 'equipment', 'supplies']
  const grouped = catOrder.reduce((acc, cat) => {
    const items = resources.filter(r => r.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})

  const hazardIcons = { earthquake: '🌍', fire: '🔥', flood: '🌊', typhoon: '🌀' }

  if (view === 'resources') return (
    <div className="fade-in">
      <button className="back-btn" onClick={() => setView('main')}>← Back</button>
      <div className="section-title" style={{ marginBottom: 14 }}>📦 Resource Inventory</div>
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} className="card">
          <div className="card-title">{catIcons[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}</div>
          {items.map(r => (
            <div key={r.id} className="resource-item">
              <div className="resource-icon">{r.name.includes('First Aid') ? '🧰' : r.name.includes('Extinguish') ? '🧯' : r.name.includes('Flash') ? '🔦' : r.name.includes('Water') ? '💧' : r.name.includes('Food') ? '🍱' : r.name.includes('Mega') ? '📢' : r.name.includes('Rope') ? '🪢' : r.name.includes('Bandage') ? '🩹' : r.name.includes('Sand') ? '🪣' : '📦'}</div>
              <div className="resource-info"><h4>{r.name}</h4><p>{r.location} · Updated {r.last_checked}</p></div>
              <div className="resource-qty">
                <div className="qty-num" style={{ color: r.condition === 'replace' ? 'var(--red)' : r.condition === 'low' ? 'var(--yellow)' : 'var(--navy)' }}>{r.quantity}</div>
                <span className={`badge badge-${r.condition}`}>{r.condition}</span>
              </div>
              {isAdmin && <button className="btn-icon" style={{ background: 'var(--blue-light)', color: '#3b82f6', marginLeft: 8 }} onClick={() => setEditRes(r)}>✏️</button>}
            </div>
          ))}
        </div>
      ))}
      {/* Edit modal */}
      {editRes && (
        <div className="modal-overlay" onClick={() => setEditRes(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h2>✏️ Update: {editRes.name}</h2>
            <div className="form-group"><label className="form-label">Quantity</label><input id="editQty" type="number" className="form-control" defaultValue={editRes.quantity} /></div>
            <div className="form-group"><label className="form-label">Condition</label>
              <select id="editCond" className="form-control" defaultValue={editRes.condition}>
                <option value="good">✅ Good</option><option value="low">⚠️ Low</option><option value="replace">❌ Replace</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Location</label><input id="editLoc" className="form-control" defaultValue={editRes.location} /></div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setEditRes(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2 }} onClick={saveResource}>💾 Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  if (view === 'evacuation') return (
    <div className="fade-in">
      <button className="back-btn" onClick={() => setView('main')}>← Back</button>
      <div className="section-title" style={{ marginBottom: 14 }}>🗺️ Evacuation Routes</div>
      {routes.map(r => (
        <div key={r.id} style={{ borderRadius: 'var(--radius-sm)', border: '2px solid var(--border)', padding: 14, marginBottom: 10, background: 'white' }}>
          <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--navy)' }}>{hazardIcons[r.hazard_type] || '⚠️'} {r.hazard_type.charAt(0).toUpperCase() + r.hazard_type.slice(1)}</h4>
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {r.route_description.split('→').map((step, i, arr) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ background: 'var(--bg)', padding: '4px 10px', borderRadius: 20, fontWeight: 600, fontSize: 11 }}>{step.trim()}</span>
                {i < arr.length - 1 && <span style={{ color: 'var(--navy)' }}>→</span>}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', marginTop: 8 }}>🟢 Assembly: {r.assembly_area}</div>
          {r.map_url && <a href={r.map_url} target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)', display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10 }}>📍 Open in Google Maps</a>}
        </div>
      ))}
    </div>
  )

  if (view === 'contacts') return (
    <div className="fade-in">
      <button className="back-btn" onClick={() => setView('main')}>← Back</button>
      <div className="section-title" style={{ marginBottom: 14 }}>☎️ Emergency Contacts</div>
      {[
        { title: '🚨 Primary Emergency', items: [
          { icon: '🚑', bg: '#fee2e2', name: 'Emergency Hotline', sub: 'National Emergency', tel: '911' },
          { icon: '🔥', bg: '#fef9c3', name: 'Bureau of Fire Protection', sub: 'BFP Emergency', tel: '117' },
          { icon: '👮', bg: '#dbeafe', name: 'PNP Camp Crame', sub: 'Camp Crame, QC', tel: '+6327226366' },
        ]},
        { title: '🌧️ DRRM Agencies', items: [
          { icon: '🌍', bg: '#dcfce7', name: 'NDRRMC Operations', sub: 'National DRRM Council', tel: '+6328911406' },
          { icon: '🌀', bg: '#e0f2fe', name: 'PAGASA Forecast', sub: 'Weather Bureau', tel: '+6328284480' },
          { icon: '🏙️', bg: '#fef9c3', name: 'QC DRRMO', sub: 'Quezon City DRRM Office', tel: '+6328892860' },
        ]},
        { title: '🏫 School Contacts', items: [
          { icon: '🏫', bg: '#f0f6ff', name: 'CCES Main Office', sub: '(02) 7754-2648', tel: '+6277542648' },
          { icon: '🏥', bg: '#f0f6ff', name: 'Camp Crame Station Hospital', sub: 'Nearest hospital · ~0.3km', tel: '+6327227801' },
        ]},
      ].map(section => (
        <div key={section.title} className="card">
          <div className="card-title">{section.title}</div>
          {section.items.map(c => (
            <div key={c.name} className="contact-item">
              <div className="contact-icon" style={{ background: c.bg }}>{c.icon}</div>
              <div className="contact-info"><h4>{c.name}</h4><p>{c.sub}</p></div>
              <a href={`tel:${c.tel}`}><button className="call-btn">📞 {c.tel === '911' || c.tel === '117' ? c.tel : 'Call'}</button></a>
            </div>
          ))}
        </div>
      ))}
    </div>
  )

  if (view === 'drills') return (
    <div className="fade-in">
      <button className="back-btn" onClick={() => setView('main')}>← Back</button>
      <div className="section-title" style={{ marginBottom: 14 }}>📅 Drill History</div>
      <div className="card">
        {drills.length === 0
          ? <div className="empty-state"><div className="empty-icon">📅</div><p>No drills recorded yet</p></div>
          : drills.map(d => {
            const dt = new Date(d.date)
            return (
              <div key={d.id} className="drill-item">
                <div className="drill-date">
                  <div className="drill-dd">{dt.getDate().toString().padStart(2,'0')}</div>
                  <div className="drill-mm">{dt.toLocaleString('en',{month:'short'}).toUpperCase()}</div>
                </div>
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 700 }}>{d.type}</h4>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{d.duration_mins} mins · {d.staff_present}/{d.total_staff} staff · {d.success ? '✅ Successful' : '⚠️ Issues noted'}</p>
                  {d.notes && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{d.notes}</p>}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )

  if (view === 'admin') return (
    <div className="fade-in">
      <button className="back-btn" onClick={() => setView('main')}>← Back</button>
      <div className="section-title" style={{ marginBottom: 14 }}>⚙️ Admin Panel</div>
      {!isAdmin ? (
        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--navy)', marginBottom: 4 }}>Admin Login</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>For the DRRM Coordinator only</p>
          <div className="form-group"><label className="form-label">Email</label><input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@cces.edu.ph" /></div>
          <div className="form-group"><label className="form-label">Password</label><input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" /></div>
          <button className="btn btn-primary" onClick={adminLogin} disabled={logging}>{logging ? 'Logging in...' : '🔐 Log In'}</button>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10, textAlign: 'center' }}>Create your admin account in Supabase Auth first.</p>
        </div>
      ) : (
        <>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><div style={{ fontSize: 15, fontWeight: 900, color: 'var(--navy)' }}>Welcome, Coordinator!</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.email}</div></div>
              <button className="btn btn-outline btn-sm" onClick={() => { signOut(); toast('Logged out.') }}>Logout</button>
            </div>
          </div>
          <div className="admin-section"><h3>⚡ Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={resetCheckins}>🔄 Reset Check-ins</button>
              <button className="btn btn-primary btn-sm" style={{ width: '100%' }}>📊 Export Report</button>
            </div>
          </div>
          <div className="admin-section"><h3>🌡️ School Status</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {[['normal','var(--green)','🟢 Normal'],['watch','var(--yellow)','🟡 Watch'],['alert','var(--red)','🔴 Alert']].map(([s,bg,label])=>(
                <button key={s} className="btn" style={{ background: bg, color: 'white', fontSize: 12, padding: 10 }} onClick={() => { onStatusChange?.(s); toast(`Status set to ${s}`) }}>{label}</button>
              ))}
            </div>
          </div>
          <div className="admin-section"><h3>🌀 PAGASA Signal</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
              {[0,1,2,3].map(n => (
                <button key={n} className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={() => { onSignalChange?.(n); toast(`Signal #${n} set`) }}>
                  {n === 0 ? 'No Signal' : `Signal #${n}`}
                </button>
              ))}
            </div>
          </div>
          <div className="admin-section"><h3>👥 Staff List</h3>
            <div className="card">
              {staff.slice(0, 6).map(s => (
                <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <div><div style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.role}</div></div>
                  <span className={`badge ${s.active ? 'badge-good' : 'badge-reported'}`}>{s.active ? 'Active' : 'Inactive'}</span>
                </div>
              ))}
              {staff.length > 6 && <div style={{ textAlign: 'center', padding: '8px 0', fontSize: 12, color: 'var(--text-muted)' }}>...and {staff.length - 6} more</div>}
            </div>
          </div>
        </>
      )}
    </div>
  )

  if (view === 'about') return (
    <div className="fade-in">
      <button className="back-btn" onClick={() => setView('main')}>← Back</button>
      <div className="card" style={{ textAlign: 'center', padding: '30px 20px' }}>
        <img src={logo} alt="CCES Logo" style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--gold)', marginBottom: 16, objectFit: 'cover' }} />
        <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--navy)' }}>CCES DRRM Portal</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Camp Crame Elementary School</p>
        <div style={{ margin: '16px 0', padding: 16, background: 'var(--bg)', borderRadius: 12, fontSize: 12, color: 'var(--text-muted)', lineHeight: 2.2, textAlign: 'left' }}>
          📱 Version 2.0.0<br />🏫 Est. 1952 · QC District XVII<br />
          📍 Castañeda St., Camp Crame, QC<br />
          📞 (02) 7754-2648<br />📧 campcrame_es@yahoo.com.ph<br />
          🛠️ Built with React + Supabase
        </div>
      </div>
    </div>
  )

  return (
    <div className="fade-in">
      <div className="more-menu">
        {[
          { id: 'evacuation', icon: '🗺️', label: 'Evacuation Routes', sub: 'Routes per hazard type' },
          { id: 'resources', icon: '📦', label: 'Resource Inventory', sub: 'Emergency supplies' },
          { id: 'contacts', icon: '☎️', label: 'Emergency Contacts', sub: 'One-tap call' },
          { id: 'drills', icon: '📅', label: 'Drill History', sub: 'Past drill records' },
          { id: 'admin', icon: '⚙️', label: 'Admin Panel', sub: isAdmin ? '✅ Logged in' : 'Coordinator only' },
          { id: 'about', icon: 'ℹ️', label: 'About', sub: 'App info & contacts' },
        ].map(item => (
          <div key={item.id} className="more-item" onClick={() => setView(item.id)}>
            <div className="more-icon">{item.icon}</div>
            <h4>{item.label}</h4>
            <p>{item.sub}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
