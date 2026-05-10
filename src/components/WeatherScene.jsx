function toSceneType(weather) {
  if (!weather || weather.provider === 'Fallback') return 'unavailable'

  const condition = String(weather.condition || weather.description || '').toLowerCase()
  const windKph = Number(weather.windKph || 0)
  const rainChance = Number(weather.rainChance || 0)
  const precipMm = Number(weather.precipMm || 0)

  if (condition.includes('thunder')) return 'thunderstorm'
  if (precipMm >= 10 || rainChance >= 80) return 'heavyRain'
  if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) return 'lightRain'
  if (windKph >= 35) return 'windy'
  if (condition.includes('partly')) return 'partlyCloudy'
  if (condition.includes('cloud') || condition.includes('mist') || condition.includes('fog') || condition.includes('overcast')) return 'cloudy'
  if (condition.includes('sun') || condition.includes('clear')) return 'clear'
  return 'partlyCloudy'
}

export default function WeatherScene({ weather }) {
  const sceneType = toSceneType(weather)

  return (
    <div className={`weather-scene weather-scene-${sceneType}`} aria-hidden="true">
      <div className="scene-sky" />
      <div className="scene-sun" />
      <div className="scene-rays" />
      <div className="scene-cloud cloud-a" />
      <div className="scene-cloud cloud-b" />
      <div className="scene-rain" />
      <div className="scene-rain scene-rain-heavy" />
      <div className="scene-lightning" />
      <div className="scene-wind" />
    </div>
  )
}
