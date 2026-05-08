import { useEffect, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { fetchDashboardData } from '../services/dashboardService'

export default function Dashboard({ weather, signal, isAdmin, onNavigate }) {
  const [stats, setStats] = useState({ alerts: 0, incidents: 0, checkins: 0 })
  const [recent, setRecent] = useState([])
  const [hazardSummary, setHazardSummary] = useState([])

  useEffect(() => {
    async function loadDashboard() {
      const result = await fetchDashboardData()
      setStats(result.stats)
      setRecent(result.recentIncidents)
      setHazardSummary(result.hazardSummary)
    }

    loadDashboard()
  }, [])

  const cards = [
    ['Safety Status', stats.alerts > 0 ? 'Alert' : 'All Clear'],
    ['Weather / Signal', `${weather.label || weather.type} · Signal ${signal}`],
    ['Active Alerts', stats.alerts],
    ['Open Incidents', stats.incidents],
    ['Staff Checked In Today', stats.checkins],
  ]

  return (
    <div>
      <PageHeader
        title="School Safety Dashboard"
        subtitle="Desktop command center overview"
        right={
          isAdmin ? (
            <button className="btn btn-primary" onClick={() => onNavigate('admin')}>
              Admin Actions
            </button>
          ) : null
        }
      />

      <div className="metric-grid">
        {cards.map(([label, value]) => (
          <article key={label} className="metric-card">
            <h4>{label}</h4>
            <strong>{value}</strong>
          </article>
        ))}
      </div>

      <div className="portal-grid-2">
        <section className="card">
          <h3>Recent Incidents</h3>
          {recent.length > 0 ? (
            recent.map((item) => (
              <div key={item.id} className="list-row">
                <span>{item.location}</span>
                <span>{item.status}</span>
              </div>
            ))
          ) : (
            <p>No incidents recorded.</p>
          )}
        </section>

        <section className="card">
          <h3>Daily Hazard Map Summary</h3>
          {hazardSummary.map((item) => (
            <div key={item.area} className="list-row">
              <span>{item.area}</span>
              <span>{item.risk}</span>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
