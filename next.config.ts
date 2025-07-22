import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [ process.env.CDN_URL! ]
  }
};

export default nextConfig;
