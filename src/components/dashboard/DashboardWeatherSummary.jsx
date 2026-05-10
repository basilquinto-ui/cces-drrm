export default function DashboardWeatherSummary({ weather }) {
  const safeWeather = weather?.condition || 'No weather data loaded yet.'
  const riskLevel = weather?.riskLevel || 'moderate'

  return (
    <section className="portal-card">
      <h3>Weather / Risk Summary</h3>
      <p><strong>{safeWeather}</strong></p>
      <p>Temp: {weather?.temp ?? 'N/A'}°C · Wind: {weather?.windKph ?? 'N/A'} kph · Rain: {weather?.rainChance ?? 'N/A'}%</p>
      <p>Risk: <span className={`status-badge status-${riskLevel}`}>{riskLevel.toUpperCase()}</span></p>
      <p>{weather?.recommendedAction || 'Keep monitoring official advisories for sudden changes.'}</p>
    </section>
  )
}
