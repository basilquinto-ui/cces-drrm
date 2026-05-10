import PageHeader from '../components/layout/PageHeader'

const toRiskLevel = (risk) => {
  const value = String(risk || 'moderate').toLowerCase()
  if (value === 'high' || value === 'alert') return 'high'
  if (value === 'low' || value === 'normal') return 'low'
  return 'moderate'
}

function formatTime(value) {
  if (!value) return 'N/A'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
}

function formatUpdated(value) {
  if (!value) return 'N/A'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString('en-PH')
}

function getOutdoorGuidance(weather) {
  const risk = toRiskLevel(weather?.riskLevel)
  if (risk === 'high') return 'Postpone outdoor activities and monitor official advisories.'
  if (risk === 'moderate') return 'Proceed with caution. Prepare covered-area alternatives.'
  return 'Outdoor activities may proceed with routine monitoring.'
}

function getDismissalGuidance(weather) {
  const risk = toRiskLevel(weather?.riskLevel)
  if (risk === 'high') return 'Prepare assisted dismissal and monitor flood-prone routes.'
  if (risk === 'moderate') return 'Remind learners and guardians to prepare rain protection.'
  return 'Normal dismissal monitoring.'
}

const icon = (type) => {
  if (type === 'temp') return <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0M12 3a2 2 0 0 1 2 2v8.7a5 5 0 1 1-4 0V5a2 2 0 0 1 2-2"/></svg>
  if (type === 'rain') return <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 14a4 4 0 1 1 .4-8A6 6 0 0 1 18 7a3 3 0 1 1 0 6zm2 3a1 1 0 0 1 1 1v2H7v-2a1 1 0 0 1 1-1m8 0a1 1 0 0 1 1 1v2h-2v-2a1 1 0 0 1 1-1m-4 2a1 1 0 0 1 1 1v1h-2v-1a1 1 0 0 1 1-1"/></svg>
  return <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 4 4 8l8 4 8-4zm0 6L4 6v10l8 4 8-4V6z"/></svg>
}

export default function WeatherRisk({ weather, signal, status, onRefreshWeather }) {
  const data = weather || {}
  const riskLevel = toRiskLevel(data.riskLevel)
  const provider = data.provider || 'WeatherAPI.com'
  const hourly = Array.isArray(data.hourly) ? data.hourly.slice(0, 12) : []

  const metrics = [
    { label: 'Temperature', value: `${data.temp ?? 'N/A'}°C`, iconType: 'temp' },
    { label: 'Humidity', value: `${data.humidity ?? 'N/A'}%`, iconType: 'default' },
    { label: 'Wind Speed', value: `${data.windKph ?? 'N/A'} kph`, iconType: 'default' },
    { label: 'Chance of Rain', value: `${data.rainChance ?? 'N/A'}%`, iconType: 'rain' },
    { label: 'Precipitation', value: `${data.precipMm ?? 'N/A'} mm`, iconType: 'rain' },
    { label: 'Condition', value: data.condition || 'N/A', iconType: 'default' }
  ]

  return (
    <div className="fade-in">
      <PageHeader title="Weather & Risk Monitoring" description="Visual weather guidance for teachers and school DRRM monitoring." />

      <section className="portal-card weather-hero">
        <div>
          <p className="weather-hero-label">Current Condition</p>
          <h3>{data.condition || 'Unavailable'}</h3>
          <p className="weather-hero-temp">{data.temp ?? 'N/A'}°C</p>
        </div>
        <div>
          <p><span className={`status-badge status-${riskLevel}`}>Risk: {riskLevel.toUpperCase()}</span></p>
          <p><strong>Last Updated:</strong> {formatUpdated(data.lastUpdated)}</p>
          <p><strong>Provider:</strong> {provider}</p>
          <p><strong>Typhoon Signal:</strong> {signal || 0} | <strong>Safety:</strong> {status || 'normal'}</p>
          {onRefreshWeather ? <button className="btn btn-outline btn-sm" style={{ marginTop: 10 }} onClick={onRefreshWeather}>Refresh Weather</button> : null}
        </div>
      </section>

      {provider === 'Fallback' ? (
        <section className="portal-card" style={{ marginTop: 14, borderColor: '#f59e0b', background: '#fffbeb' }}>
          <h3>Live Weather Data Warning</h3>
          <p>Live weather is unavailable. Check Vercel environment variable VITE_WEATHERAPI_KEY and redeploy.</p>
        </section>
      ) : null}

      <section className="portal-card" style={{ marginTop: 14 }}>
        <h3>Current Weather Details</h3>
        <div className="weather-metric-grid">
          {metrics.map((metric) => (
            <article className="weather-metric-card" key={metric.label}>
              <p className="weather-metric-label">{icon(metric.iconType)} {metric.label}</p>
              <p className="weather-metric-value">{metric.value}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="dashboard-grid" style={{ marginTop: 14 }}>
        <section className="portal-card">
          <h3>Overall Risk</h3>
          <p className={`status-badge status-${riskLevel}`}>{riskLevel.toUpperCase()}</p>
          <p style={{ marginTop: 8 }}>{data.riskSummary || 'Continue routine weather monitoring and check updates regularly.'}</p>
        </section>
        <section className="portal-card">
          <h3>Outdoor Activity Guidance</h3>
          <p>{getOutdoorGuidance(data)}</p>
        </section>
        <section className="portal-card">
          <h3>Dismissal Guidance</h3>
          <p>{getDismissalGuidance(data)}</p>
        </section>
      </div>

      <section className="portal-card" style={{ marginTop: 14 }}>
        <h3>DRRM Action</h3>
        <p>{data.recommendedAction || 'Coordinate with DRRM team and monitor official government weather advisories.'}</p>
        <p style={{ marginTop: 8, color: '#60758f' }}>Note: This page supports monitoring and planning only. Suspension decisions must follow official advisories.</p>
      </section>

      <section className="portal-card" style={{ marginTop: 14 }}>
        <h3>Next 6 to 12 Hours Forecast</h3>
        {hourly.length === 0 ? <p>No hourly forecast available.</p> : (
          <div className="hourly-forecast-strip">
            {hourly.map((item) => {
              const hRisk = toRiskLevel(item.riskLevel)
              return (
                <article className="hourly-card" key={`${item.time}-${item.condition}`}>
                  <p className="weather-metric-label">{formatTime(item.time)}</p>
                  <h4>{item.condition || 'N/A'}</h4>
                  <p><strong>Temp:</strong> {item.temp ?? 'N/A'}°C</p>
                  <p><strong>Rain:</strong> {item.chanceOfRain ?? 'N/A'}%</p>
                  <p><strong>Wind:</strong> {item.windKph ?? 'N/A'} kph</p>
                  <span className={`status-badge status-${hRisk}`}>{hRisk.toUpperCase()}</span>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
