import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.siteapi.org",
      },
    ],
  },
};

export default nextConfig;
