export default function BottomNav({ active, onChange }) {
  const tabs = [
    { id: 'home', icon: '🏠', label: 'Home' },
    { id: 'alerts', icon: '🚨', label: 'Alerts' },
    { id: 'incidents', icon: '📋', label: 'Incidents' },
    { id: 'checkin', icon: '✅', label: 'Check-in' },
    { id: 'more', icon: '⚙️', label: 'More' },
  ]
  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <button key={t.id} className={`nav-item ${active === t.id ? 'active' : ''}`} onClick={() => onChange(t.id)}>
          <span className="nav-icon">{t.icon}</span>
          <span className="nav-label">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
