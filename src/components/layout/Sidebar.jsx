const NAV_ITEMS = [
  ['dashboard', 'Dashboard'],
  ['alerts', 'Alerts'],
  ['incidents', 'Incidents'],
  ['checkin', 'Check-ins'],
  ['resources', 'Resources'],
  ['routes', 'Evacuation Routes'],
  ['drills', 'Drills'],
  ['admin', 'Admin'],
  ['settings', 'About / Settings'],
]

export default function Sidebar({ active, onChange, isAdmin, collapsed }) {
  return (
    <aside className={`portal-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">CCES DRRM Portal</div>
      <nav>
        {NAV_ITEMS.map(([key, label]) => {
          if (key === 'admin' && !isAdmin) return null

          return (
            <button
              key={key}
              className={`side-link ${active === key ? 'active' : ''}`}
              onClick={() => onChange(key)}
            >
              {label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
