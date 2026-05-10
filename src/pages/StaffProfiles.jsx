import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { fetchProfiles, fetchStaffOptions, updateProfileActive, updateProfileRole, updateProfileStaffId } from '../services/profileManagementService'

const ROLE_OPTIONS = ['admin', 'staff', 'viewer']

export default function StaffProfiles({ isAdmin }) {
  const [profiles, setProfiles] = useState([])
  const [staffOptions, setStaffOptions] = useState([])
  const [staffDrafts, setStaffDrafts] = useState({})
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => { loadPage() }, [])

  async function loadPage() {
    setLoading(true)
    setError('')
    const [{ data, error: profileError }, staffResult] = await Promise.all([fetchProfiles(), fetchStaffOptions()])
    if (profileError) setError(profileError.message || 'Failed to load profiles.')
    setProfiles(data || [])
    setStaffOptions(staffResult?.data || [])
    setStaffDrafts(Object.fromEntries((data || []).map((p) => [p.id, p.staff_id || ''])))
    setLoading(false)
  }

  const stats = useMemo(() => {
    const adminCount = profiles.filter((p) => p.role === 'admin').length
    const staffCount = profiles.filter((p) => p.role === 'staff').length
    const viewerCount = profiles.filter((p) => p.role === 'viewer').length
    const inactiveCount = profiles.filter((p) => p.active === false).length
    const missingStaffLinkCount = profiles.filter((p) => !p.staff_id).length
    return { adminCount, staffCount, viewerCount, inactiveCount, missingStaffLinkCount }
  }, [profiles])

  async function save(id, action) {
    setSavingId(id)
    setMessage('')
    const { error: saveError } = await action()
    if (saveError) setError(saveError.message || 'Update failed.')
    else setMessage('Profile updated successfully.')
    await loadPage()
    setSavingId('')
  }

  return (
    <div className="fade-in">
      <PageHeader title="Staff & Profile Management" description="Review role, active status, and staff link completeness for portal users." />
      {!isAdmin && <section className="portal-card" style={{ marginTop: 14 }}><p style={{ margin: 0 }}>Read-only view. Admin access is required to update profiles.</p></section>}
      {loading && <section className="portal-card" style={{ marginTop: 14 }}><p>Loading profiles...</p></section>}
      {!!error && !loading && <section className="portal-card" style={{ marginTop: 14 }}><p style={{ color: '#b91c1c' }}>{error}</p></section>}
      {!!message && !loading && <section className="portal-card" style={{ marginTop: 14 }}><p style={{ color: '#166534' }}>{message}</p></section>}

      {!loading && !error && <>
        <section className="dashboard-grid">
          <div className="portal-card"><h4>Total Profiles</h4><p className="status-badge">{profiles.length}</p></div>
          <div className="portal-card"><h4>Admin</h4><p className="status-badge">{stats.adminCount}</p></div>
          <div className="portal-card"><h4>Staff</h4><p className="status-badge">{stats.staffCount}</p></div>
          <div className="portal-card"><h4>Viewer</h4><p className="status-badge">{stats.viewerCount}</p></div>
          <div className="portal-card"><h4>Inactive</h4><p className="status-badge status-alert">{stats.inactiveCount}</p></div>
          <div className="portal-card"><h4>Missing Staff Link</h4><p className="status-badge status-watch">{stats.missingStaffLinkCount}</p></div>
        </section>

        <section className="portal-card" style={{ marginTop: 14 }}>
          {profiles.length === 0 ? <p>No profiles found.</p> : (
            <div className="monitor-table-wrap">
              <table className="monitor-table">
                <thead><tr><th>Full Name</th><th>Role</th><th>Staff ID</th><th>Active</th><th>Link</th>{isAdmin && <th>Actions</th>}</tr></thead>
                <tbody>
                  {profiles.map((profile) => {
                    const linked = !!profile.staff_id
                    return (
                      <tr key={profile.id}>
                        <td>{profile.full_name || '—'}</td>
                        
                        <td>{isAdmin ? <select className="form-control" value={profile.role || 'viewer'} disabled={savingId === profile.id} onChange={(e) => save(profile.id, () => updateProfileRole(profile.id, e.target.value))}>{ROLE_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}</select> : <span className="badge">{profile.role || 'viewer'}</span>}</td>
                        <td>{isAdmin ? <input className="form-control" list="staff-options" value={staffDrafts[profile.id] ?? ''} disabled={savingId === profile.id} onChange={(e) => setStaffDrafts((prev) => ({ ...prev, [profile.id]: e.target.value }))} /> : (profile.staff_id || '—')}</td>
                        <td>{isAdmin ? <button className="btn btn-outline btn-sm" disabled={savingId === profile.id} onClick={() => save(profile.id, () => updateProfileActive(profile.id, profile.active === false))}>{profile.active === false ? 'Set Active' : 'Set Inactive'}</button> : <span className={`status-badge status-${profile.active === false ? 'alert' : 'normal'}`}>{profile.active === false ? 'Inactive' : 'Active'}</span>}</td>
                        <td><span className={`status-badge status-${linked ? 'normal' : 'watch'}`}>{linked ? 'Linked' : 'Not linked'}</span></td>
                        {isAdmin && <td><button className="btn btn-primary btn-sm" disabled={savingId === profile.id} onClick={() => save(profile.id, () => updateProfileStaffId(profile.id, staffDrafts[profile.id]))}>Save Staff ID</button></td>}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <datalist id="staff-options">{staffOptions.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</datalist>
            </div>
          )}
        </section>
      </>}
    </div>
  )
}
