import dayjs from 'dayjs'

export function cn(...values) {
  return values.filter(Boolean).join(' ')
}

export function roleHomePath(role) {
  if (role === 'admin') return '/admin/dashboard'
  if (role === 'teacher') return '/teacher/dashboard'
  return '/student/dashboard'
}

export function formatDate(value) {
  return value ? dayjs(value).format('DD MMM YYYY') : 'N/A'
}

export function formatDateTime(value) {
  return value ? dayjs(value).format('DD MMM YYYY, hh:mm A') : 'N/A'
}

export function currency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0))
}

export function statusTone(value) {
  const normalized = String(value ?? '').toLowerCase()

  if (['paid', 'present', 'complete', 'cleared', 'active'].includes(normalized)) {
    return 'status-success'
  }

  if (['partial', 'late', 'internal', 'pending'].includes(normalized)) {
    return 'status-warning'
  }

  if (['unpaid', 'absent', 'external', 'overdue', 'failed', 'inactive'].includes(normalized)) {
    return 'status-danger'
  }

  return 'status-neutral'
}
