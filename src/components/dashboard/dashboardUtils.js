export function formatLabel(value) {
  if (!value || typeof value !== 'string') return 'Unknown'
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase())
}

export function formatDateTime(value) {
  if (!value) return 'Unknown date'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Unknown date' : date.toLocaleString('en-PH')
}
