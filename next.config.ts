import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "imagedelivery.net"
      },
      {
        hostname: "ddi-cdn.deepsearch.com"
      }
    ]
  }
};

export default nextConfig;
