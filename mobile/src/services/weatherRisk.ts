const API_KEY = process.env.EXPO_PUBLIC_WEATHERAPI_KEY;
const LOCATION = 'Camp Crame, Quezon City, Philippines';

type HourlyRisk = { time: string; condition: string; temp: number; windKph: number; chanceOfRain: number; precipMm: number; riskLevel: string };
export type WeatherRiskData = {
  provider: string; temp: number | null; humidity: number | null; windKph: number | null; condition: string; description: string;
  rainChance: number | null; precipMm: number | null; type: string; riskLevel: string; riskSummary: string; recommendedAction: string; lastUpdated: string; hourly: HourlyRisk[];
};

const fallback = (): WeatherRiskData => ({
  provider: 'Fallback', temp: null, humidity: null, windKph: null, condition: 'Unknown', description: 'Weather data unavailable',
  rainChance: null, precipMm: null, type: 'cloudy', riskLevel: 'moderate', riskSummary: 'Using fallback weather state.',
  recommendedAction: 'Check official PAGASA and school DRRM advisories.', lastUpdated: new Date().toISOString(), hourly: [],
});

const riskForHour = (h: any, humidity: number) => {
  const chance = Number(h?.chance_of_rain || 0); const wind = Number(h?.wind_kph || 0); const precip = Number(h?.precip_mm || 0);
  const text = String(h?.condition?.text || '').toLowerCase(); const hour = new Date(h.time).getHours(); const schoolHours = hour >= 6 && hour <= 18;
  if (text.includes('thunder') || chance >= 80 || wind >= 40 || (schoolHours && precip >= 10)) return 'high';
  if (chance >= 50 || wind >= 25 || ((text.includes('rain') || text.includes('cloud')) && humidity >= 85) || (schoolHours && chance >= 50)) return 'moderate';
  return 'low';
};

export async function fetchWeatherRisk(): Promise<WeatherRiskData> {
  if (!API_KEY) return fallback();
  try {
    const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(LOCATION)}&days=1&aqi=no&alerts=no`);
    if (!res.ok) throw new Error('WeatherAPI failed');
    const data = await res.json(); const current = data?.current; const now = Date.now();
    const hourly = (data?.forecast?.forecastday?.[0]?.hour || []).filter((h: any) => new Date(h.time).getTime() >= now).slice(0, 12).map((h: any) => ({
      time: h.time, condition: h?.condition?.text || 'Unknown', temp: Math.round(h.temp_c), windKph: Math.round(h.wind_kph), chanceOfRain: Number(h.chance_of_rain || 0), precipMm: Number(h.precip_mm || 0), riskLevel: riskForHour(h, Number(current?.humidity || 0)),
    }));
    const riskLevel = hourly.some((h: HourlyRisk) => h.riskLevel === 'high') ? 'high' : hourly.some((h: HourlyRisk) => h.riskLevel === 'moderate') ? 'moderate' : 'low';
    const riskSummary = riskLevel === 'high' ? 'High-impact weather likely within monitoring window.' : riskLevel === 'moderate' ? 'Moderate weather risk may affect school operations.' : 'Low near-term weather risk for school operations.';
    const recommendedAction = riskLevel === 'high' ? 'Prepare contingency actions and coordinate dismissal safety plans.' : riskLevel === 'moderate' ? 'Monitor updates hourly and keep DRRM coordination active.' : 'Continue routine monitoring and readiness checks.';
    return {
      provider: 'WeatherAPI.com', temp: Math.round(current?.temp_c ?? 0), humidity: Number(current?.humidity ?? 0), windKph: Math.round(current?.wind_kph ?? 0),
      condition: current?.condition?.text || 'Unknown', description: current?.condition?.text || 'Unknown', rainChance: hourly[0]?.chanceOfRain ?? 0, precipMm: hourly[0]?.precipMm ?? 0,
      type: 'weather', riskLevel, riskSummary, recommendedAction, lastUpdated: current?.last_updated_epoch ? new Date(current.last_updated_epoch * 1000).toISOString() : new Date().toISOString(), hourly,
    };
  } catch { return fallback(); }
}
