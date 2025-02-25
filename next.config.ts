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
};

export default nextConfig;
