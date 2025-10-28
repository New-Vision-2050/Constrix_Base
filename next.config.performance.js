/** @type {import('next').NextConfig} */
const nextConfig = {
  // تحسين الأداء
  compress: true,
  
  // تحسين الصور
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // سنة واحدة
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // تحسين البناء
  experimental: {
    optimizeCss: true,
    optimizeServerReact: true,
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // تحسين Webpack
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // تقليل حجم الحزم
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // فصل مكتبات الطرف الثالث
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              maxSize: 244000, // 244KB
            },
            // فصل مكونات UI
            ui: {
              test: /[\\/]components[\\/]ui[\\/]/,
              name: 'ui-components',
              chunks: 'all',
              priority: 10,
            },
            // فصل الـ modules
            modules: {
              test: /[\\/]modules[\\/]/,
              name: 'app-modules',
              chunks: 'all',
              priority: 5,
            },
            // فصل الـ icons
            icons: {
              test: /[\\/]node_modules[\\/](@?react-icons|lucide-react|@radix-ui\/react-icons)[\\/]/,
              name: 'icons',
              chunks: 'all',
              priority: 15,
            },
            // فصل مكتبات التاريخ
            date: {
              test: /[\\/]node_modules[\\/](date-fns|moment|dayjs)[\\/]/,
              name: 'date-libs',
              chunks: 'all',
              priority: 12,
            },
            // فصل مكتبات الخرائط
            maps: {
              test: /[\\/]node_modules[\\/](leaflet|mapbox|@mapbox)[\\/]/,
              name: 'maps',
              chunks: 'all',
              priority: 12,
            },
          },
        },
      };
      
      // إزالة console.log في الإنتاج
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production'),
        })
      );
      
      // تحسين Tree Shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
    }
    
    // تحسين استيراد المكتبات
    config.resolve.alias = {
      ...config.resolve.alias,
      // استخدام النسخة المحسنة من lodash
      'lodash': 'lodash-es',
      // استخدام النسخة المحسنة من moment
      'moment': 'dayjs',
    };
    
    return config;
  },
  
  // Headers للتحسين
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      // Cache للموارد الثابتة
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache للصور
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // تحسين الخطوط
  optimizeFonts: true,
  
  // تحسين الـ CSS
  experimental: {
    ...nextConfig.experimental,
    optimizeCss: true,
  },
};

module.exports = nextConfig;
