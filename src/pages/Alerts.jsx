import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { useToast } from '../components/Toast'
import { createAlert, fetchAlerts, updateAlertActive } from '../services/alertManagementService'

const LEVEL_LABELS = { drill: 'Drill', watch: 'Watch', warning: 'Warning', emergency: 'Emergency' }
const ACTIVE_OPTIONS = [{ value: 'all', label: 'All' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]

const formatLabel = value => {
  if (!value) return 'Unknown'
  return value
    .toString()
    .replace(/_/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const formatDateTime = value => {
  if (!value) return 'Unknown date'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Unknown date' : date.toLocaleString('en-PH')
}

export default function Alerts({ isAdmin, user }) {
  const toast = useToast()
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filters, setFilters] = useState({ activeStatus: 'all', level: 'all', hazardType: 'all', search: '' })
  const [form, setForm] = useState({ hazard_type: '', level: 'drill', message: '' })

  const counts = useMemo(() => ({
    active: alerts.filter(a => a.active).length,
    inactive: alerts.filter(a => !a.active).length,
    severe: alerts.filter(a => ['warning', 'emergency'].includes(a.level)).length,
  }), [alerts])

  const hazardOptions = useMemo(() => ['all', ...new Set(alerts.map(a => a.hazard_type).filter(Boolean))], [alerts])

  useEffect(() => { loadAlerts() }, [filters])

  async function loadAlerts() {
    setLoading(true)
    setError('')
    setSuccess('')
    try { setAlerts(await fetchAlerts(filters)) } catch (e) { setError(e.message || 'Unable to load alerts.') } finally { setLoading(false) }
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!form.hazard_type || !form.level || !form.message.trim()) return
    setSaving(true)
    setError('')
    setSuccess('')
    const issuedBy = user?.email || 'System User'

    try {
      await createAlert({ ...form, message: form.message.trim(), issued_by: issuedBy, active: true })
      setForm({ hazard_type: '', level: 'drill', message: '' })
      setSuccess('Alert created successfully.')
      toast('Alert created successfully.', 'success')
      loadAlerts()
    } catch (e) {
      const msg = e.message || 'Unable to create alert.'
      setError(msg)
      toast(msg, 'error')
    } finally { setSaving(false) }
  }

  async function handleToggle(alert) {
    setError('')
    setSuccess('')
    try {
      await updateAlertActive(alert.id, !alert.active)
      const msg = `Alert marked as ${alert.active ? 'resolved' : 'active'}.`
      setSuccess(msg)
      toast(msg, 'success')
      loadAlerts()
    } catch (e) {
      const msg = e.message || 'Unable to update alert status.'
      setError(msg)
      toast(msg, 'error')
    }
  }

  return <div className="fade-in">
    <PageHeader title="Alert Management" description="Create, monitor, and resolve portal alerts." />
    <div className="dashboard-grid">
      <section className="portal-card"><h3>Active Alerts</h3><p className="status-badge">{counts.active}</p></section>
      <section className="portal-card"><h3>Resolved Alerts</h3><p className="status-badge">{counts.inactive}</p></section>
      <section className="portal-card"><h3>Warning/Emergency</h3><p className="status-badge">{counts.severe}</p></section>
    </div>

    {isAdmin && <section className="portal-card" style={{ marginTop: 14 }}><h3>Create Alert</h3><form onSubmit={handleCreate}>
      <div className="form-group"><label>Hazard Type</label><input className="form-control" value={form.hazard_type} onChange={e => setForm({ ...form, hazard_type: e.target.value })} placeholder="e.g. flood" required /></div>
      <div className="form-group"><label>Level</label><select className="form-control" value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>{Object.entries(LEVEL_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
      <div className="form-group"><label>Message</label><textarea className="form-control" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required /></div>
      <button className="btn" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create Alert'}</button>
    </form></section>}

    <section className="portal-card" style={{ marginTop: 14 }}><h3>Filters</h3><div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
      <div className="form-group"><label>Status</label><select className="form-control" value={filters.activeStatus} onChange={e => setFilters({ ...filters, activeStatus: e.target.value })}>{ACTIVE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
      <div className="form-group"><label>Level</label><select className="form-control" value={filters.level} onChange={e => setFilters({ ...filters, level: e.target.value })}><option value="all">All</option>{Object.entries(LEVEL_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
      <div className="form-group"><label>Hazard Type</label><select className="form-control" value={filters.hazardType} onChange={e => setFilters({ ...filters, hazardType: e.target.value })}>{hazardOptions.map(h => <option key={h} value={h}>{h === 'all' ? 'All' : formatLabel(h)}</option>)}</select></div>
      <div className="form-group"><label>Search</label><input className="form-control" value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} placeholder="Message or issuer" /></div>
    </div></section>

    {loading && <section className="portal-card" style={{ marginTop: 14 }}><p>Loading alerts...</p></section>}
    {!loading && error && <section className="portal-card" style={{ marginTop: 14 }}><p>{error}</p></section>}
    {!loading && !error && success && <section className="portal-card" style={{ marginTop: 14 }}><p>{success}</p></section>}
    {!loading && !error && <section className="portal-card" style={{ marginTop: 14 }}>{alerts.length === 0 ? <p>No alerts match the current filters.</p> : <div className="monitor-table-wrap"><table className="monitor-table"><thead><tr><th>Created</th><th>Hazard Type</th><th>Level</th><th>Message</th><th>Issued By</th><th>Status</th>{isAdmin && <th>Action</th>}</tr></thead><tbody>
      {alerts.map(a => <tr key={a.id}><td>{formatDateTime(a.created_at)}</td><td>{formatLabel(a.hazard_type)}</td><td><span className="badge">{LEVEL_LABELS[a.level] || formatLabel(a.level)}</span></td><td>{a.message}</td><td>{a.issued_by}</td><td><span className={`status-badge status-${a.active ? 'alert' : 'normal'}`}>{a.active ? 'Active' : 'Resolved'}</span></td>{isAdmin && <td><button className="btn btn-outline btn-sm" onClick={() => handleToggle(a)}>{a.active ? 'Mark Resolved' : 'Mark Active'}</button></td>}</tr>)}
    </tbody></table></div>}</section>}
  </div>
}
