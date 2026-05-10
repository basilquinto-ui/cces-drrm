import PageHeader from '../components/layout/PageHeader'

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

export default function WeatherRisk({ weather, signal, status, onRefreshWeather }) {
  const data = weather || {}
  const hourly = Array.isArray(data.hourly) ? data.hourly.slice(0, 12) : []

  return (
    <div className="fade-in">
      <PageHeader title="Weather & Risk Monitoring" description="Operational weather and risk tracking for school DRRM support." />
      <div className="dashboard-grid">
        <section className="portal-card">
          <h3>Current Weather</h3>
          <p><strong>Condition:</strong> {data.condition || data.description || 'N/A'}</p>
          <p><strong>Temperature:</strong> {data.temp ?? 'N/A'}°C</p>
          <p><strong>Humidity:</strong> {data.humidity ?? 'N/A'}%</p>
          <p><strong>Wind Speed:</strong> {data.windKph ?? 'N/A'} kph</p>
          <p><strong>Chance of Rain:</strong> {data.rainChance ?? 'N/A'}%</p>
          <p><strong>Precipitation:</strong> {data.precipMm ?? 'N/A'} mm</p>
          <p><strong>Last Updated:</strong> {formatUpdated(data.lastUpdated)}</p>
        </section>

        <section className="portal-card">
          <h3>Risk Guidance</h3>
          <p><strong>Risk Level:</strong> <span className={`status-badge status-${data.riskLevel || 'moderate'}`}>{(data.riskLevel || 'moderate').toUpperCase()}</span></p>
          <p><strong>Risk Summary:</strong> {data.riskSummary || 'N/A'}</p>
          <p><strong>Recommended Action:</strong> {data.recommendedAction || 'N/A'}</p>
          <p><strong>Typhoon Signal:</strong> {signal || 0}</p>
          <p><strong>School Safety Status:</strong> {status || 'normal'}</p>
          {onRefreshWeather ? <button className="btn" onClick={onRefreshWeather}>Refresh Weather</button> : null}
        </section>
      </div>

      <section className="portal-card" style={{ marginTop: 16 }}>
        <h3>Next 6 to 12 Hours Forecast</h3>
        <p>Weather data supports monitoring only. Follow official PAGASA and school DRRM advisories for decisions.</p>
        {hourly.length === 0 ? (
          <p>No hourly forecast available.</p>
        ) : (
          <table className="monitor-table">
            <thead>
              <tr>
                <th>Time</th><th>Condition</th><th>Temp (°C)</th><th>Wind (kph)</th><th>Rain %</th><th>Precip (mm)</th><th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {hourly.map((item) => (
                <tr key={`${item.time}-${item.condition}`}>
                  <td>{formatTime(item.time)}</td>
                  <td>{item.condition}</td>
                  <td>{item.temp}</td>
                  <td>{item.windKph}</td>
                  <td>{item.chanceOfRain}</td>
                  <td>{item.precipMm}</td>
                  <td><span className={`status-badge status-${item.riskLevel || 'low'}`}>{(item.riskLevel || 'low').toUpperCase()}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
