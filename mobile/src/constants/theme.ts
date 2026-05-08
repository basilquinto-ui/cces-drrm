import { brand } from '@/constants/brand';

export const theme = {
  colors: {
    primary: brand.colors.commandNavy,
    primarySoft: '#E8EEF7',
    safetyBlue: brand.colors.safetyBlue,
    background: '#F3F6FB',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#0F172A',
    muted: '#607087',
    danger: brand.colors.emergencyRed,
    warning: brand.colors.warningAmber,
    success: brand.colors.safeGreen,
    info: brand.colors.safetyBlue,
    border: '#D1D9E6',
    shadow: '#102A4A1A',
  },
  spacing: (n: number) => n * 8,
  radius: {
    sm: 10,
    md: 14,
    lg: 18,
  },
  shadow: {
    color: '#102A4A',
    opacity: 0.12,
    radius: 10,
    offset: { width: 0, height: 3 },
    elevation: 2,
  },
} as const;
