import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AppShell({ children, activeTab, onTabChange, isAdmin, role, status, menuOpen, onToggleMenu }) {
  return (
    <div className="portal-shell">
      <Sidebar activeTab={activeTab} onChange={onTabChange} isAdmin={isAdmin} collapsed={!menuOpen} />
      <div className="portal-main">
        <TopBar role={role} status={status} onToggleMenu={onToggleMenu} />
        <main className="portal-content">{children}</main>
      </div>
    </div>
  )
}
