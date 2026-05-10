import { useEffect, useState } from 'react'
import { ToastProvider } from './components/Toast'
import Splash from './components/Splash'
import Login from './pages/Login'
import Alerts from './pages/Alerts'
import Incidents from './pages/Incidents'
import CheckIn from './pages/CheckIn'
import Dashboard from './pages/Dashboard'
import WeatherRisk from './pages/WeatherRisk'
import Resources from './pages/Resources'
import EvacuationRoutes from './pages/EvacuationRoutes'
import Drills from './pages/Drills'
import Admin from './pages/Admin'
import Settings from './pages/Settings'
import StaffProfiles from './pages/StaffProfiles'
import AppShell from './components/layout/AppShell'
import { fetchWeather } from './lib/weather'
import { useAuth } from './hooks/useAuth'
import PublicLanding from './pages/PublicLanding'

function PortalApp() {
  const { user, role, loading: authLoading, signIn, signOut, isAdmin } = useAuth()
  const [splash, setSplash] = useState(true)
  const [tab, setTab] = useState('dashboard')
  const [weather, setWeather] = useState({ type: 'sunny', loading: true })
  const [signal, setSignal] = useState(0)
  const [status, setStatus] = useState('normal')
  const [menuOpen, setMenuOpen] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 4000)
    loadWeather()
    const interval = setInterval(loadWeather, 10 * 60 * 1000)
    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  async function loadWeather() {
    const data = await fetchWeather()
    setWeather({ ...data, loading: false })
  }

  async function handleLogin(email, password) {
    const { error } = await signIn(email, password)
    return error || null
  }

  if (splash || authLoading) return <ToastProvider><Splash visible /></ToastProvider>
  if (!user) return <ToastProvider><Login onLogin={handleLogin} /></ToastProvider>

  const sharedProps = { user, role, isAdmin, signOut, onStatusChange: setStatus, onSignalChange: setSignal }
  const pages = {
    dashboard: <Dashboard weather={weather} signal={signal} status={status} />,
    weatherRisk: <WeatherRisk weather={weather} signal={signal} status={status} onRefreshWeather={loadWeather} />,
    alerts: <Alerts isAdmin={isAdmin} user={user} onStatusChange={setStatus} />,
    incidents: <Incidents isAdmin={isAdmin} />,
    checkin: <CheckIn isAdmin={isAdmin} />,
    resources: <Resources {...sharedProps} />,
    routes: <EvacuationRoutes {...sharedProps} />,
    drills: <Drills {...sharedProps} />,
    admin: <Admin {...sharedProps} />,
    staffProfiles: <StaffProfiles isAdmin={isAdmin} />,
    settings: <Settings {...sharedProps} />,
  }

  return <ToastProvider><AppShell activeTab={tab} onTabChange={setTab} isAdmin={isAdmin} role={role} status={status} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(prev => !prev)}>{pages[tab]}</AppShell></ToastProvider>
}

export default function App() {
  const isPortalRoute = window.location.pathname.startsWith('/portal')
  return isPortalRoute ? <PortalApp /> : <PublicLanding />
}
