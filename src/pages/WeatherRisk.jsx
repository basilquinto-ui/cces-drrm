import { useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import WeatherScene from '../components/weather/WeatherScene'
import HourlyForecastStrip from '../components/weather/HourlyForecastStrip'
import WeatherGuidanceCards from '../components/weather/WeatherGuidanceCards'
import WeatherMetricGrid from '../components/weather/WeatherMetricGrid'
import WeatherPresentationMode from '../components/weather/WeatherPresentationMode'
import { ADVISORY_NOTE, formatUpdated, getWeatherMetrics, toRiskLevel } from '../components/weather/weatherRiskUtils'
import OfficialAdvisoryPanel from '../components/hazards/OfficialAdvisoryPanel'
import EarthquakePanel from '../components/hazards/EarthquakePanel'

export default function WeatherRisk({ weather, signal, status, onRefreshWeather, isAdmin }) {
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const data = weather || {}
  const provider = data.provider || 'WeatherAPI.com'
  const riskLevel = toRiskLevel(data.riskLevel)
  const hourly = Array.isArray(data.hourly) ? data.hourly.slice(0, 12) : []
  const metrics = getWeatherMetrics(data)

  return (
    <div className="fade-in">
      <PageHeader title="Weather & Risk Monitoring" description="Visual weather guidance for teachers and school DRRM monitoring." />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <button className="btn btn-outline btn-sm" onClick={() => setIsPresentationMode((prev) => !prev)}>
          {isPresentationMode ? 'Exit Presentation' : 'Presentation Mode'}
        </button>
      </div>

      {isPresentationMode ? <WeatherPresentationMode weather={data} signal={signal} status={status} /> : (
        <>
          <section className="portal-card weather-hero">
            <div>
              <WeatherScene weather={data} />
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
            <WeatherMetricGrid metrics={metrics} />
          </section>

          <WeatherGuidanceCards weather={data} />

          <section className="portal-card" style={{ marginTop: 14 }}>
            <h3>DRRM Action</h3>
            <p>{data.recommendedAction || 'Coordinate with DRRM team and monitor official government weather advisories.'}</p>
            <p style={{ marginTop: 8, color: '#60758f' }}>{ADVISORY_NOTE}</p>
          </section>

          <section className="portal-card" style={{ marginTop: 14 }}>
            <HourlyForecastStrip hourly={hourly} title="Next 6 to 12 Hours Forecast" />
          </section>

          <OfficialAdvisoryPanel isAdmin={isAdmin} />
          <EarthquakePanel isAdmin={isAdmin} />
        </>
      )}
    </div>
  )
}
