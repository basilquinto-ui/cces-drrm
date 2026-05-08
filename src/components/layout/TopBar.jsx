export default function TopBar({ role, status, onToggleNav }) {
  return (
    <header className="portal-topbar">
      <button className="menu-toggle" onClick={onToggleNav}>Menu</button>
      <div>
        <h1>Command Center</h1>
        <p>
          Role: {role} · School Safety Status: {status.toUpperCase()}
        </p>
      </div>
    </header>
  )
}
