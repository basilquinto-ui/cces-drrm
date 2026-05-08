export const checkinStatuses = ['safe', 'needs_help', 'medical', 'evacuation', 'not_on_campus'] as const;

export type CheckinStatus = (typeof checkinStatuses)[number];

type CheckinStatusMeta = {
  label: string;
  description: string;
  tone: 'success' | 'warning' | 'danger' | 'info';
};

export const checkinStatusMeta: Record<CheckinStatus, CheckinStatusMeta> = {
  safe: {
    label: 'Safe',
    description: 'I am safe and accounted for.',
    tone: 'success',
  },
  needs_help: {
    label: 'Needs Help',
    description: 'I need assistance from the DRRM team.',
    tone: 'warning',
  },
  medical: {
    label: 'Needs Medical Assistance',
    description: 'I need medical attention.',
    tone: 'danger',
  },
  evacuation: {
    label: 'At Evacuation Area',
    description: 'I am already at the evacuation area.',
    tone: 'info',
  },
  not_on_campus: {
    label: 'Not on Campus',
    description: 'I am not currently on campus.',
    tone: 'info',
  },
};
