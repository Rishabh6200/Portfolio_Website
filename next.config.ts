import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   turbopack: {
      root: process.cwd(),
   },
   images: {
      formats: ["image/avif", "image/webp"],
      qualities: [75, 80, 90],
      remotePatterns: [
         {
            protocol: "https",
            hostname: "cdn.imrishabh.me",
         }
      ],
   },
};

export default nextConfig;
