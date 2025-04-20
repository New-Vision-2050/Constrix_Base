import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false,
      },
    ];
  },
  // Add cache busting for static assets
  generateBuildId: async () => {
    // Use environment variable if available, otherwise use timestamp
    return process.env.NEXT_PUBLIC_CACHE_BUST || `build-${Date.now()}`;
  },
  // Disable static optimization to ensure fresh builds
  experimental: {
    // This ensures that the server always re-renders pages
    optimizeCss: false
  },
  images: {
     domains: ['s3.constrix-nv.com','82.112.241.33'],
  },
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
