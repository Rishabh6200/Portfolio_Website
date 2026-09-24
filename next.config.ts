import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   serverExternalPackages: ["@prisma/orm-postgres", "pg"],
   turbopack: {
      root: process.cwd(),
   },
   images: {
      formats: ["image/avif", "image/webp"],
      qualities: [75, 80, 90],
      remotePatterns: [
         {
            protocol: "https",
            hostname: "**",
         },
         {
            protocol: "http",
            hostname: "**",
         },
      ],
   },
};

export default nextConfig;
