import { formatDistanceToNow, format, parseISO } from 'date-fns'

export function timeAgo(date: string | Date): string {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date
    return formatDistanceToNow(d, { addSuffix: true })
  } catch { return String(date) }
}
export function formatDate(dateStr: string, pattern = 'MMM d, yyyy'): string {
  try { return format(parseISO(dateStr), pattern) } catch { return dateStr }
}
export function formatCurrency(amount: number, currency = '₹'): string {
  return `${currency}${amount.toLocaleString('en-IN')}`
}
export function formatRating(rating: number): string { return rating.toFixed(1) }
export function initials(name: string): string {
  return name.split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase() ?? '').join('')
}
export function truncate(str: string, max = 80): string {
  if (str.length <= max) return str
  return str.slice(0, max).trimEnd() + '…'
}
