import { useEffect, useMemo, useState } from 'react'
import { fetchIncidents, updateIncidentNotes, updateIncidentStatus } from '../services/incidentManagementService'

const STATUS_OPTIONS = ['reported', 'acknowledged', 'responding', 'resolved']
const SEVERITY_OPTIONS = ['minor', 'moderate', 'severe']
const STATUS_LABELS = { reported: 'Reported', acknowledged: 'Acknowledged', responding: 'Responding', resolved: 'Resolved' }
const SEVERITY_LABELS = { minor: 'Minor', moderate: 'Moderate', severe: 'Severe' }

export default function Incidents({ isAdmin }) {
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState('')
  const [noteDrafts, setNoteDrafts] = useState({})
  const [filters, setFilters] = useState({ status: 'all', severity: 'all', hazardType: 'all', search: '' })

  const hazardTypes = useMemo(() => [...new Set(incidents.map(i => i.hazard_type).filter(Boolean))], [incidents])
  const totalCount = incidents.length
  const openCount = incidents.filter(i => i.status !== 'resolved').length
  const severeCount = incidents.filter(i => i.severity === 'severe').length
  const resolvedCount = incidents.filter(i => i.status === 'resolved').length

  useEffect(() => { loadIncidents() }, [filters])

  async function loadIncidents() {
    setLoading(true)
    setError('')
    try {
      const data = await fetchIncidents(filters)
      setIncidents(data)
      setNoteDrafts(Object.fromEntries(data.map(i => [i.id, i.admin_notes || ''])))
    } catch (err) {
      setError(err.message || 'Failed to load incidents')
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusUpdate(id, status) {
    setSavingId(id)
    setError('')
    try {
      const updated = await updateIncidentStatus(id, status)
      setIncidents(list => list.map(item => item.id === id ? updated : item))
    } catch (err) {
      setError(err.message || 'Failed to update incident status')
    } finally {
      setSavingId('')
    }
  }

  async function handleNoteUpdate(id) {
    setSavingId(id)
    setError('')
    try {
      const updated = await updateIncidentNotes(id, noteDrafts[id] || '')
      setIncidents(list => list.map(item => item.id === id ? updated : item))
    } catch (err) {
      setError(err.message || 'Failed to update admin notes')
    } finally {
      setSavingId('')
    }
  }

  return (
    <section>
      <h2>Incident Management</h2>
      <div className="dashboard-grid">
        <div className="portal-card"><h3>Total Incidents</h3><p className="status-badge">{totalCount}</p></div>
        <div className="portal-card"><h3>Open Incidents</h3><p className="status-badge">{openCount}</p></div>
        <div className="portal-card"><h3>Severe Incidents</h3><p className="status-badge">{severeCount}</p></div>
        <div className="portal-card"><h3>Resolved Incidents</h3><p className="status-badge">{resolvedCount}</p></div>
      </div>

      <section className="portal-card" style={{ marginTop: 16 }}>
        <div className="incident-filters">
          <select className="form-control" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
            <option value="all">All Statuses</option>{STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <select className="form-control" value={filters.severity} onChange={e => setFilters(f => ({ ...f, severity: e.target.value }))}>
            <option value="all">All Severities</option>{SEVERITY_OPTIONS.map(s => <option key={s} value={s}>{SEVERITY_LABELS[s]}</option>)}
          </select>
          <select className="form-control" value={filters.hazardType} onChange={e => setFilters(f => ({ ...f, hazardType: e.target.value }))}>
            <option value="all">All Hazard Types</option>{hazardTypes.map(h => <option key={h} value={h}>{h.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
          </select>
          <input className="form-control" placeholder="Search location, reporter, description" value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} />
        </div>
      </section>

      {loading && <section className="portal-card" style={{ marginTop: 14 }}><p>Loading incidents...</p></section>}
      {!loading && error && <section className="portal-card" style={{ marginTop: 14 }}><p>Unable to load incidents: {error}</p></section>}
      {!loading && !error && incidents.length === 0 && <section className="portal-card" style={{ marginTop: 14 }}><p>No incidents match the current filters.</p></section>}

      {!loading && !error && incidents.length > 0 && (
        <section className="portal-card" style={{ marginTop: 14 }}>
          <div className="monitor-table-wrap">
            <table className="monitor-table">
              <thead><tr><th>Date / Time</th><th>Location</th><th>Hazard</th><th>Severity</th><th>Status</th><th>Reported By</th><th>Description</th><th>Photo</th><th>Admin Notes</th></tr></thead>
              <tbody>
                {incidents.map(incident => (
                  <tr key={incident.id}>
                    <td>{new Date(incident.created_at).toLocaleString()}</td>
                    <td>{incident.location}</td>
                    <td>{(incident.hazard_type || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</td>
                    <td><span className={`badge badge-${incident.severity}`}>{SEVERITY_LABELS[incident.severity] || incident.severity}</span></td>
                    <td>{isAdmin ? <select className="form-control" disabled={savingId === incident.id} value={incident.status} onChange={e => handleStatusUpdate(incident.id, e.target.value)}>{STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}</select> : <span className={`badge badge-${incident.status}`}>{STATUS_LABELS[incident.status] || incident.status}</span>}</td>
                    <td>{incident.reported_by}</td>
                    <td>{incident.description}</td>
                    <td>{incident.photo_url ? <a href={incident.photo_url} target="_blank" rel="noopener noreferrer">View Photo</a> : '—'}</td>
                    <td>
                      {isAdmin ? <div className="incident-note-cell"><textarea className="form-control" value={noteDrafts[incident.id] || ''} onChange={e => setNoteDrafts(n => ({ ...n, [incident.id]: e.target.value }))} /><button className="btn btn-outline" disabled={savingId === incident.id} onClick={() => handleNoteUpdate(incident.id)}>Update Notes</button></div> : (incident.admin_notes || '—')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </section>
  )
}
