import { useEffect, useState } from 'react'
import { fetchActiveEarthquakeEvents, resolveEarthquakeEvent } from '../../services/earthquakeEventService'

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      setEvents(await fetchActiveEarthquakeEvents())
    } catch (loadError) {
      console.error('Failed to load earthquake events:', loadError)
      setEvents([])
      setError('Unable to load earthquake events.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <section className="portal-card" style={{ marginTop: 14 }}>
      <h3>Earthquake Events</h3>
      <p style={{ color: '#60758f' }}>Quezon City / nearby monitoring</p>
      <p style={{ color: '#60758f' }}>Displayed advisories support school monitoring. Follow official PAGASA, PHIVOLCS, LGU, and school DRRM instructions.</p>
      {isAdmin ? <p style={{ color: '#60758f', marginTop: 8 }}>Manual entry controls will be added in a follow-up PR.</p> : null}
      <p style={{ color: '#60758f', fontSize: 12 }}>School reference: {SCHOOL_LAT}, {SCHOOL_LON} · Radius: {DEFAULT_EARTHQUAKE_RADIUS_KM}km / Significant: {SIGNIFICANT_EARTHQUAKE_RADIUS_KM}km</p>
      {loading ? <p>Loading earthquake events...</p> : null}
      {!loading && error ? <p>{error}</p> : null}
      {!loading && !error && (!events.length ? <p>No active relevant earthquake events.</p> : events.map(item => (
        <div key={item.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
          <p><strong>M{item.magnitude ?? 'N/A'}</strong> · {item.location}</p>
          <p>Depth: {item.depth_km ?? 'N/A'} km · Time: {formatDateTime(item.event_time)}</p>
          <p>Distance: {item.distance_km ?? 'N/A'} km · Intensity: {item.intensity || 'N/A'}</p>
          {item.bulletin_url ? <p><a href={item.bulletin_url} target="_blank" rel="noreferrer">Bulletin link</a></p> : null}
          {isAdmin ? <button className="btn btn-outline btn-sm" onClick={() => resolveEarthquakeEvent(item.id).then(load)}>Resolve</button> : null}
        </div>
      )))}
      {/* TODO: Future Supabase Edge Function or Vercel Cron can sync PAGASA/PHIVOLCS feeds into these tables after official/stable endpoints are verified. */}
    </section>
  )
}
