import { useEffect, useState } from 'react'
import DashboardRecentIncidents from '../components/dashboard/DashboardRecentIncidents'
import DashboardSafetySummary from '../components/dashboard/DashboardSafetySummary'
import DashboardStats from '../components/dashboard/DashboardStats'
import DashboardStatusSummary from '../components/dashboard/DashboardStatusSummary'
import DashboardWeatherSummary from '../components/dashboard/DashboardWeatherSummary'
import PageHeader from '../components/layout/PageHeader'
import { fetchDashboardSummary } from '../services/dashboardService'

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
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="fade-in">
      <PageHeader title="Dashboard" description="Operational snapshot for school safety and readiness." />

      {loading && <section className="portal-card"><p>Loading operational dashboard data...</p></section>}
      {!loading && error && <section className="portal-card"><p>Unable to load dashboard metrics: {error}</p></section>}

      <div className="dashboard-grid">
        <DashboardStatusSummary status={status} signal={signal} />
        <DashboardWeatherSummary weather={weather} />
        <DashboardStats summary={summary} />
        <DashboardSafetySummary />
      </div>

      <DashboardRecentIncidents incidents={summary.recentIncidents} />
    </div>
  )
}
