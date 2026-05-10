import { useEffect, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { fetchCheckinMonitorSummary } from '../services/checkinMonitorService'

const STATUS_LABELS = {
  safe: 'Safe',
  needs_help: 'Needs Help',
  medical: 'Needs Medical Assistance',
  evacuation: 'At Evacuation Area',
  not_on_campus: 'Not on Campus',
}

function formatDateLabel(dateKey) {
  const date = dateKey ? new Date(`${dateKey}T00:00:00`) : new Date()
  return Number.isNaN(date.getTime())
    ? 'Today'
    : date.toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function formatTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleTimeString('en-PH', { hour: 'numeric', minute: '2-digit' })
}

function statusLabel(status) {
  return STATUS_LABELS[status] || 'Unknown'
}

function CountCard({ title, value }) {
  return <section className="portal-card"><h3>{title}</h3><p className="status-badge">{value}</p></section>
}

export default function CheckIn({ isAdmin }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [monitor, setMonitor] = useState({
    dateKey: '',
    checkinsToday: [],
    statusCounts: { totalCheckedIn: 0, safe: 0, needs_help: 0, medical: 0, evacuation: 0, not_on_campus: 0 },
    notCheckedInCount: null,
    staffRosterAvailable: false,
  })

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await fetchCheckinMonitorSummary()
        if (active) setMonitor(data)
      } catch (err) {
        if (active) setError(err?.message || 'Failed to load check-in monitor data.')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const counts = monitor.statusCounts

  return (
    <div className="fade-in">
      <PageHeader title="Check-In Monitor" description="Daily staff check-in status submitted from the mobile app." />

      <section className="portal-card" style={{ marginTop: 14 }}>
        <p style={{ margin: 0 }}><strong>Date:</strong> {formatDateLabel(monitor.dateKey)}</p>
        {!isAdmin && <p style={{ margin: '8px 0 0', color: 'var(--text-muted)' }}>Read-only monitor view based on your current access.</p>}
        {!monitor.staffRosterAvailable && !loading && !error && (
          <p style={{ margin: '8px 0 0', color: 'var(--text-muted)' }}>Staff roster unavailable. Showing submitted check-ins only.</p>
        )}
      </section>

      {loading && <section className="portal-card" style={{ marginTop: 14 }}><p>Loading check-in monitor...</p></section>}
      {!loading && error && <section className="portal-card" style={{ marginTop: 14 }}><p>Unable to load check-in monitor: {error}</p></section>}

      {!loading && !error && (
        <>
          <div className="dashboard-grid">
            <CountCard title="Total Checked In" value={counts.totalCheckedIn} />
            <CountCard title="Safe" value={counts.safe} />
            <CountCard title="Needs Help" value={counts.needs_help} />
            <CountCard title="Needs Medical Assistance" value={counts.medical} />
            <CountCard title="At Evacuation Area" value={counts.evacuation} />
            <CountCard title="Not on Campus" value={counts.not_on_campus} />
            {monitor.staffRosterAvailable && <CountCard title="Not Checked In" value={monitor.notCheckedInCount ?? 0} />}
          </div>

          <section className="portal-card" style={{ marginTop: 14 }}>
            <h3 style={{ marginTop: 0 }}>Today&apos;s Check-Ins</h3>
            {monitor.checkinsToday.length === 0 ? (
              <p>No check-ins submitted yet for today.</p>
            ) : (
              <div className="monitor-table-wrap">
                <table className="monitor-table">
                  <thead>
                    <tr>
                      <th>Staff</th>
                      <th>Staff ID</th>
                      <th>Status</th>
                      <th>Check-In Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monitor.checkinsToday.map((row) => (
                      <tr key={row.id}>
                        <td>{row.staffName || `Staff ID: ${row.staff_id}`}</td>
                        <td>{row.staff_id}</td>
                        <td>{statusLabel(row.status)}</td>
                        <td>{formatTime(row.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
