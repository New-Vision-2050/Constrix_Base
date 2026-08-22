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

  // Apryse WebViewer runs inside its own iframe served from /webviewer.
  // These headers enable WASM threading (cross-origin isolation) for that
  // iframe only, and tell the browser the pre-compressed .br/.gz wasm
  // assets are already encoded so it can decode them correctly.
  // https://docs.apryse.com/documentation/web/faq/wasm-threads
  // https://docs.apryse.com/documentation/web/faq/content-encoding
  async headers() {
    return [
      {
        // Site-wide cross-origin isolation so any page embedding WebViewer
        // qualifies for WASM threads. "credentialless" (instead of
        // "require-corp") avoids hard-blocking cross-origin <img>/<script>
        // resources (e.g. S3 images, Google Maps) that lack a CORP header.
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
        ],
      },
      {
        source: "/webviewer/:path*.br.wasm",
        headers: [
          { key: "Content-Encoding", value: "br" },
          { key: "Content-Type", value: "application/wasm" },
        ],
      },
      {
        source: "/webviewer/:path*.gz.wasm",
        headers: [
          { key: "Content-Encoding", value: "gzip" },
          { key: "Content-Type", value: "application/wasm" },
        ],
      },
    ];
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
