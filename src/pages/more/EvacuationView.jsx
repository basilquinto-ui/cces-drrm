import { HAZARD_ICONS } from './moreData'

export default function EvacuationView({ routes }) {
  return (
    <>
      <div className="section-title" style={{ marginBottom: 14 }}>🗺️ Evacuation Routes</div>
      {routes.map((route) => (
        <div
          key={route.id}
          style={{ borderRadius: 'var(--radius-sm)', border: '2px solid var(--border)', padding: 14, marginBottom: 10, background: 'white' }}
        >
          <h4 style={{ fontSize: 14, fontWeight: 800, color: 'var(--navy)' }}>
            {HAZARD_ICONS[route.hazard_type] || '⚠️'} {route.hazard_type.charAt(0).toUpperCase() + route.hazard_type.slice(1)}
          </h4>
          <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {route.route_description.split('→').map((step, index, allSteps) => (
              <span key={index} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ background: 'var(--bg)', padding: '4px 10px', borderRadius: 20, fontWeight: 600, fontSize: 11 }}>
                  {step.trim()}
                </span>
                {index < allSteps.length - 1 && <span style={{ color: 'var(--navy)' }}>→</span>}
              </span>
            ))}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', marginTop: 8 }}>🟢 Assembly: {route.assembly_area}</div>
          {route.map_url && (
            <a
              href={route.map_url}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 12, fontWeight: 700, color: 'var(--navy)', display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10 }}
            >
              📍 Open in Google Maps
            </a>
          )}
        </div>
      ))}
    </>
  )
}
