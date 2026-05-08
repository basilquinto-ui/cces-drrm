import { Bell, ClipboardList, Home, LayoutGrid, ShieldCheck } from 'lucide-react'

export default function BottomNav({ active, onChange }) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
    { id: 'incidents', icon: ClipboardList, label: 'Incidents' },
    { id: 'checkin', icon: ShieldCheck, label: 'Check-in' },
    { id: 'more', icon: LayoutGrid, label: 'More' },
  ]

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <button key={tab.id} className={`nav-item ${active === tab.id ? 'active' : ''}`} onClick={() => onChange(tab.id)}>
            <span className="nav-icon"><Icon size={16} /></span>
            <span className="nav-label">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
