import { useEffect, useState } from 'react'
import { fetchActiveOfficialAdvisories, resolveOfficialAdvisory } from '../../services/officialAdvisoryService'

function formatDateTime(value) {
  if (!value) return 'N/A'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleString('en-PH')
}

export default function OfficialAdvisoryPanel({ isAdmin = false }) {
  const [advisories, setAdvisories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
      {isAdmin ? <p style={{ color: '#60758f', marginTop: 8 }}>Manual entry controls will be added in a follow-up PR.</p> : null}
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
