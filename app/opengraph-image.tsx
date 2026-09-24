import { ImageResponse } from "next/og"
import fs from "fs"
import path from "path"
import { profileQueries } from "@/features/profile/db/queries"

export const runtime = "nodejs"

export const alt = "Developer Portfolio"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function OpenGraphImage() {
  const profile = await profileQueries.getProfile()
  const initial = profile.name ? profile.name.charAt(0).toUpperCase() : "R"

  let logoBase64 = ""
  try {
    const logoBuffer = fs.readFileSync(
      path.join(process.cwd(), "public", "android-chrome-512x512.png")
    )
    logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`
  } catch {
    // Fallback if file not found
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
          background: "#07090e",
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
            top: "-120px",
            right: "-120px",
            width: "650px",
            height: "650px",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.28) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-120px",
            left: "-120px",
            width: "550px",
            height: "550px",
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Top Header Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {logoBase64 ? (
            <img
              src={logoBase64}
              alt="Logo"
              width={44}
              height={44}
              style={{
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: "0 6px 20px rgba(99, 102, 241, 0.4)",
              }}
            />
          ) : (
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                fontWeight: 800,
                boxShadow: "0 6px 20px rgba(99, 102, 241, 0.4)",
              }}
            >
              {initial}
            </div>
          )}
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
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#34d399",
                boxShadow: "0 0 8px rgba(52, 211, 153, 0.8)",
              }}
            />
            <span>{profile.status || "Open for Work"}</span>
          </div>
        </div>

        {/* Center Content Row: Left Bio & Right Emblem */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "760px",
            }}
          >
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
              {profile.name}
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "#818cf8",
              }}
            >
              {profile.role}
            </div>
            <div
              style={{
                fontSize: "19px",
                color: "#94a3b8",
                lineHeight: 1.5,
              }}
            >
              {profile.tagline || profile.bio}
            </div>
          </div>

          {logoBase64 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "170px",
                height: "170px",
                borderRadius: "36px",
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(6, 182, 212, 0.15) 100%)",
                border: "2px solid rgba(255, 255, 255, 0.16)",
                boxShadow: "0 20px 60px rgba(99, 102, 241, 0.35)",
                overflow: "hidden",
              }}
            >
              <img
                src={logoBase64}
                alt="Brand Emblem"
                width={170}
                height={170}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          )}
        </div>

        {/* Footer Tech Chips */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {["Next.js", "React 19", "TypeScript", "NestJS", "Prisma", "PostgreSQL"].map(
            (tech) => (
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
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
