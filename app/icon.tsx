import { ImageResponse } from "next/og"

export const size = {
  width: 32,
  height: 32,
}
export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse((
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
        color: "#ffffff",
        borderRadius: "8px",
        fontWeight: 800,
        fontSize: 18,
        fontFamily: "system-ui, -apple-system, sans-serif",
        boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.4)",
      }}
    >
      R
    </div>
  ),
    {
      ...size,
    }
  )
}
