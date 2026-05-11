export default function BottomNav({ active, onChange }) {
  const tabs = [
    { id: 'home', icon: 'HM', label: 'Home' },
    { id: 'alerts', icon: 'AL', label: 'Alerts' },
    { id: 'incidents', icon: 'IN', label: 'Incidents' },
    { id: 'checkin', icon: 'CI', label: 'Check-in' },
    { id: 'more', icon: 'ST', label: 'More' },
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
