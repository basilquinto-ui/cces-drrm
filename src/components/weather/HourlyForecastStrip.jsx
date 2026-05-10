import { formatTime, toRiskLevel } from './weatherRiskUtils'

export default function HourlyForecastStrip({ hourly, limit, title }) {
  const forecast = Array.isArray(hourly) ? (limit ? hourly.slice(0, limit) : hourly) : []

  return (
    <>
      {title ? <h3>{title}</h3> : null}
      {forecast.length === 0 ? <p>No hourly forecast available.</p> : (
        <div className="hourly-forecast-strip">
          {forecast.map((item) => {
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
    </>
  )
}
