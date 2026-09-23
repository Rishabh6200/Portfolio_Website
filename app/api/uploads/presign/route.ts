import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { storage } from "@/lib/s3"

const ALLOWED_CONTENT_TYPES = [
   "image/jpeg",
   "image/png",
   "image/webp",
   "image/svg+xml",
   "image/gif",
   "image/avif",
]

export async function POST(request: Request) {
   try {
      const { filename, contentType, folder = "uploads" } = await request.json()

      if (!filename || !contentType) {
         return NextResponse.json(
            {
               error: "filename and contentType are required",
            },
            { status: 400 },
         )
      }

      if (!ALLOWED_CONTENT_TYPES.includes(contentType.toLowerCase())) {
         return NextResponse.json(
            {
               error: "Unsupported file type. Allowed formats: PNG, JPG, WebP, SVG, GIF, AVIF.",
            },
            { status: 400 },
         )
      }

      const extension = filename.includes(".")
         ? `.${filename.split(".").pop()?.toLowerCase()}`
         : ""

      // Sanitize folder path: only allow lowercase alphanumerics, hyphens, and underscores per segment
      const cleanFolder =
         (typeof folder === "string" ? folder : "uploads")
            .split("/")
            .map((seg) => seg.trim().toLowerCase().replace(/[^a-z0-9-_]/g, ""))
            .filter(Boolean)
            .join("/") || "uploads"

      const key = `${cleanFolder}/${randomUUID()}${extension}`

      const uploadUrl = await storage.getSignedUploadUrl(key, contentType, 60)
      const publicUrl = storage.getPublicUrl(key)

      return NextResponse.json({
         uploadUrl,
         publicUrl,
         key,
      })
   } catch (error) {
      console.error("Storage presign error:", error)

      return NextResponse.json(
         {
            error: "Failed to generate upload URL",
         },
         { status: 500 },
      )
   }
}