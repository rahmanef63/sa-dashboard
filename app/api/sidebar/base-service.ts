// app/api/sidebar/base-service.ts
import { API_CONFIG, ApiResponse } from './config';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export abstract class BaseService<T> {
  protected cache: Map<string, CacheItem<T>> = new Map();
  
  constructor(protected readonly endpoint: string) {}

  protected isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < API_CONFIG.CACHE_TTL;
  }

  protected getCached(key: string): T | null {
    if (this.isCacheValid(key)) {
      console.log('[Debug] Using cached data for:', key);
      return this.cache.get(key)!.data;
    }
    return null;
  }

  protected setCache(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  protected async handleResponse<R>(response: Response): Promise<R> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || response.statusText);
    }

    try {
      const text = await response.text();
      console.log('[BaseService] Raw response text:', text);

      // Handle empty response
      if (!text) {
        console.error('[BaseService] Empty response received');
        throw new Error('Empty response received from server');
      }

      // Parse JSON
      const result = JSON.parse(text);
      console.log('[BaseService] Parsed response:', result);

      // Check if the response has the expected structure
      if (!result || typeof result !== 'object') {
        console.error('[BaseService] Invalid API response - not an object:', result);
        throw new Error('Invalid API response structure - not an object');
      }

      // If the response is wrapped in a data property, extract it
      if ('data' in result) {
        const data = result.data;
        console.log('[BaseService] Extracted data from response:', data);
        return data;
      }

      // If the response is already the data we need, return it directly
      console.log('[BaseService] Using direct response:', result);
      return result as R;
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('[BaseService] Invalid JSON response:', error);
        throw new Error('Invalid JSON response from server');
      }
      console.error('[BaseService] Error handling response:', error);
      throw error;
    }
  }

  clearCache(key: string): void {
    this.cache.delete(key);
  }
}
