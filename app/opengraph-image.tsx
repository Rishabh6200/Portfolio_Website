import { ImageResponse } from "next/og"

export const runtime = "nodejs"

export const alt = "Rishabh — Full-Stack & Systems Developer"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#080c14",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient Gradient Glow */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-100px",
            width: "500px",
            height: "500px",
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Top Header Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: 800,
              boxShadow: "0 8px 24px rgba(99, 102, 241, 0.4)",
            }}
          >
            R
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "9999px",
              background: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              fontSize: "14px",
              color: "#34d399",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            ● Available for high-impact roles
          </div>
        </div>

        {/* Center Title & Tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              background: "linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Rishabh
          </div>
          <div
            style={{
              fontSize: "30px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: "#818cf8",
            }}
          >
            Full-Stack & Systems Developer
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#94a3b8",
              maxWidth: "850px",
              lineHeight: 1.5,
            }}
          >
            High-throughput distributed architectures, resilient cloud backends, and pixel-precise interactive web experiences.
          </div>
        </div>

        {/* Footer Tech Chips */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {["Next.js", "React 19", "TypeScript", "Go", "Docker", "Distributed Systems"].map((tech) => (
            <div
              key={tech}
              style={{
                padding: "8px 18px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#e2e8f0",
                fontSize: "15px",
                fontFamily: "monospace",
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
