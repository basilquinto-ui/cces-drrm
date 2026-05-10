import { useEffect, useMemo, useState } from 'react'
import { fetchWeather } from '../lib/weather'
import { fetchPublicSafetyUpdates } from '../services/publicSafetyUpdateService'

const fallbackUpdates = [
  { title: 'Earthquake Drill Notice', category: 'drill', severity: 'info', message: 'Quarterly earthquake drill is scheduled this week. Please review classroom safety reminders.', source: 'school_drrm', created_at: new Date().toISOString() },
  { title: 'Typhoon Advisory', category: 'weather', severity: 'monitoring', message: 'School DRRM personnel are monitoring weather bulletins and local advisories.', source: 'school_drrm', created_at: new Date().toISOString() },
  { title: 'Heat Index Reminder', category: 'health', severity: 'warning', message: 'Bring water and avoid prolonged exposure under direct sunlight during peak hours.', source: 'school_clinic', created_at: new Date().toISOString() },
  { title: 'Dengue Prevention Reminder', category: 'health', severity: 'info', message: 'Clean-up drives continue weekly. Remove stagnant water and report mosquito breeding areas.', source: 'school_drrm', created_at: new Date().toISOString() },
  { title: 'Gate/Pathway Closure Notice', category: 'facility', severity: 'monitoring', message: 'One pathway is temporarily closed for maintenance. Follow posted rerouting signs.', source: 'school_admin', created_at: new Date().toISOString() },
]

