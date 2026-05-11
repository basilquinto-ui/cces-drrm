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

const cleanUrlOrNull = (value) => {
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.startsWith('http://') || trimmed.startsWith('https://') ? trimmed : null
}

export default function EarthquakePanel({ isAdmin = false }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    bulletin_title: '', location: '', event_time: '', magnitude: '', depth_km: '', latitude: '', longitude: '',
    intensity: '', distance_km: '', bulletin_url: '', source: 'phivolcs', published_publicly: false,
    is_relevant_to_school: true, relevance_scope: 'quezon_city'
  })

  function onChange(event) {
    const { name, value, type, checked } = event.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function onSubmit(event) {
    event.preventDefault()
    setFormMessage('')
    setFormError('')
    if (!formData.location.trim() || !formData.event_time) {
      setFormError('Location and event time are required.')
      return
    }
    const asNumberOrNull = (value) => {
      if (value === '') return null
      const number = Number(value)
      return Number.isFinite(number) ? number : null
    }
    const payload = {
      ...formData,
      location: formData.location.trim(),
      bulletin_title: formData.bulletin_title.trim() || null,
      event_time: formData.event_time,
      magnitude: asNumberOrNull(formData.magnitude),
      depth_km: asNumberOrNull(formData.depth_km),
      latitude: asNumberOrNull(formData.latitude),
      longitude: asNumberOrNull(formData.longitude),
      distance_km: asNumberOrNull(formData.distance_km),
      intensity: formData.intensity.trim() || null,
      bulletin_url: cleanUrlOrNull(formData.bulletin_url)
    }

    setSubmitting(true)
    try {
      await createEarthquakeEvent(payload)
      await load()
      setFormData({
        bulletin_title: '', location: '', event_time: '', magnitude: '', depth_km: '', latitude: '', longitude: '',
        intensity: '', distance_km: '', bulletin_url: '', source: 'phivolcs', published_publicly: false,
        is_relevant_to_school: true, relevance_scope: 'quezon_city'
      })
      setFormMessage('Earthquake event added successfully.')
    } catch (submitError) {
      console.error('Failed to create earthquake event:', submitError)
      setFormError('Unable to save earthquake event.')
    } finally {
      setSubmitting(false)
    }
  }

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
      {isAdmin ? (
        <form onSubmit={onSubmit} style={{ marginTop: 8, display: 'grid', gap: 8 }}>
          <input className="form-control" name="bulletin_title" placeholder="Bulletin title" value={formData.bulletin_title} onChange={onChange} />
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <input className="form-control" name="location" placeholder="Location" value={formData.location} onChange={onChange} />
            <input className="form-control" type="datetime-local" name="event_time" value={formData.event_time} onChange={onChange} />
            <input className="form-control" type="number" step="any" name="magnitude" placeholder="Magnitude" value={formData.magnitude} onChange={onChange} />
            <input className="form-control" type="number" step="any" name="depth_km" placeholder="Depth (km)" value={formData.depth_km} onChange={onChange} />
            <input className="form-control" type="number" step="any" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={onChange} />
            <input className="form-control" type="number" step="any" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={onChange} />
            <input className="form-control" name="intensity" placeholder="Intensity" value={formData.intensity} onChange={onChange} />
            <input className="form-control" type="number" step="any" name="distance_km" placeholder="Distance (km)" value={formData.distance_km} onChange={onChange} />
            <input className="form-control" name="bulletin_url" placeholder="Bulletin URL" value={formData.bulletin_url} onChange={onChange} />
            <select className="form-control" name="source" value={formData.source} onChange={onChange}><option value="phivolcs">phivolcs</option><option value="manual">manual</option><option value="school_drrm">school_drrm</option></select>
            <select className="form-control" name="relevance_scope" value={formData.relevance_scope} onChange={onChange}><option value="quezon_city">quezon_city</option><option value="camp_crame">camp_crame</option><option value="ncr">ncr</option></select>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <label><input type="checkbox" name="published_publicly" checked={formData.published_publicly} onChange={onChange} /> published_publicly</label>
            <label><input type="checkbox" name="is_relevant_to_school" checked={formData.is_relevant_to_school} onChange={onChange} /> is_relevant_to_school</label>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-sm" disabled={submitting} type="submit">{submitting ? 'Saving...' : 'Add Earthquake Event'}</button>
            {formMessage ? <span>{formMessage}</span> : null}
            {formError ? <span>{formError}</span> : null}
          </div>
        </form>
      ) : null}
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
