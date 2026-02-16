import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://core-be-dev.constrix-hr-nv.com/api/v1/:path*'
      }
    ]
  },
  // Add cache busting for static assets
  generateBuildId: async () => {
    // Use environment variable if available, otherwise use timestamp
    return process.env.NEXT_PUBLIC_CACHE_BUST || `build-${Date.now()}`;
  },
  // Disable static optimization to ensure fresh builds
  // experimental: {
  //   // This ensures that the server always re-renders pages
  //   optimizeCss: false
  // },
  // images: {
  //    domains: ['constrix.fra1.digitaloceanspaces.com'],
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'constrix.fra1.digitaloceanspaces.com',
        port: '',
        pathname: '/**/**',
        search: '',
      },
    ],
  },
   output: 'standalone',
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
