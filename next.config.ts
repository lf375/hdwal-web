import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.hdwal.com",
      },
    ],
  },
};

export default nextConfig;
