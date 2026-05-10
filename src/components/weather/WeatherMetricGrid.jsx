function icon(type) {
  if (type === 'temp') return <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0M12 3a2 2 0 0 1 2 2v8.7a5 5 0 1 1-4 0V5a2 2 0 0 1 2-2"/></svg>
  if (type === 'rain') return <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6 14a4 4 0 1 1 .4-8A6 6 0 0 1 18 7a3 3 0 1 1 0 6zm2 3a1 1 0 0 1 1 1v2H7v-2a1 1 0 0 1 1-1m8 0a1 1 0 0 1 1 1v2h-2v-2a1 1 0 0 1 1-1m-4 2a1 1 0 0 1 1 1v1h-2v-1a1 1 0 0 1 1-1"/></svg>
  return <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 4 4 8l8 4 8-4zm0 6L4 6v10l8 4 8-4V6z"/></svg>
}

export default function WeatherMetricGrid({ metrics }) {
  return (
    <div className="weather-metric-grid">
      {metrics.map((metric) => (
        <article className="weather-metric-card" key={metric.label}>
          <p className="weather-metric-label">{icon(metric.iconType)} {metric.label}</p>
          <p className="weather-metric-value">{metric.value}</p>
        </article>
      ))}
    </div>
  )
}
