export const ACCEPTED_FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  VIDEO: ['video/mp4', 'video/quicktime', 'video/webm'],
  DOCUMENT: ['application/pdf']
};

export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  VIDEO: 100 * 1024 * 1024, // 100MB
  DOCUMENT: 10 * 1024 * 1024 // 10MB
};

export const UPLOAD_STATES = {
  IDLE: 'IDLE',
  UPLOADING: 'UPLOADING',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR'
} as const;

export const MEDIA_FORMATS = {
  IMAGE: ['single', 'carousel', 'story'],
  VIDEO: ['single', 'carousel', 'story', 'reel']
} as const;