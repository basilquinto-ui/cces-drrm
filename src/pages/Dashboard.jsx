import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import PageHeader from '../components/layout/PageHeader'

export default function Dashboard({ weather, signal, isAdmin, onNavigate }) {
  const [stats, setStats] = useState({ alerts: 0, incidents: 0, checkins: 0 })
  const [recent, setRecent] = useState([])
  const [areas, setAreas] = useState([])

  useEffect(() => { (async () => {
    const today = new Date().toISOString().split('T')[0]
    const [{ count: alerts }, { count: incidents }, { count: checkins }, { data: recentInc }, { data: hazard }] = await Promise.all([
      supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('active', true),
      supabase.from('incidents').select('*', { count: 'exact', head: true }).neq('status', 'resolved'),
      supabase.from('checkins').select('*', { count: 'exact', head: true }).eq('date', today),
      supabase.from('incidents').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('hazard_areas').select('name,risk_level').order('name'),
    ])
    setStats({ alerts: alerts || 0, incidents: incidents || 0, checkins: checkins || 0 }); setRecent(recentInc || []); setAreas(hazard || [])
  })() }, [])

  return <div><PageHeader title="School Safety Dashboard" subtitle="Desktop command center overview" right={isAdmin ? <button className="btn btn-primary" onClick={()=>onNavigate('admin')}>Admin Actions</button> : null} />
    <div className="metric-grid">{[['Safety Status', stats.alerts ? 'Alert' : 'All Clear'], ['Weather / Signal', `${weather.label || weather.type} · Signal ${signal}`], ['Active Alerts', stats.alerts], ['Open Incidents', stats.incidents], ['Staff Checked In Today', stats.checkins]].map(([k,v]) => <article key={k} className="metric-card"><h4>{k}</h4><strong>{v}</strong></article>)}</div>
    <div className="portal-grid-2"><section className="card"><h3>Recent Incidents</h3>{recent.map(r => <div key={r.id} className="list-row"><span>{r.location}</span><span>{r.status}</span></div>)}{!recent.length && <p>No incidents recorded.</p>}</section>
    <section className="card"><h3>Daily Hazard Map Summary</h3>{areas.map(a => <div key={a.name} className="list-row"><span>{a.name}</span><span>{a.risk_level}</span></div>)}</section></div>
  </div>
}
