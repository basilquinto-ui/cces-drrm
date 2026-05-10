import { useEffect, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { fetchDashboardSummary } from '../services/dashboardService'

const hazardEmoji = { earthquake: '🌍', typhoon: '🌀', flood: '🌊', fire: '🔥', landslide: '⛰️', general: '⚠️' }

export default function Dashboard({ weather, signal, status }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [summary, setSummary] = useState({
    activeAlertsCount: 0,
    openIncidentsCount: 0,
    staffCheckinsTodayCount: 0,
    resolvedIncidentsTodayCount: 0,
    recentIncidents: [],
  })

  const safeWeather = weather?.condition || 'No weather data loaded yet.'

  useEffect(() => {
    let isMounted = true

    async function loadDashboard() {
      setLoading(true)
      setError('')
      try {
        const data = await fetchDashboardSummary()
        if (isMounted) setSummary(data)
      } catch (err) {
        if (isMounted) setError(err?.message || 'Failed to load dashboard data.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadDashboard()
    return () => { isMounted = false }
  }, [])

  return (
    <div className="fade-in">
      <PageHeader title="Dashboard" description="Operational snapshot for school safety and readiness." />

      {loading && <section className="portal-card"><p>Loading operational dashboard data...</p></section>}
      {!loading && error && <section className="portal-card"><p>Unable to load dashboard metrics: {error}</p></section>}

      <div className="dashboard-grid">
        <section className="portal-card">
          <h3>School Safety Status</h3>
          <p className={`status-badge status-${status}`}>{status?.toUpperCase() || 'NORMAL'}</p>
          <p>Current signal level: {signal}</p>
        </section>

        <section className="portal-card">
          <h3>Weather / Risk Summary</h3>
          <p>{safeWeather}</p>
          <p>Keep monitoring official advisories for sudden changes.</p>
        </section>

        <section className="portal-card">
          <h3>Active Alerts</h3>
          <p className="status-badge">{summary.activeAlertsCount}</p>
        </section>

        <section className="portal-card">
          <h3>Open Incidents</h3>
          <p className="status-badge">{summary.openIncidentsCount}</p>
        </section>

        <section className="portal-card">
          <h3>Staff Check-ins Today</h3>
          <p className="status-badge">{summary.staffCheckinsTodayCount}</p>
        </section>

        <section className="portal-card">
          <h3>Resolved Today</h3>
          <p className="status-badge">{summary.resolvedIncidentsTodayCount}</p>
        </section>

        <section className="portal-card">
          <h3>Daily Hazard Map</h3>
          <p>Campus map is on static daily summary mode.</p>
          <p>Review evacuation routes and watch zones before class starts.</p>
        </section>
      </div>

      <section className="portal-card" style={{ marginTop: 16 }}>
        <h3>Recent Incidents</h3>
        {summary.recentIncidents.length === 0 ? (
          <p>No recent incidents recorded.</p>
        ) : (
          summary.recentIncidents.map((incident) => (
            <div key={incident.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
              <p>
                {hazardEmoji[incident.hazard_type] || '⚠️'} {incident.location} · {incident.severity} · {incident.status}
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                {new Date(incident.created_at).toLocaleString('en-PH')} · Reported by {incident.reported_by}
              </p>
            </div>
          ))
        )}
      </section>
    </div>
  )
}
