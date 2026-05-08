import AdminPanel from './more/AdminPanel'
export default function Admin({ isAdmin, user, role, staff, onResetCheckins, onStatusChange, onSignalChange, toast, onSignOut }) {
  return <AdminPanel isAdmin={isAdmin} user={user} role={role} staff={staff} onResetCheckins={onResetCheckins} onStatusChange={onStatusChange} onSignalChange={onSignalChange} toast={toast} onSignOut={onSignOut} />
}
