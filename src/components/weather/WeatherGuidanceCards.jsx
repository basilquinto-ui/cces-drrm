import { getDismissalGuidance, getOutdoorGuidance, toRiskLevel } from './weatherRiskUtils'

export default function WeatherGuidanceCards({ weather }) {
  const riskLevel = toRiskLevel(weather?.riskLevel)

  return (
    <div className="dashboard-grid" style={{ marginTop: 14 }}>
      <section className="portal-card"><h3>Overall Risk</h3><p className={`status-badge status-${riskLevel}`}>{riskLevel.toUpperCase()}</p><p style={{ marginTop: 8 }}>{weather?.riskSummary || 'Continue routine weather monitoring and check updates regularly.'}</p></section>
      <section className="portal-card"><h3>Outdoor Activity Guidance</h3><p>{getOutdoorGuidance(weather)}</p></section>
      <section className="portal-card"><h3>Dismissal Guidance</h3><p>{getDismissalGuidance(weather)}</p></section>
    </div>
  )
}
