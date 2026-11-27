import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
