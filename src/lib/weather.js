const WEATHER_API_KEY = import.meta.env.VITE_WEATHERAPI_KEY
const LOCATION_QUERY = 'Camp Crame, Quezon City, Philippines'

function classifyCondition(condition = '') {
  const text = condition.toLowerCase()
  if (text.includes('thunder')) return 'stormy'
  if (text.includes('rain') || text.includes('drizzle') || text.includes('shower')) return 'rainy'
  if (text.includes('cloud') || text.includes('mist') || text.includes('fog')) return 'cloudy'
  return 'sunny'
}

function fallbackWeather() {
  return {
    provider: 'Fallback',
    temp: null,
    humidity: null,
    windKph: null,
    condition: 'Unknown',
    description: 'Weather data unavailable',
    rainChance: null,
    precipMm: null,
    type: 'cloudy',
    riskLevel: 'moderate',
    riskSummary: 'Using fallback weather state.',
    recommendedAction: 'Check official PAGASA and school DRRM advisories before making decisions.',
    lastUpdated: new Date().toISOString(),
    hourly: [],
  }
}

function hourlyRisk(hour, condition, humidity) {
  const chance = Number(hour.chance_of_rain || 0)
  const windKph = Number(hour.wind_kph || 0)
  const precipMm = Number(hour.precip_mm || 0)
  const text = String(condition || '').toLowerCase()
  const hr = new Date(hour.time).getHours()
  const schoolHours = hr >= 6 && hr <= 18
  const isThunder = text.includes('thunder')
  const heavyRain = precipMm >= 10

  if (isThunder || chance >= 80 || windKph >= 40 || (schoolHours && heavyRain)) return 'high'
  if (chance >= 50 || windKph >= 25 || ((text.includes('rain') || text.includes('cloud')) && humidity >= 85) || (schoolHours && chance >= 50)) return 'moderate'
  return 'low'
}

function composeRisk(current, hourly = []) {
  const levels = hourly.map((h) => h.riskLevel)
  const level = levels.includes('high') ? 'high' : levels.includes('moderate') ? 'moderate' : 'low'
  if (level === 'high') {
    return {
      riskLevel: 'high',
      riskSummary: 'High-impact weather likely within monitoring window.',
      recommendedAction: 'Prepare contingency actions for class suspension, dismissal safety, and flood-prone zones.',
    }
  }
  if (level === 'moderate') {
    return {
      riskLevel: 'moderate',
      riskSummary: 'Moderate weather risk detected; rain and wind may affect school operations.',
      recommendedAction: 'Monitor updates hourly and coordinate readiness with DRRM focal personnel.',
    }
  }
  return {
    riskLevel: 'low',
    riskSummary: 'Low near-term weather risk for school operations.',
    recommendedAction: 'Continue routine monitoring and keep advisory channels open.',
  }
}

export async function fetchWeather() {
  if (!WEATHER_API_KEY) return fallbackWeather()
  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(LOCATION_QUERY)}&days=1&aqi=no&alerts=no`
    const res = await fetch(url)
    if (!res.ok) throw new Error('WeatherAPI request failed')
    const data = await res.json()
    const current = data?.current
    const forecastHours = data?.forecast?.forecastday?.[0]?.hour || []
    const now = Date.now()
    const hourly = forecastHours
      .filter((h) => new Date(h.time).getTime() >= now)
      .slice(0, 12)
      .map((h) => ({
        time: h.time,
        condition: h.condition?.text || 'Unknown',
        temp: Math.round(h.temp_c),
        windKph: Math.round(h.wind_kph),
        chanceOfRain: Number(h.chance_of_rain || 0),
        precipMm: Number(h.precip_mm || 0),
        riskLevel: hourlyRisk(h, h.condition?.text, Number(current?.humidity || 0)),
      }))
    const risk = composeRisk(current, hourly)
    return {
      provider: 'WeatherAPI.com',
      temp: Math.round(current?.temp_c ?? 0),
      humidity: Number(current?.humidity ?? 0),
      windKph: Math.round(current?.wind_kph ?? 0),
      condition: current?.condition?.text || 'Unknown',
      description: current?.condition?.text || 'Unknown',
      rainChance: hourly[0]?.chanceOfRain ?? 0,
      precipMm: hourly[0]?.precipMm ?? 0,
      type: classifyCondition(current?.condition?.text),
      riskLevel: risk.riskLevel,
      riskSummary: risk.riskSummary,
      recommendedAction: risk.recommendedAction,
      lastUpdated: current?.last_updated_epoch ? new Date(current.last_updated_epoch * 1000).toISOString() : new Date().toISOString(),
      hourly,
    }
  } catch {
    return fallbackWeather()
  }
}
