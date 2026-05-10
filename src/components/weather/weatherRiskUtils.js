export const ADVISORY_NOTE = 'Weather data supports monitoring only. Follow official PAGASA, LGU, and school DRRM advisories for decisions.'

export const toRiskLevel = (risk) => {
  const value = String(risk || 'moderate').toLowerCase()
  if (value === 'high' || value === 'alert') return 'high'
  if (value === 'low' || value === 'normal') return 'low'
  return 'moderate'
}

export function formatTime(value) {
  if (!value) return 'N/A'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
}

export function formatUpdated(value) {
  if (!value) return 'N/A'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleString('en-PH')
}

export function getOutdoorGuidance(weather) {
  const risk = toRiskLevel(weather?.riskLevel)
  if (risk === 'high') return 'Postpone outdoor activities and monitor official advisories.'
  if (risk === 'moderate') return 'Proceed with caution. Prepare covered-area alternatives.'
  return 'Outdoor activities may proceed with routine monitoring.'
}

export function getDismissalGuidance(weather) {
  const risk = toRiskLevel(weather?.riskLevel)
  if (risk === 'high') return 'Prepare assisted dismissal and monitor flood-prone routes.'
  if (risk === 'moderate') return 'Remind learners and guardians to prepare rain protection.'
  return 'Normal dismissal monitoring.'
}

export function getWeatherMetrics(weather) {
  const data = weather || {}
  return [
    { label: 'Temperature', value: `${data.temp ?? 'N/A'}°C`, iconType: 'temp' },
    { label: 'Humidity', value: `${data.humidity ?? 'N/A'}%`, iconType: 'default' },
    { label: 'Wind Speed', value: `${data.windKph ?? 'N/A'} kph`, iconType: 'default' },
    { label: 'Chance of Rain', value: `${data.rainChance ?? 'N/A'}%`, iconType: 'rain' },
    { label: 'Precipitation', value: `${data.precipMm ?? 'N/A'} mm`, iconType: 'rain' },
    { label: 'Condition', value: data.condition || 'N/A', iconType: 'default' }
  ]
}
