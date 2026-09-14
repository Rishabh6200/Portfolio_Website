import type { MetadataRoute } from "next"
import { profileService } from "@/services"

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const profile = await profileService.getProfile()

  return {
    name: `${profile.name} — ${profile.role}`,
    short_name: profile.name || "Portfolio",
    description: profile.tagline || profile.bio || "Full-Stack & Systems Developer Portfolio",
    start_url: "/",
    display: "standalone",
    background_color: "#07090e",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
