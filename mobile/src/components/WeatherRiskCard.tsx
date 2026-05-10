import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppCard } from '@/components/AppCard';
import { ErrorState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { SectionHeader } from '@/components/SectionHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { theme } from '@/constants/theme';
import { fetchWeatherRisk, type WeatherRiskData } from '@/services/weatherRisk';

function formatDateTime(value?: string | null): string {
  if (!value) return 'Unknown date';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Unknown date';
  return parsed.toLocaleString('en-PH');
}

function getRiskTone(riskLevel?: string) {
  if (riskLevel === 'high') return 'danger';
  if (riskLevel === 'moderate') return 'warning';
  if (riskLevel === 'low') return 'success';
  return 'info';
}

export function WeatherRiskCard() {
  const [data, setData] = useState<WeatherRiskData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    const loadWeatherRisk = async () => {
      setLoading(true);
      setError('');

      try {
        const result = await fetchWeatherRisk();
        if (mounted) setData(result);
      } catch {
        if (mounted) setError('Unable to load weather monitoring data.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadWeatherRisk();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View>
      <SectionHeader title="Weather and Risk" subtitle="Daily environmental status" />
      <AppCard>
        {loading ? <LoadingState message="Loading weather risk..." /> : null}
        {!loading && error ? <ErrorState message={error} /> : null}
        {!loading && !error && data ? (
          <>
            <Text style={styles.value}>{data.condition}</Text>
            <Text style={styles.meta}>
              Temp: {data.temp ?? 'N/A'}°C · Wind: {data.windKph ?? 'N/A'} kph · Rain: {data.rainChance ?? 'N/A'}%
            </Text>
            <View style={styles.badgeRow}>
              <StatusBadge
                label={`Risk: ${data.riskLevel.toUpperCase()}`}
                tone={getRiskTone(data.riskLevel)}
              />
            </View>
            <Text style={styles.meta}>Action: {data.recommendedAction}</Text>
            <Text style={styles.meta}>Last updated: {formatDateTime(data.lastUpdated)}</Text>
            <Text style={styles.note}>
              Weather data supports monitoring only. Follow official PAGASA and school DRRM advisories for decisions.
            </Text>
          </>
        ) : null}
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  value: { color: theme.colors.text, fontSize: 16, fontWeight: '700' },
  meta: { color: theme.colors.muted, fontSize: 12, marginTop: 8 },
  badgeRow: { marginTop: 10 },
  note: { color: theme.colors.muted, fontSize: 11, marginTop: 10 },
});
