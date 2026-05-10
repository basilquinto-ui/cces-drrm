import { useEffect, useState } from 'react'
import { createEarthquakeEvent, fetchActiveEarthquakeEvents, resolveEarthquakeEvent } from '../../services/earthquakeEventService'

const SCHOOL_LAT = 14.676
const SCHOOL_LON = 121.0437
const DEFAULT_EARTHQUAKE_RADIUS_KM = 150
const SIGNIFICANT_EARTHQUAKE_RADIUS_KM = 300

function formatDateTime(value) {
  if (!value) return 'N/A'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleString('en-PH')
}

export default function EarthquakePanel({ isAdmin = false }) {
  const [events, setEvents] = useState([])

  async function load() { setEvents(await fetchActiveEarthquakeEvents()) }
  useEffect(() => { load() }, [])

  async function handleAddSample() {
    await createEarthquakeEvent({
      event_time: new Date().toISOString(),
      magnitude: 4.2, depth_km: 12, location: 'Near Metro Manila',
      distance_km: DEFAULT_EARTHQUAKE_RADIUS_KM, relevance_scope: 'quezon_city',
      is_relevant_to_school: true, source: 'manual',
      raw_payload: { school: { lat: SCHOOL_LAT, lon: SCHOOL_LON }, radius_km: DEFAULT_EARTHQUAKE_RADIUS_KM, significant_radius_km: SIGNIFICANT_EARTHQUAKE_RADIUS_KM },
    })
    await load()
  }

  return (
    <section className="portal-card" style={{ marginTop: 14 }}>
      <h3>Earthquake Events</h3>
      <p style={{ color: '#60758f' }}>Quezon City / nearby monitoring</p>
      <p style={{ color: '#60758f' }}>Displayed advisories support school monitoring. Follow official PAGASA, PHIVOLCS, LGU, and school DRRM instructions.</p>
      {isAdmin ? <div style={{ margin: '8px 0' }}><button className="btn btn-outline btn-sm" onClick={handleAddSample}>Create event</button></div> : null}
      {!events.length ? <p>No active relevant earthquake events.</p> : events.map(item => (
        <div key={item.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
          <p><strong>M{item.magnitude ?? 'N/A'}</strong> · {item.location}</p>
          <p>Depth: {item.depth_km ?? 'N/A'} km · Time: {formatDateTime(item.event_time)}</p>
          <p>Distance: {item.distance_km ?? 'N/A'} km · Intensity: {item.intensity || 'N/A'}</p>
          {item.bulletin_url ? <p><a href={item.bulletin_url} target="_blank" rel="noreferrer">Bulletin link</a></p> : null}
          {isAdmin ? <button className="btn btn-outline btn-sm" onClick={() => resolveEarthquakeEvent(item.id).then(load)}>Resolve</button> : null}
        </div>
      ))}
      {/* TODO: Future Supabase Edge Function or Vercel Cron can sync PAGASA/PHIVOLCS feeds into these tables after official/stable endpoints are verified. */}
    </section>
  )
}
