"use client";

import { useEffect } from 'react';
// import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

interface WebVitalsOptimizerProps {
  debug?: boolean;
}

export default function WebVitalsOptimizer({ debug = false }: WebVitalsOptimizerProps) {
  useEffect(() => {
    // تحسين FCP (First Contentful Paint)
    const optimizeFCP = () => {
      // Preload critical resources
      const criticalResources = [
        '/fonts/inter.woff2',
        '/fonts/cairo.woff2',
        '/_next/static/css/app.css'
      ];

      criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource;
        link.as = resource.includes('.woff2') ? 'font' : 'style';
        if (resource.includes('.woff2')) {
          link.type = 'font/woff2';
          link.crossOrigin = 'anonymous';
        }
        document.head.appendChild(link);
      });
    };

    // تحسين LCP (Largest Contentful Paint)
    const optimizeLCP = () => {
      // Preload hero images
      const heroImages = document.querySelectorAll('img[data-priority="true"]');
      heroImages.forEach(img => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = (img as HTMLImageElement).src;
        link.as = 'image';
        document.head.appendChild(link);
      });
    };

    // تحسين CLS (Cumulative Layout Shift)
    const optimizeCLS = () => {
      // إضافة أبعاد للصور التي لا تحتوي على أبعاد
      const images = document.querySelectorAll('img:not([width]):not([height])');
      images.forEach(img => {
        const imageElement = img as HTMLImageElement;
        // تعيين أبعاد افتراضية لمنع layout shift
        if (!imageElement.style.aspectRatio) {
          imageElement.style.aspectRatio = '16/9';
        }
      });

      // إضافة skeleton loaders للمحتوى الديناميكي
      const dynamicContent = document.querySelectorAll('[data-loading="true"]');
      dynamicContent.forEach(element => {
        element.classList.add('animate-pulse', 'bg-gray-200');
      });
    };

    // تحسين FID (First Input Delay)
    const optimizeFID = () => {
      // تأجيل تحميل الـ scripts غير الضرورية
      const deferredScripts = [
        'analytics',
        'chat-widget',
        'social-media'
      ];

      deferredScripts.forEach(scriptType => {
        const scripts = document.querySelectorAll(`script[data-type="${scriptType}"]`);
        scripts.forEach(script => {
          script.setAttribute('defer', 'true');
        });
      });
    };

    // تطبيق التحسينات
    optimizeFCP();
    optimizeLCP();
    optimizeCLS();
    optimizeFID();

    // مراقبة Web Vitals إذا كان في وضع التطوير
    if (debug) {
      console.log('Web Vitals monitoring enabled');
      // getCLS(console.log);
      // getFID(console.log);
      // getFCP(console.log);
      // getLCP(console.log);
      // getTTFB(console.log);
    }

    // تحسين الـ loading للصور
    const observeImages = () => {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    };

    // تطبيق lazy loading للصور
    setTimeout(observeImages, 100);

  }, [debug]);

  return null;
}
