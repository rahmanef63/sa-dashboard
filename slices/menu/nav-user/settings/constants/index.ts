export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' }
] as const

export const NOTIFICATION_CHANNELS = {
  EMAIL: 'email',
  PUSH: 'push',
  DESKTOP: 'desktop'
} as const
