export default function DashboardStats({ summary }) {
  return (
    <>
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
    </>
  )
}
