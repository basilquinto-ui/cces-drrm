import { useState, useEffect } from 'react'
import { ToastProvider } from './components/Toast'
import Splash from './components/Splash'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Alerts from './pages/Alerts'
import Incidents from './pages/Incidents'
import CheckIn from './pages/CheckIn'
import More from './pages/More'
import Login from './pages/Login'
import { fetchWeather } from './lib/weather'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const { user, loading: authLoading, signIn, isAdmin } = useAuth()
  const [splash, setSplash] = useState(true)
  const [tab, setTab] = useState('home')
  const [weather, setWeather] = useState({ type: 'sunny', loading: true })
  const [signal, setSignal] = useState(0)
  const [status, setStatus] = useState('normal')

  useEffect(() => {
    setTimeout(() => setSplash(false), 4500)
    loadWeather()
    const interval = setInterval(loadWeather, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  async function loadWeather() {
    const data = await fetchWeather()
    setWeather({ ...data, loading: false })
  }

  async function handleLogin(email, password) {
    const { error } = await signIn(email, password)
    return error || null
  }

  // Show splash first
  if (splash) return <ToastProvider><Splash visible={true} /></ToastProvider>

  // Still checking auth state
  if (authLoading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1923' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.1)', borderTop: '3px solid #E8A020', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  )

  // Not logged in — show login screen
  if (!user) return (
    <ToastProvider>
      <Login onLogin={handleLogin} />
    </ToastProvider>
  )

  // Logged in — show full app
  const pages = {
    home: <Home weather={weather} signal={signal} onSignalChange={setSignal} onTabChange={setTab} status={status} onStatusChange={setStatus} />,
    alerts: <Alerts isAdmin={isAdmin} onStatusChange={setStatus} />,
    incidents: <Incidents isAdmin={isAdmin} />,
    checkin: <CheckIn isAdmin={isAdmin} />,
    more: <More onStatusChange={setStatus} onSignalChange={setSignal} />,
  }

  return (
    <ToastProvider>
      <div className="app">
        <Header weather={weather} status={status} />
        <div className="content">
          {pages[tab]}
        </div>
        <BottomNav active={tab} onChange={setTab} />
      </div>
    </ToastProvider>
  )
}
