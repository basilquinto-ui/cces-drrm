import { useEffect, useState } from 'react'
import { createOfficialAdvisory, fetchActiveOfficialAdvisories, resolveOfficialAdvisory } from '../../services/officialAdvisoryService'

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

export default function OfficialAdvisoryPanel({ isAdmin = false }) {
  const [advisories, setAdvisories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '', message: '', advisory_type: 'general_weather', warning_level: 'monitoring', source: 'manual',
    affected_area: '', source_url: '', effective_at: '', expires_at: '', published_publicly: false,
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
    if (!formData.title.trim() || !formData.message.trim()) {
      setFormError('Title and message are required.')
      return
    }

    const payload = {
      ...formData,
      title: formData.title.trim(),
      message: formData.message.trim(),
      affected_area: formData.affected_area.trim() || null,
      source_url: cleanUrlOrNull(formData.source_url),
      effective_at: formData.effective_at || null,
      expires_at: formData.expires_at || null
    }

    setSubmitting(true)
    try {
      await createOfficialAdvisory(payload)
      await load()
      setFormData({
        title: '', message: '', advisory_type: 'general_weather', warning_level: 'monitoring', source: 'manual',
        affected_area: '', source_url: '', effective_at: '', expires_at: '', published_publicly: false,
        is_relevant_to_school: true, relevance_scope: 'quezon_city'
      })
      setFormMessage('Advisory added successfully.')
    } catch (submitError) {
      console.error('Failed to create advisory:', submitError)
      setFormError('Unable to save advisory.')
    } finally {
      setSubmitting(false)
    }
  }

  async function load() {
    setLoading(true)
    setError('')
    try {
      setAdvisories(await fetchActiveOfficialAdvisories())
    } catch (loadError) {
      console.error('Failed to load official advisories:', loadError)
      setAdvisories([])
      setError('Unable to load advisories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <section className="portal-card" style={{ marginTop: 14 }}>
      <h3>Official Advisories</h3>
      <p style={{ color: '#60758f' }}>Quezon City / nearby monitoring</p>
      <p style={{ color: '#60758f' }}>Displayed advisories support school monitoring. Follow official PAGASA, PHIVOLCS, LGU, and school DRRM instructions.</p>
      {isAdmin ? (
        <form onSubmit={onSubmit} style={{ marginTop: 8, display: 'grid', gap: 8 }}>
          <input className="form-control" name="title" placeholder="Title" value={formData.title} onChange={onChange} />
          <textarea className="form-control" name="message" placeholder="Message" rows={2} value={formData.message} onChange={onChange} />
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <select className="form-control" name="advisory_type" value={formData.advisory_type} onChange={onChange}><option value="typhoon">typhoon</option><option value="rainfall">rainfall</option><option value="thunderstorm">thunderstorm</option><option value="flood">flood</option><option value="heat_index">heat_index</option><option value="general_weather">general_weather</option></select>
            <select className="form-control" name="warning_level" value={formData.warning_level} onChange={onChange}><option value="none">none</option><option value="monitoring">monitoring</option><option value="yellow">yellow</option><option value="orange">orange</option><option value="red">red</option><option value="signal_1">signal_1</option><option value="signal_2">signal_2</option><option value="signal_3_plus">signal_3_plus</option></select>
            <select className="form-control" name="source" value={formData.source} onChange={onChange}><option value="pagasa">pagasa</option><option value="lgu">lgu</option><option value="school_drrm">school_drrm</option><option value="manual">manual</option></select>
            <select className="form-control" name="relevance_scope" value={formData.relevance_scope} onChange={onChange}><option value="quezon_city">quezon_city</option><option value="camp_crame">camp_crame</option><option value="ncr">ncr</option></select>
          </div>
          <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
            <input className="form-control" name="affected_area" placeholder="Affected area" value={formData.affected_area} onChange={onChange} />
            <input className="form-control" name="source_url" placeholder="Source URL" value={formData.source_url} onChange={onChange} />
            <input className="form-control" type="datetime-local" name="effective_at" value={formData.effective_at} onChange={onChange} />
            <input className="form-control" type="datetime-local" name="expires_at" value={formData.expires_at} onChange={onChange} />
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <label><input type="checkbox" name="published_publicly" checked={formData.published_publicly} onChange={onChange} /> published_publicly</label>
            <label><input type="checkbox" name="is_relevant_to_school" checked={formData.is_relevant_to_school} onChange={onChange} /> is_relevant_to_school</label>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-sm" disabled={submitting} type="submit">{submitting ? 'Saving...' : 'Add Advisory'}</button>
            {formMessage ? <span>{formMessage}</span> : null}
            {formError ? <span>{formError}</span> : null}
          </div>
        </form>
      ) : null}
      {loading ? <p>Loading advisories...</p> : null}
      {!loading && error ? <p>{error}</p> : null}
      {!loading && !error && (advisories.length === 0 ? <p>No active relevant advisories.</p> : advisories.map(item => (
        <div key={item.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
          <p><span className="status-badge">{item.source}</span> <span className="status-badge">{item.warning_level}</span></p>
          <p><strong>{item.title}</strong></p><p>{item.message}</p>
          <p><strong>Affected area:</strong> {item.affected_area || 'N/A'}</p>
          <p><strong>Effective:</strong> {formatDateTime(item.effective_at)}</p>
          {item.source_url ? <p><a href={item.source_url} target="_blank" rel="noreferrer">Source link</a></p> : null}
          {isAdmin ? <button className="btn btn-outline btn-sm" onClick={() => resolveOfficialAdvisory(item.id).then(load)}>Resolve</button> : null}
        </div>
      )))}
      {/* TODO: Future Supabase Edge Function or Vercel Cron can sync PAGASA/PHIVOLCS feeds into these tables after official/stable endpoints are verified. */}
    </section>
  )
}
