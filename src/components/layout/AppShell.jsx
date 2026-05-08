import { useState } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AppShell({ active, onNavigate, role, status, isAdmin, children }) {
  const [collapsed, setCollapsed] = useState(false)
  return <div className="portal-shell"><Sidebar active={active} onChange={onNavigate} isAdmin={isAdmin} collapsed={collapsed} /><main className="portal-main"><TopBar role={role} status={status} onToggleNav={() => setCollapsed(v => !v)} />{children}</main></div>
}
