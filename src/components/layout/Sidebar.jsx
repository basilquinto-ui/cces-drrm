import {
  DashboardIcon, AlertIcon, IncidentIcon, CheckInIcon, ResourceIcon,
  RouteIcon, DrillIcon, AdminIcon, SettingsIcon
} from '../icons/PortalIcons'

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { key: 'alerts', label: 'Alerts', icon: AlertIcon },
  { key: 'incidents', label: 'Incidents', icon: IncidentIcon },
  { key: 'checkin', label: 'Check-ins', icon: CheckInIcon },
  { key: 'resources', label: 'Resources', icon: ResourceIcon },
  { key: 'routes', label: 'Evacuation Routes', icon: RouteIcon },
  { key: 'drills', label: 'Drills', icon: DrillIcon },
  { key: 'admin', label: 'Admin', icon: AdminIcon, adminOnly: true },
  { key: 'staffProfiles', label: 'Staff / Profiles', icon: AdminIcon, adminOnly: true },
  { key: 'settings', label: 'About / Settings', icon: SettingsIcon },
]

export default function Sidebar({ activeTab, onChange, isAdmin, collapsed }) {
  return (
    <aside className={`portal-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">CCES DRRM</div>
      <nav>
        {navItems.filter(item => !item.adminOnly || isAdmin).map(item => {
          const Icon = item.icon
          return (
            <button key={item.key} className={`side-link ${activeTab === item.key ? 'active' : ''}`} onClick={() => onChange(item.key)}>
              <Icon />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
