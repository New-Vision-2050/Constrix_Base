import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login", // Change this
        permanent: false, // `true` for 301, `false` for 302
      },
    ];
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_API_PATH: process.env.NEXT_PUBLIC_API_PATH,
    NEXT_PUBLIC_API_VERSION: process.env.NEXT_PUBLIC_API_VERSION,
  },
};

export default nextConfig;
