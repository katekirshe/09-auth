import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        hostname: "ac.goit.global",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
