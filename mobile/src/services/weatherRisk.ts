const API_KEY = process.env.EXPO_PUBLIC_WEATHERAPI_KEY;
const LOCATION = 'Camp Crame, Quezon City, Philippines';

type HourlyRisk = {
  time: string;
  condition: string;
  temp: number;
  windKph: number;
  chanceOfRain: number;
  precipMm: number;
  riskLevel: string;
};

export type WeatherRiskData = {
  provider: string;
  temp: number | null;
  humidity: number | null;
  windKph: number | null;
  condition: string;
  description: string;
  rainChance: number | null;
  precipMm: number | null;
  type: string;
  riskLevel: string;
  riskSummary: string;
  recommendedAction: string;
  lastUpdated: string;
  hourly: HourlyRisk[];
};

function createFallbackWeather(): WeatherRiskData {
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
    recommendedAction: 'Check official PAGASA and school DRRM advisories.',
    lastUpdated: new Date().toISOString(),
    hourly: [],
  };
}

function classifyRiskForHour(hour: any, humidity: number): string {
  const chance = Number(hour?.chance_of_rain || 0);
  const wind = Number(hour?.wind_kph || 0);
  const precip = Number(hour?.precip_mm || 0);
  const text = String(hour?.condition?.text || '').toLowerCase();
  const hourOfDay = new Date(hour.time).getHours();
  const schoolHours = hourOfDay >= 6 && hourOfDay <= 18;

  if (text.includes('thunder') || chance >= 80 || wind >= 40 || (schoolHours && precip >= 10)) return 'high';
  if (chance >= 50 || wind >= 25 || ((text.includes('rain') || text.includes('cloud')) && humidity >= 85) || (schoolHours && chance >= 50)) return 'moderate';
  return 'low';
}

function composeOverallRisk(hourly: HourlyRisk[]) {
  const riskLevel = hourly.some((item) => item.riskLevel === 'high')
    ? 'high'
    : hourly.some((item) => item.riskLevel === 'moderate')
      ? 'moderate'
      : 'low';

  if (riskLevel === 'high') {
    return {
      riskLevel,
      riskSummary: 'High-impact weather likely within monitoring window.',
      recommendedAction: 'Prepare contingency actions and coordinate dismissal safety plans.',
    };
  }

  if (riskLevel === 'moderate') {
    return {
      riskLevel,
      riskSummary: 'Moderate weather risk may affect school operations.',
      recommendedAction: 'Monitor updates hourly and keep DRRM coordination active.',
    };
  }

  return {
    riskLevel,
    riskSummary: 'Low near-term weather risk for school operations.',
    recommendedAction: 'Continue routine monitoring and readiness checks.',
  };
}

function normalizeHourlyForecast(hours: any[], humidity: number): HourlyRisk[] {
  const now = Date.now();
  return hours
    .filter((hour) => new Date(hour.time).getTime() >= now)
    .slice(0, 12)
    .map((hour) => ({
      time: hour.time,
      condition: hour?.condition?.text || 'Unknown',
      temp: Math.round(hour.temp_c),
      windKph: Math.round(hour.wind_kph),
      chanceOfRain: Number(hour.chance_of_rain || 0),
      precipMm: Number(hour.precip_mm || 0),
      riskLevel: classifyRiskForHour(hour, humidity),
    }));
}

function normalizeWeatherResponse(data: any): WeatherRiskData {
  const current = data?.current;
  const humidity = Number(current?.humidity ?? 0);
  const rawHours = data?.forecast?.forecastday?.[0]?.hour || [];
  const hourly = normalizeHourlyForecast(rawHours, humidity);
  const overallRisk = composeOverallRisk(hourly);

  return {
    provider: 'WeatherAPI.com',
    temp: Math.round(current?.temp_c ?? 0),
    humidity,
    windKph: Math.round(current?.wind_kph ?? 0),
    condition: current?.condition?.text || 'Unknown',
    description: current?.condition?.text || 'Unknown',
    rainChance: hourly[0]?.chanceOfRain ?? 0,
    precipMm: hourly[0]?.precipMm ?? 0,
    type: 'weather',
    riskLevel: overallRisk.riskLevel,
    riskSummary: overallRisk.riskSummary,
    recommendedAction: overallRisk.recommendedAction,
    lastUpdated: current?.last_updated_epoch
      ? new Date(current.last_updated_epoch * 1000).toISOString()
      : new Date().toISOString(),
    hourly,
  };
}

export async function fetchWeatherRisk(): Promise<WeatherRiskData> {
  if (!API_KEY) return createFallbackWeather();

  try {
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(LOCATION)}&days=1&aqi=no&alerts=no`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('WeatherAPI failed');

    const data = await response.json();
    return normalizeWeatherResponse(data);
  } catch {
    return createFallbackWeather();
  }
}
