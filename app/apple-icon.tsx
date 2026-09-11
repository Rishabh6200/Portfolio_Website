import { ImageResponse } from "next/og"

import { profileService } from "@/services"

export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

export default async function AppleIcon() {
  const profile = await profileService.getProfile()
  const initial = profile.name ? profile.name.charAt(0).toUpperCase() : "R"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4f46e5 0%, #0b0f19 100%)",
          color: "#ffffff",
          borderRadius: "42px",
          fontWeight: 800,
          fontSize: 104,
          fontFamily: "system-ui, -apple-system, sans-serif",
          border: "2px solid rgba(255, 255, 255, 0.15)",
        }}
      >
        {initial}
      </div>
    ),
    {
      ...size,
    }
  )
}
