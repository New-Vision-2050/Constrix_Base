"use client";

import { useEffect, useCallback, useMemo } from 'react';

interface PerformanceConfig {
  enableLazyLoading?: boolean;
  enableImageOptimization?: boolean;
  enableCodeSplitting?: boolean;
  enableCaching?: boolean;
  debounceDelay?: number;
}

export function usePerformanceOptimization(config: PerformanceConfig = {}) {
  const {
    enableLazyLoading = true,
    enableImageOptimization = true,
    enableCodeSplitting = true,
    enableCaching = true,
    debounceDelay = 300
  } = config;

  // Debounce function للبحث والتفاعلات
  const debounce = useCallback(
    <T extends (...args: any[]) => any>(func: T, delay: number = debounceDelay) => {
      let timeoutId: NodeJS.Timeout;
      return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
      };
    },
    [debounceDelay]
  );

  // Throttle function للـ scroll events
  const throttle = useCallback(
    <T extends (...args: any[]) => any>(func: T, limit: number = 100) => {
      let inThrottle: boolean;
      return (...args: Parameters<T>) => {
        if (!inThrottle) {
          func.apply(null, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
        }
      };
    },
    []
  );

  // Lazy loading للمكونات
  const lazyLoadComponent = useCallback(
    (importFunc: () => Promise<any>) => {
      if (!enableCodeSplitting) return importFunc;
      
      return useMemo(() => {
        let componentPromise: Promise<any> | null = null;
        return () => {
          if (!componentPromise) {
            componentPromise = importFunc();
          }
          return componentPromise;
        };
      }, [importFunc]);
    },
    [enableCodeSplitting]
  );

  // تحسين الصور
  const optimizeImage = useCallback(
    (src: string, width?: number, height?: number, quality: number = 75) => {
      if (!enableImageOptimization) return src;
      
      // إذا كانت الصورة من Next.js Image Optimization
      if (src.startsWith('/_next/image')) return src;
      
      const params = new URLSearchParams();
      if (width) params.set('w', width.toString());
      if (height) params.set('h', height.toString());
      params.set('q', quality.toString());
      
      return `/_next/image?url=${encodeURIComponent(src)}&${params.toString()}`;
    },
    [enableImageOptimization]
  );

  // Cache للبيانات
  const cache = useMemo(() => {
    if (!enableCaching) return null;
    
    const storage = new Map<string, { data: any; timestamp: number; ttl: number }>();
    
    return {
      set: (key: string, data: any, ttl: number = 300000) => { // 5 minutes default
        storage.set(key, { data, timestamp: Date.now(), ttl });
      },
      get: (key: string) => {
        const item = storage.get(key);
        if (!item) return null;
        
        if (Date.now() - item.timestamp > item.ttl) {
          storage.delete(key);
          return null;
        }
        
        return item.data;
      },
      clear: () => storage.clear(),
      delete: (key: string) => storage.delete(key)
    };
  }, [enableCaching]);

  // تحسين الـ DOM operations
  const batchDOMUpdates = useCallback(
    (updates: (() => void)[]) => {
      requestAnimationFrame(() => {
        updates.forEach(update => update());
      });
    },
    []
  );

  // تحسين الـ event listeners
  const addOptimizedEventListener = useCallback(
    (element: Element | Window, event: string, handler: EventListener, options?: AddEventListenerOptions) => {
      const optimizedHandler = event === 'scroll' || event === 'resize' 
        ? throttle(handler as any, 100)
        : handler;
      
      element.addEventListener(event, optimizedHandler, { passive: true, ...options });
      
      return () => element.removeEventListener(event, optimizedHandler, options);
    },
    [throttle]
  );

  // تحسين الـ API calls
  const optimizedFetch = useCallback(
    async (url: string, options?: RequestInit) => {
      // استخدام cache إذا كان متاحاً
      if (cache && options?.method !== 'POST') {
        const cached = cache.get(url);
        if (cached) return cached;
      }
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Cache-Control': 'max-age=300',
          ...options?.headers
        }
      });
      
      const data = await response.json();
      
      // حفظ في الـ cache
      if (cache && response.ok && options?.method !== 'POST') {
        cache.set(url, data);
      }
      
      return data;
    },
    [cache]
  );

  // تطبيق التحسينات عند التحميل
  useEffect(() => {
    // تحسين الـ fonts
    if (enableImageOptimization) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = 'https://fonts.googleapis.com';
      document.head.appendChild(link);
    }

    // تحسين الـ prefetch للصفحات المهمة
    const prefetchPages = ['/dashboard', '/profile', '/settings'];
    prefetchPages.forEach(page => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = page;
      document.head.appendChild(link);
    });

  }, [enableImageOptimization]);

  return {
    debounce,
    throttle,
    lazyLoadComponent,
    optimizeImage,
    cache,
    batchDOMUpdates,
    addOptimizedEventListener,
    optimizedFetch
  };
}
