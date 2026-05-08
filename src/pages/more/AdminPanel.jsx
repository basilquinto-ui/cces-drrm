export default function AdminPanel({ isAdmin, user, role, staff, onResetCheckins, onStatusChange, onSignalChange, toast, onSignOut }) {
  if (!isAdmin) {
    return (
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--navy)', marginBottom: 4 }}>Admin access required.</h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Please sign in with an admin profile to continue.</p>
      </div>
    )
  }

  return (
    <>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><div style={{ fontSize: 15, fontWeight: 900, color: 'var(--navy)' }}>Welcome, Coordinator!</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.email} · {role}</div></div>
          <button className="btn btn-outline btn-sm" onClick={onSignOut}>Logout</button>
        </div>
      </div>
      <div className="admin-section"><h3> Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={onResetCheckins}> Reset Check-ins</button>
          <button className="btn btn-primary btn-sm" style={{ width: '100%' }}> Export Report</button>
        </div>
      </div>
      <div className="admin-section"><h3> School Status</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {[['normal','var(--green)',' Normal'],['watch','var(--yellow)',' Watch'],['alert','var(--red)',' Alert']].map(([s,bg,label])=>(
            <button key={s} className="btn" style={{ background: bg, color: 'white', fontSize: 12, padding: 10 }} onClick={() => { onStatusChange?.(s); toast(`Status set to ${s}`) }}>{label}</button>
          ))}
        </div>
      </div>
      <div className="admin-section"><h3> PAGASA Signal</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
          {[0,1,2,3].map(n => <button key={n} className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={() => { onSignalChange?.(n); toast(`Signal #${n} set`) }}>{n === 0 ? 'No Signal' : `Signal #${n}`}</button>)}
        </div>
      </div>
      <div className="admin-section"><h3> Staff List</h3>
        <div className="card">
          {staff.slice(0, 6).map(s => <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}><div><div style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.role}</div></div><span className={`badge ${s.active ? 'badge-good' : 'badge-reported'}`}>{s.active ? 'Active' : 'Inactive'}</span></div>)}
          {staff.length > 6 && <div style={{ textAlign: 'center', padding: '8px 0', fontSize: 12, color: 'var(--text-muted)' }}>...and {staff.length - 6} more</div>}
        </div>
      </div>
    </>
  )
}
