import { MOCK_ADMIN_USER } from '@/shared/dev-tool/types';

export const API_CONFIG = {
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  CACHE_CONTROL: 'public, s-maxage=10, stale-while-revalidate=59',
  AUTH_COOKIE_NAME: 'auth-token',
  DEFAULT_PAGE_SIZE: 50,
  ENDPOINTS: {
    DASHBOARDS: '/api/sidebar/dashboards',
    MENU_ITEMS: '/api/sidebar/menu-items',
  },
  DEV: {
    MOCK_USER: MOCK_ADMIN_USER
  }
} as const;

// Shared response types
export interface ApiResponse<T> {
  data: T;
  timestamp: string;
  status: number;
}

export interface ApiError {
  error: string;
  timestamp: string;
  status: number;
}

// Shared utility functions
export const createApiResponse = <T>(data: T, status: number = 200): ApiResponse<T> => ({
  data,
  status,
  timestamp: new Date().toISOString()
});

export const createApiError = (message: string, status: number = 400): ApiError => ({
  error: message,
  status,
  timestamp: new Date().toISOString()
});
