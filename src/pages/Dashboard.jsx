import PageHeader from '../components/layout/PageHeader'

export default function Dashboard({ weather, signal, status }) {
  const safeWeather = weather?.condition || 'No weather data loaded yet.'
  return (
    <div className="fade-in">
      <PageHeader title="Dashboard" description="Operational snapshot for school safety and readiness." />
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
        <section className="portal-card"><h3>Active Alerts</h3><p>Summary placeholder for active school alerts.</p></section>
        <section className="portal-card"><h3>Open Incidents</h3><p>Summary placeholder for unresolved incidents.</p></section>
        <section className="portal-card"><h3>Staff Check-ins</h3><p>Summary placeholder for daily attendance check-ins.</p></section>
        <section className="portal-card"><h3>Daily Hazard Map</h3><p>Static campus risk overview placeholder.</p></section>
      </div>
      <section className="portal-card" style={{ marginTop: 16 }}>
        <h3>Recent Incidents</h3>
        <p>Recent incident feed placeholder for a future enhancement.</p>
      </section>
    </div>
  )
}
