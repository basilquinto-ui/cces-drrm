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
import { fetchWeather } from './lib/weather'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const { isAdmin } = useAuth()
  const [splash, setSplash] = useState(true)
  const [tab, setTab] = useState('home')
  const [weather, setWeather] = useState({ type: 'sunny', loading: true })
  const [signal, setSignal] = useState(0)
  const [status, setStatus] = useState('normal')

  useEffect(() => {
    // Hide splash after 2.5s
    setTimeout(() => setSplash(false), 2500)
    // Load weather
    loadWeather()
    // Refresh every 10 min
    const interval = setInterval(loadWeather, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  async function loadWeather() {
    const data = await fetchWeather()
    setWeather({ ...data, loading: false })
  }

  const pages = {
    home: <Home weather={weather} signal={signal} onSignalChange={setSignal} onTabChange={setTab} status={status} onStatusChange={setStatus} />,
    alerts: <Alerts isAdmin={isAdmin} onStatusChange={setStatus} />,
    incidents: <Incidents isAdmin={isAdmin} />,
    checkin: <CheckIn isAdmin={isAdmin} />,
    more: <More onStatusChange={setStatus} onSignalChange={setSignal} />,
  }

  return (
    <ToastProvider>
      <Splash visible={splash} />
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
