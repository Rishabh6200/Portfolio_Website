import type { NextConfig } from "next"
import path from "path"

const nextConfig: NextConfig = {
    turbopack: {
        root: path.join(__dirname)
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "6mb",
        },
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
}

export default nextConfig
