export const formatDateTime = (iso?: string | null) => {
  if (!iso) return 'Unknown date';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return date.toLocaleString();
};

export const formatLabel = (value?: string | null) => {
  if (!value) return 'Unknown';
  return value
    .split('_')
    .filter(Boolean)
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1).toLowerCase())
    .join(' ');
};
