import { MenuIcon } from '../icons/PortalIcons'

const statusLabels = { normal: 'Normal', watch: 'Watch', alert: 'Alert' }

export default function TopBar({ role, status, onToggleMenu }) {
  return (
    <header className="portal-topbar">
      <div>
        <h1>CCES DRRM Command Center</h1>
        <p>Camp Crame Elementary School</p>
      </div>
      <div className="topbar-meta">
        <span className="badge">Role: {role || 'User'}</span>
        <span className={`status-badge status-${status}`}>Status: {statusLabels[status] || 'Normal'}</span>
        <button className="menu-btn" onClick={onToggleMenu} aria-label="Toggle menu">
          <MenuIcon />
        </button>
      </div>
    </header>
  )
}
