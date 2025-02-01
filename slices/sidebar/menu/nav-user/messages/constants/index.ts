export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file'
} as const

export const MESSAGE_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read'
} as const

export const MAX_MESSAGE_LENGTH = 1000
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
