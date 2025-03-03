import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en/login", // Change this
        permanent: false, // `true` for 301, `false` for 302
      },
    ];
  },
};
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