export default function PublicLanding() {
  const [updates, setUpdates] = useState([])
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    fetchPublicSafetyUpdates().then(setUpdates).catch(() => setUpdates([]))
    fetchWeather().then(setWeather).catch(() => setWeather(null))
  }, [])

  const visibleUpdates = useMemo(() => (updates.length ? updates : fallbackUpdates), [updates])

  return (
    <div className="public-page">
      <header className="public-header">
        <h1>Camp Crame Elementary School DRRM</h1>
        <nav className="public-nav">
          <a href="#home">Home</a><a href="#about">About SDRRM</a><a href="#safety">Safety Guidelines</a><a href="#contacts">Emergency Contacts</a><a href="#announcements">Announcements</a><a href="/portal">Login</a>
        </nav>
      </header>
      <section id="home" className="public-hero public-section">
        <h2>SchoolSafe DRRM: Hazard Reporting and Disaster Preparedness System</h2>
        <p>A school-based platform for reporting hazards, monitoring safety concerns, and supporting disaster preparedness activities.</p>
        <div className="public-actions"><a className="btn btn-primary" href="/portal">Login to Report Hazard</a><a className="btn btn-outline" href="#safety">View Safety Guidelines</a></div>
      </section>
      <section id="about" className="public-section"><h3>About the System</h3><p>This system helps the school monitor hazards, manage safety reports, document preparedness activities, and provide emergency information to teachers, learners, parents, and school personnel.</p></section>
      <section className="public-section"><h3>What the System Supports</h3><div className="public-card-grid">{['Hazard Reporting','Incident Monitoring','Emergency Preparedness','Drill Documentation','Safety Announcements','Emergency Contact Access'].map((x)=><article key={x} className="card"><h4>{x}</h4></article>)}</div></section>
      <section id="announcements" className="public-section"><h3>Emergency Announcements</h3><div className="public-card-grid">{visibleUpdates.map((u,idx)=><article key={u.id||idx} className="public-update-card"><h4>{u.title}</h4><p><strong>Category:</strong> {u.category}</p><p><strong>Severity:</strong> {u.severity}</p><p>{u.message}</p><p><strong>Source:</strong> {u.source}</p><p><strong>Date/Time:</strong> {new Date(u.starts_at || u.created_at).toLocaleString()}</p></article>)}</div></section>
      {weather && <section className="public-section"><h3>Weather Monitoring</h3><article className="card"><p><strong>Current:</strong> {weather.description} {weather.temp !== null ? `• ${weather.temp}°C` : ''}</p><p><strong>Risk Level:</strong> {weather.riskLevel}</p><p>Weather data supports monitoring only. Follow official PAGASA, LGU, and school DRRM advisories.</p></article></section>}
      <section id="contacts" className="public-section"><h3>Emergency Contacts</h3><div className="public-card-grid">{[
        ['School office','(02) 0000-0000','office@school.edu'],['School DRRM coordinator','0917-000-0001','drrm@school.edu'],['Clinic/Nurse','0917-000-0002','clinic@school.edu'],['Barangay emergency hotline','911 / 8-000-0000','barangay@example.gov.ph'],['BFP','160 / 8-426-0219','bfp@example.gov.ph'],['PNP','117 / 8-723-0401','pnp@example.gov.ph'],['CDRRMO/MDRRMO','8-000-0010','cdrrmo@example.gov.ph'],['Nearest hospital','8-000-0020','hospital@example.org']
      ].map(([name,phone,email])=><article key={name} className="public-contact-card"><h4>{name}</h4><p>Configurable static content</p><a href={`tel:${phone}`}>Call</a> <a href={`mailto:${email}`}>Email</a> <a href="#">View Location</a></article>)}</div></section>
      <section id="safety" className="public-section"><h3>Safety Guidelines</h3><div className="public-card-grid">{[
        ['Earthquake Safety',['Drop, Cover, and Hold','Stay away from windows','Do not run while shaking is ongoing','Evacuate only when instructed']],['Fire Safety',['Stay calm and follow exit signs','Do not use elevators','Assist younger learners responsibly']],['Typhoon Preparedness',['Monitor official advisories','Secure loose materials','Prepare emergency kits']],['Flood Safety',['Avoid flooded pathways','Move to higher ground when instructed','Keep emergency contacts ready']],['Heat Index Safety',['Hydrate frequently','Limit outdoor exposure','Watch for heat stress symptoms']],['Dengue Prevention',['Remove stagnant water','Use protective clothing','Report mosquito-prone areas']],['First Aid Basics',['Report injuries immediately','Use clean first aid materials','Await clinic guidance']],['Evacuation Reminders',['Follow teacher instructions','Proceed to assigned assembly points','Wait for official clearance']]
      ].map(([title,items])=><article key={title} className="public-guideline-card"><h4>{title}</h4><ul>{items.map((it)=><li key={it}>{it}</li>)}</ul></article>)}</div></section>
      <section className="public-section"><h3>Evacuation Information</h3><p>Evacuation routes and assembly areas are posted in classrooms and school corridors. Follow the instructions of teachers and designated safety personnel during emergencies.</p></section>
      <section className="public-section"><h3>Preparedness Activities</h3><div className="public-card-grid">{['Fire drills','Earthquake drills','Safety inspections','Clean-up drives','Dengue prevention campaigns','First aid orientation','Emergency response training'].map((x)=><article key={x} className="card"><h4>{x}</h4></article>)}</div></section>
      <section className="public-section"><h3>Public Report Summary</h3><div className="public-card-grid"><article className="card"><h4>Hazards Reported</h4><p>48 this school year</p></article><article className="card"><h4>Resolved</h4><p>31</p></article><article className="card"><h4>Ongoing</h4><p>9</p></article><article className="card"><h4>Under Review</h4><p>8</p></article></div><p>Updated by school DRRM personnel.</p></section>
      <section className="public-section"><h3>FAQ</h3><div className="public-card-grid">{[
        ['Who can report hazards?','Teachers and authorized school personnel can report hazards using their account.'],['Can students report hazards?','Students may report concerns to their adviser, class officer, or SDRRM coordinator.'],['What is considered a hazard?','A hazard is any condition that may cause injury, damage, illness, or disruption inside the school.'],['Who reviews reports?','The SDRRM coordinator and authorized school personnel review submitted reports.'],['Are reports confidential?','Internal reports are only visible to authorized users.']
      ].map(([q,a])=><article key={q} className="card"><h4>{q}</h4><p>{a}</p></article>)}</div></section>
      <footer className="public-footer"><p>Camp Crame Elementary School • [Configurable Address] • [Configurable Contact Number]</p><p>Email: [Configurable Email] • <a href="#">Facebook Page</a> • <a href="/portal">Login</a></p><p>Privacy notice: Information on this page is for public awareness only. Terms and data usage are managed by the school.</p></footer>
    </div>
  )
}
