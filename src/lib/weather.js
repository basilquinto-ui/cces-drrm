const OWM_KEY = import.meta.env.VITE_WEATHER_API_KEY
const QC_LAT = 14.676
const QC_LON = 121.0437

export async function fetchWeather() {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${QC_LAT}&lon=${QC_LON}&appid=${OWM_KEY}&units=metric`
    )
    if (!res.ok) throw new Error('API error')
    const d = await res.json()
    const main = d.weather[0].main.toLowerCase()
    let type = 'sunny'
    if (main.includes('thunder') || main.includes('storm')) type = 'stormy'
    else if (main.includes('rain') || main.includes('drizzle')) type = 'rainy'
    else if (main.includes('cloud') || main.includes('mist') || main.includes('fog')) type = 'cloudy'
    return {
      temp: Math.round(d.main.temp),
      humidity: d.main.humidity,
      windKph: Math.round(d.wind.speed * 3.6),
      description: d.weather[0].description,
      type,
    }
  } catch {
    return { temp: 31, humidity: 78, windKph: 12, description: 'Partly Cloudy', type: 'cloudy' }
  }
}

export const weatherEmoji = { sunny: '☀️', cloudy: '⛅', rainy: '🌧️', stormy: '⛈️' }
export const weatherLabel = {
  sunny: 'Sunny / Clear',
  cloudy: 'Partly Cloudy',
  rainy: 'Rainy — Monitor for flooding',
  stormy: 'Thunderstorm — Stay Indoors',
}
