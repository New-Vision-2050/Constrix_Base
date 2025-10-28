// Server-side optimization utilities

export interface CacheConfig {
  maxAge?: number;
  staleWhileRevalidate?: number;
  mustRevalidate?: boolean;
}

/**
 * Generate cache headers for different types of content
 */
export function getCacheHeaders(type: 'static' | 'api' | 'page' | 'image', config?: CacheConfig): Record<string, string> {
  const defaultConfigs = {
    static: { maxAge: 31536000, mustRevalidate: false }, // 1 year
    image: { maxAge: 31536000, mustRevalidate: false }, // 1 year
    api: { maxAge: 300, staleWhileRevalidate: 60 }, // 5 minutes
    page: { maxAge: 3600, staleWhileRevalidate: 300 }, // 1 hour
  };

  const finalConfig = { ...defaultConfigs[type], ...config };
  
  let cacheControl = `public, max-age=${finalConfig.maxAge}`;
  
  if (finalConfig.staleWhileRevalidate) {
    cacheControl += `, stale-while-revalidate=${finalConfig.staleWhileRevalidate}`;
  }
  
  if (finalConfig.mustRevalidate) {
    cacheControl += ', must-revalidate';
  }
  
  if (type === 'static' || type === 'image') {
    cacheControl += ', immutable';
  }

  return {
    'Cache-Control': cacheControl,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'origin-when-cross-origin',
  };
}

/**
 * Compress response data
 */
export function shouldCompress(contentType: string): boolean {
  const compressibleTypes = [
    'text/',
    'application/json',
    'application/javascript',
    'application/xml',
    'image/svg+xml',
  ];
  
  return compressibleTypes.some(type => contentType.startsWith(type));
}

/**
 * Generate ETag for content
 */
export function generateETag(content: string | Buffer): string {
  const crypto = require('crypto');
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * Check if request is conditional and content hasn't changed
 */
export function isNotModified(
  requestHeaders: Record<string, string | string[] | undefined>,
  etag: string,
  lastModified?: Date
): boolean {
  const ifNoneMatch = requestHeaders['if-none-match'];
  const ifModifiedSince = requestHeaders['if-modified-since'];
  
  if (ifNoneMatch && ifNoneMatch === etag) {
    return true;
  }
  
  if (ifModifiedSince && lastModified) {
    const modifiedSince = new Date(ifModifiedSince as string);
    return lastModified <= modifiedSince;
  }
  
  return false;
}

/**
 * Optimize API response
 */
export function optimizeApiResponse<T>(
  data: T,
  options: {
    compress?: boolean;
    cache?: CacheConfig;
    etag?: boolean;
  } = {}
) {
  const { compress = true, cache, etag = true } = options;
  
  const response = {
    data,
    headers: {} as Record<string, string>,
  };
  
  // Add cache headers
  if (cache) {
    Object.assign(response.headers, getCacheHeaders('api', cache));
  }
  
  // Add ETag
  if (etag) {
    const content = JSON.stringify(data);
    response.headers['ETag'] = generateETag(content);
  }
  
  // Add compression hint
  if (compress) {
    response.headers['Content-Encoding'] = 'gzip';
  }
  
  return response;
}

/**
 * Database query optimization helpers
 */
export class QueryOptimizer {
  private static queryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  
  static async cacheQuery<T>(
    key: string,
    queryFn: () => Promise<T>,
    ttl: number = 300000 // 5 minutes
  ): Promise<T> {
    const cached = this.queryCache.get(key);
    
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    
    const data = await queryFn();
    this.queryCache.set(key, { data, timestamp: Date.now(), ttl });
    
    return data;
  }
  
  static clearCache(pattern?: string): void {
    if (pattern) {
      for (const key of this.queryCache.keys()) {
        if (key.includes(pattern)) {
          this.queryCache.delete(key);
        }
      }
    } else {
      this.queryCache.clear();
    }
  }
  
  static getStats() {
    return {
      size: this.queryCache.size,
      keys: Array.from(this.queryCache.keys()),
    };
  }
}

/**
 * Request rate limiting
 */
export class RateLimiter {
  private static requests = new Map<string, { count: number; resetTime: number }>();
  
  static isAllowed(
    identifier: string,
    limit: number = 100,
    windowMs: number = 60000 // 1 minute
  ): boolean {
    const now = Date.now();
    const request = this.requests.get(identifier);
    
    if (!request || now > request.resetTime) {
      this.requests.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (request.count >= limit) {
      return false;
    }
    
    request.count++;
    return true;
  }
  
  static getRemainingRequests(identifier: string, limit: number = 100): number {
    const request = this.requests.get(identifier);
    return request ? Math.max(0, limit - request.count) : limit;
  }
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private static metrics = new Map<string, number[]>();
  
  static startTimer(label: string): () => number {
    const start = process.hrtime.bigint();
    
    return () => {
      const end = process.hrtime.bigint();
      const duration = Number(end - start) / 1000000; // Convert to milliseconds
      
      if (!this.metrics.has(label)) {
        this.metrics.set(label, []);
      }
      
      const times = this.metrics.get(label)!;
      times.push(duration);
      
      // Keep only last 100 measurements
      if (times.length > 100) {
        times.shift();
      }
      
      return duration;
    };
  }
  
  static getStats(label: string) {
    const times = this.metrics.get(label) || [];
    
    if (times.length === 0) {
      return null;
    }
    
    const sorted = [...times].sort((a, b) => a - b);
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    
    return {
      count: times.length,
      avg: Math.round(avg * 100) / 100,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }
  
  static getAllStats() {
    const stats: Record<string, any> = {};
    
    for (const label of this.metrics.keys()) {
      stats[label] = this.getStats(label);
    }
    
    return stats;
  }
}
