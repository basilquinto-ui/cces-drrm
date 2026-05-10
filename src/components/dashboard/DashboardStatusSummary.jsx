export default function DashboardStatusSummary({ status, signal }) {
  return (
    <section className="portal-card">
      <h3>School Safety Status</h3>
      <p className={`status-badge status-${status}`}>{status?.toUpperCase() || 'NORMAL'}</p>
      <p>Current signal level: {signal}</p>
    </section>
  )
}
