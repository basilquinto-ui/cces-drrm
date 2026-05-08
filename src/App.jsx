import { useState, useEffect } from 'react'
import { ToastProvider, useToast } from './components/Toast'
import Splash from './components/Splash'
import Login from './pages/Login'
import Alerts from './pages/Alerts'
import Incidents from './pages/Incidents'
import CheckIn from './pages/CheckIn'
import Dashboard from './pages/Dashboard'
import Resources from './pages/Resources'
import EvacuationRoutes from './pages/EvacuationRoutes'
import Drills from './pages/Drills'
import Admin from './pages/Admin'
import AboutView from './pages/more/AboutView'
import AppShell from './components/layout/AppShell'
import { fetchWeather } from './lib/weather'
import { useAuth } from './hooks/useAuth'
import { fetchResources, fetchRoutes, fetchDrills, fetchStaff, updateResource, resetTodayCheckins } from './services/moreService'

function AppInner() {
  const { user, role, loading: authLoading, signIn, signOut, isAdmin } = useAuth()
  const toast = useToast()
  const [splash, setSplash] = useState(true)
  const [tab, setTab] = useState('dashboard')
  const [weather, setWeather] = useState({ type: 'sunny', loading: true })
  const [signal, setSignal] = useState(0)
  const [status, setStatus] = useState('normal')
  const [data, setData] = useState({ resources: [], routes: [], drills: [], staff: [], editRes: null })

  useEffect(() => { setTimeout(() => setSplash(false), 2000); loadWeather() }, [])
  useEffect(() => { if (tab === 'resources') fetchResources().then(r => setData(v => ({ ...v, resources: r.data || [] }))); if (tab === 'routes') fetchRoutes().then(r => setData(v => ({ ...v, routes: r.data || [] }))); if (tab === 'drills') fetchDrills().then(r => setData(v => ({ ...v, drills: r.data || [] }))); if (tab === 'admin' && isAdmin) fetchStaff().then(r => setData(v => ({ ...v, staff: r.data || [] }))) }, [tab, isAdmin])
  async function loadWeather() { const w = await fetchWeather(); setWeather({ ...w, loading: false }) }
  async function saveResource() { const e = data.editRes; if (!e) return; await updateResource(e.id, { quantity: parseInt(document.getElementById('editQty')?.value ?? e.quantity), condition: document.getElementById('editCond')?.value ?? e.condition, location: document.getElementById('editLoc')?.value ?? e.location, last_checked: new Date().toISOString().split('T')[0] }); toast('Resource updated', 'success'); setData(v => ({ ...v, editRes: null })); const r = await fetchResources(); setData(v => ({ ...v, resources: r.data || [] })) }
  async function handleLogin(email, password) { const { error } = await signIn(email, password); return error || null }
  if (splash) return <Splash visible />
  if (authLoading) return <div className="loading-screen">Loading...</div>
  if (!user) return <Login onLogin={handleLogin} />
  const pages = {
    dashboard: <Dashboard weather={weather} signal={signal} isAdmin={isAdmin} onNavigate={setTab} />,
    alerts: <Alerts isAdmin={isAdmin} onStatusChange={setStatus} />, incidents: <Incidents isAdmin={isAdmin} />, checkin: <CheckIn isAdmin={isAdmin} />,
    resources: <Resources resources={data.resources} isAdmin={isAdmin} editRes={data.editRes} onEdit={(editRes) => setData(v => ({ ...v, editRes }))} onCloseEdit={() => setData(v => ({ ...v, editRes: null }))} onSaveEdit={saveResource} />,
    routes: <EvacuationRoutes routes={data.routes} />, drills: <Drills drills={data.drills} />,
    admin: <Admin isAdmin={isAdmin} user={user} role={role} staff={data.staff} onResetCheckins={async () => { const today = new Date().toISOString().split('T')[0]; await resetTodayCheckins(today); toast('Check-ins reset', 'success') }} onStatusChange={setStatus} onSignalChange={setSignal} toast={toast} onSignOut={signOut} />,
    settings: <AboutView />,
  }
  return <AppShell active={tab} onNavigate={setTab} role={role} status={status} isAdmin={isAdmin}>{pages[tab] || pages.dashboard}</AppShell>
}

export default function App() { return <ToastProvider><AppInner /></ToastProvider> }
