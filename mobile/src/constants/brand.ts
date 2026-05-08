export const brand = {
  appName: 'CCES DRRM Command Center',
  shortName: 'CCES DRRM',
  schoolName: 'Camp Crame Elementary School',
  tagline: 'School safety status and emergency operations',
  supportEmail: 'support@cces-drrm.local',
  emergencyNote: 'For urgent incidents, contact school emergency channels immediately.',
  colors: {
    commandNavy: '#102A4A',
    safetyBlue: '#1D4ED8',
    emergencyRed: '#B42318',
    warningAmber: '#B45309',
    safeGreen: '#067647',
  },
  statusTones: {
    info: 'Active monitoring and normal operations.',
    success: 'Clear and safe conditions confirmed.',
    warning: 'Needs attention with elevated risk.',
    danger: 'Immediate response and escalation required.',
  },
} as const;
