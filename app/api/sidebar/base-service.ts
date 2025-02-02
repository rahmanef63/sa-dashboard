import { API_CONFIG, ApiResponse } from './config';

export abstract class BaseService<T> {
  protected cache: Map<string, { data: T; timestamp: number }> = new Map();
  
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
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }
    const result: ApiResponse<R> = await response.json();
    return result.data;
  }

  clearCache(): void {
    this.cache.clear();
  }
}
