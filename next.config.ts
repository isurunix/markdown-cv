import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**'
      },
    ],
    minimumCacheTTL: 60,
    unoptimized: true, // Disable Next.js image optimization
  }
};

export default nextConfig;
