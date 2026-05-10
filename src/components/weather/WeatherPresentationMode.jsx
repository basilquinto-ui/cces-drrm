import WeatherScene from './WeatherScene'
import HourlyForecastStrip from './HourlyForecastStrip'
import { ADVISORY_NOTE, formatUpdated, getDismissalGuidance, getOutdoorGuidance, toRiskLevel } from './weatherRiskUtils'

export default function WeatherPresentationMode({ weather, signal, status }) {
  const data = weather || {}
  const riskLevel = toRiskLevel(data.riskLevel)
  const provider = data.provider || 'WeatherAPI.com'

  return (
    <section className="portal-card weather-presentation">
      <div className="weather-presentation-hero">
        <WeatherScene weather={data} />
        <div>
          <p className="weather-presentation-condition">{data.condition || 'Unavailable'}</p>
          <p className="weather-presentation-temp">{data.temp ?? 'N/A'}°C</p>
          <p><span className={`status-badge status-${riskLevel}`}>Risk: {riskLevel.toUpperCase()}</span></p>
        </div>
      </div>
      <div className="weather-presentation-main">
        <section className="weather-presentation-guidance">
          <h3>Weather Guidance</h3>
          <p><strong>Rain Chance:</strong> {data.rainChance ?? 'N/A'}%</p>
          <p><strong>Wind Speed:</strong> {data.windKph ?? 'N/A'} kph</p>
          <p><strong>Humidity:</strong> {data.humidity ?? 'N/A'}%</p>
          <p><strong>Precipitation:</strong> {data.precipMm ?? 'N/A'} mm</p>
          <p><strong>Outdoor Activity:</strong> {getOutdoorGuidance(data)}</p>
          <p><strong>Dismissal Guidance:</strong> {getDismissalGuidance(data)}</p>
          <p><strong>DRRM Action:</strong> {data.recommendedAction || 'Coordinate with DRRM team and monitor official government weather advisories.'}</p>
        </section>
        <aside className="weather-presentation-side">
          <h3>Monitoring Details</h3>
          <p><strong>Typhoon Signal:</strong> {signal || 0}</p>
          <p><strong>Safety Status:</strong> {status || 'normal'}</p>
          <p><strong>Provider:</strong> {provider}</p>
          <p><strong>Last Updated:</strong> {formatUpdated(data.lastUpdated)}</p>
          <p style={{ marginTop: 10, color: '#60758f' }}>{ADVISORY_NOTE}</p>
        </aside>
      </div>
      <section className="weather-presentation-forecast">
        <HourlyForecastStrip hourly={data.hourly} limit={6} title="Next 6 Hours Forecast" />
      </section>
    </section>
  )
}
