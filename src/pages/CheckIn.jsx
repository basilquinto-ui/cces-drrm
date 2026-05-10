import { useEffect, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { fetchCheckinMonitorData } from '../services/checkinMonitorService'

const STATUS_LABELS = {
  safe: 'Safe',
  needs_help: 'Needs Help',
  medical: 'Needs Medical Assistance',
  evacuation: 'At Evacuation Area',
  not_on_campus: 'Not on Campus',
}

const STATUS_KEYS = ['safe', 'needs_help', 'medical', 'evacuation', 'not_on_campus']

function formatDateLabel(dateKey) {
  if (!dateKey) return 'Today'
  const parsed = new Date(`${dateKey}T00:00:00`)
  return Number.isNaN(parsed.getTime())
    ? dateKey
    : parsed.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function formatStatus(status) {
  return STATUS_LABELS[status] || 'Unknown'
}

function formatTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export default function CheckIn({ isAdmin }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [monitor, setMonitor] = useState({
    dateKey: '',
    staffAvailable: false,
    statusCounts: { totalCheckedIn: 0, safe: 0, needs_help: 0, medical: 0, evacuation: 0, not_on_campus: 0, not_checked_in: null },
    checkinRows: [],
  })

  useEffect(() => {
    let mounted = true

    async function loadMonitor() {
      setLoading(true)
      setError('')
      try {
        const data = await fetchCheckinMonitorData()
        if (mounted) setMonitor(data)
      } catch (err) {
        if (mounted) setError(err?.message || 'Failed to load check-in monitor data.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadMonitor()
    return () => {
      mounted = false
    }
  }, [])

  const counts = monitor.statusCounts

  return (
    <div className="fade-in">
      <PageHeader title="Check-In Monitor" description="Live daily staff check-in status for DRRM coordination." />

      <section className="portal-card" style={{ marginTop: 14 }}>
        <p style={{ margin: 0 }}><strong>Date:</strong> {formatDateLabel(monitor.dateKey)}</p>
        {!isAdmin && <p style={{ margin: '8px 0 0', color: 'var(--text-muted)' }}>Read-only monitor view based on your current access.</p>}
      </section>

      {loading && <section className="portal-card" style={{ marginTop: 14 }}><p>Loading check-in monitor...</p></section>}
      {!loading && error && <section className="portal-card" style={{ marginTop: 14 }}><p>Unable to load check-in monitor: {error}</p></section>}

      {!loading && !error && (
        <>
          <div className="dashboard-grid">
            <section className="portal-card"><h3>Total Checked In</h3><p className="status-badge">{counts.totalCheckedIn}</p></section>
            <section className="portal-card"><h3>Safe</h3><p className="status-badge">{counts.safe}</p></section>
            <section className="portal-card"><h3>Needs Help</h3><p className="status-badge">{counts.needs_help}</p></section>
            <section className="portal-card"><h3>Needs Medical Assistance</h3><p className="status-badge">{counts.medical}</p></section>
            <section className="portal-card"><h3>At Evacuation Area</h3><p className="status-badge">{counts.evacuation}</p></section>
            <section className="portal-card"><h3>Not on Campus</h3><p className="status-badge">{counts.not_on_campus}</p></section>
            {monitor.staffAvailable && (
              <section className="portal-card"><h3>Not Checked In</h3><p className="status-badge">{counts.not_checked_in ?? 0}</p></section>
            )}
          </div>

          <section className="portal-card" style={{ marginTop: 14 }}>
            <h3 style={{ marginTop: 0 }}>Today&apos;s Staff Check-ins</h3>
            {monitor.checkinRows.length === 0 ? (
              <p>No staff check-ins recorded yet for today.</p>
            ) : (
              <div className="monitor-table-wrap">
                <table className="monitor-table">
                  <thead>
                    <tr>
                      <th>Staff</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monitor.checkinRows.map((row) => (
                      <tr key={row.id}>
                        <td>{row.staffName}</td>
                        <td>{row.role}</td>
                        <td>{formatStatus(row.status)}</td>
                        <td>{formatTime(row.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="portal-card" style={{ marginTop: 14 }}>
            <h3 style={{ marginTop: 0 }}>Status Key</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {STATUS_KEYS.map((key) => (
                <span key={key} className="status-badge">{STATUS_LABELS[key]}</span>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
