"use client";

import { useEffect } from 'react';

interface FontOptimizerProps {
  fonts?: string[];
}

export default function FontOptimizer({ 
  fonts = ['Inter', 'Cairo'] 
}: FontOptimizerProps) {
  useEffect(() => {
    // Preload critical fonts
    fonts.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = `/fonts/${font.toLowerCase()}.woff2`;
      document.head.appendChild(link);
    });

    // Font display optimization
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 100 900;
        font-display: swap;
        src: url('/fonts/inter.woff2') format('woff2');
      }
      
      @font-face {
        font-family: 'Cairo';
        font-style: normal;
        font-weight: 200 1000;
        font-display: swap;
        src: url('/fonts/cairo.woff2') format('woff2');
      }
    `;
    document.head.appendChild(style);
  }, [fonts]);

  return null;
}
