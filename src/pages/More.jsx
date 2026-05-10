import { useState, useEffect } from 'react'
import { useToast } from '../components/Toast'
import MoreMenu from './more/MoreMenu'
import AdminPanel from './more/AdminPanel'
import ContactsView from './more/ContactsView'
import AboutView from './more/AboutView'
import ResourcesView from './more/ResourcesView'
import EvacuationView from './more/EvacuationView'
import DrillsView from './more/DrillsView'
import { fetchResources, fetchRoutes, fetchDrills, fetchStaff, updateResource, resetTodayCheckins } from '../services/moreService'

function BackButton({ onBack }) {
  return <button className="back-btn" onClick={onBack}>Back</button>
}

export default function More({ user, role, isAdmin, signOut, onStatusChange, onSignalChange, initialView = 'main' }) {
  const toast = useToast()
  const [view, setView] = useState(initialView)
  const [resources, setResources] = useState([])
  const [routes, setRoutes] = useState([])
  const [drills, setDrills] = useState([])
  const [staff, setStaff] = useState([])
  const [editRes, setEditRes] = useState(null)
  const [resourceForm, setResourceForm] = useState({ quantity: '', condition: 'good', location: '' })

  useEffect(() => {
    if (view === 'resources') loadData(fetchResources, setResources)
    if (view === 'evacuation') loadData(fetchRoutes, setRoutes)
    if (view === 'drills') loadData(fetchDrills, setDrills)
    if (view === 'admin' && isAdmin) loadData(fetchStaff, setStaff)
  }, [view, isAdmin])

  async function loadData(loader, setter) {
    const { data } = await loader()
    if (data) setter(data)
  }

  function handleEditResource(resource) {
    setEditRes(resource)
    setResourceForm({
      quantity: resource.quantity,
      condition: resource.condition,
      location: resource.location,
    })
  }

  async function resetCheckins() {
    const today = new Date().toISOString().split('T')[0]
    await resetTodayCheckins(today)
    toast('Check-ins reset.', 'success')
  }

  async function saveResource() {
    if (!editRes) return
    const payload = {
      quantity: parseInt(resourceForm.quantity, 10) || editRes.quantity,
      condition: resourceForm.condition || editRes.condition,
      location: resourceForm.location || editRes.location,
      last_checked: new Date().toISOString().split('T')[0],
    }

    await updateResource(editRes.id, payload)
    toast('Resource updated.', 'success')
    setEditRes(null)
    loadData(fetchResources, setResources)
  }

  if (view === 'main') {
    return <div className="fade-in"><MoreMenu isAdmin={isAdmin} onSelect={setView} /></div>
  }

  return (
    <div className="fade-in">
      <BackButton onBack={() => setView('main')} />

      {view === 'resources' && (
        <ResourcesView
          resources={resources}
          isAdmin={isAdmin}
          editRes={editRes}
          resourceForm={resourceForm}
          onEdit={handleEditResource}
          onCloseEdit={() => setEditRes(null)}
          onFormChange={setResourceForm}
          onSaveEdit={saveResource}
        />
      )}

      {view === 'evacuation' && <EvacuationView routes={routes} />}
      {view === 'contacts' && <ContactsView />}
      {view === 'drills' && <DrillsView drills={drills} />}

      {view === 'admin' && (
        <>
          <div className="section-title" style={{ marginBottom: 14 }}>Admin Panel</div>
          <AdminPanel
            isAdmin={isAdmin}
            user={user}
            role={role}
            staff={staff}
            onResetCheckins={resetCheckins}
            onStatusChange={onStatusChange}
            onSignalChange={onSignalChange}
            toast={toast}
            onSignOut={() => {
              signOut()
              toast('Logged out.')
            }}
          />
        </>
      )}

      {view === 'about' && <AboutView />}
    </div>
  )
}
