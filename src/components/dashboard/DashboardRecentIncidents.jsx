import { formatDateTime, formatLabel } from './dashboardUtils'

export default function DashboardRecentIncidents({ incidents }) {
  return (
    <section className="portal-card" style={{ marginTop: 16 }}>
      <h3>Recent Incidents</h3>
      {incidents.length === 0 ? (
        <p>No recent incidents recorded.</p>
      ) : (
        incidents.map((incident) => (
          <div key={incident.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
            <p><strong>Hazard:</strong> {formatLabel(incident.hazard_type)}</p>
            <p><strong>Location:</strong> {incident.location || 'Unknown'}</p>
            <p><strong>Severity:</strong> {formatLabel(incident.severity)}</p>
            <p><strong>Status:</strong> {formatLabel(incident.status)}</p>
            <p><strong>Date:</strong> {formatDateTime(incident.created_at)}</p>
            <p><strong>Reported by:</strong> {incident.reported_by || 'Unknown'}</p>
          </div>
        ))
      )}
    </section>
  )
}
