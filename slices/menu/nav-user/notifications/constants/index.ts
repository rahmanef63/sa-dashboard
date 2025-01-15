export const NOTIFICATION_TYPES = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  SUCCESS: 'success'
} as const

export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const

export const MAX_NOTIFICATIONS = 100
export const NOTIFICATION_CLEANUP_DAYS = 30
