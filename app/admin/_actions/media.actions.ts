"use server"

import { randomUUID } from "crypto"
import { isAdminAuthenticated } from "@/lib/auth/session"
import { mediaService } from "@/services"
import { getImageKitProjectFolder } from "@/lib/imagekit"

/**
 * Universal media upload server action used across the admin dashboard.
 * - Routes to `/projects/{slug}/{uuid}.{ext}` when projectSlug is provided.
 * - Enforces that projectSlug is mandatory for project media.
 */
export async function uploadMediaAction(formData: FormData, targetFolder?: string) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    if (!mediaService.isConfigured()) {
      return {
        success: false,
        error:
          "ImageKit credentials are not configured. Please add NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT to .env.local, or use the 'Paste URL' tab.",
      }
    }

    const file = formData.get("file") as File | null
    if (!file) {
      return { success: false, error: "No file provided" }
    }

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Only image files (PNG, JPG, WebP, SVG) are allowed." }
    }

    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "File size exceeds 5MB limit." }
    }

    const projectSlug = (formData.get("projectSlug") as string)?.trim()
    let folder = targetFolder

    if (projectSlug) {
      folder = getImageKitProjectFolder(projectSlug)
    } else if (!folder) {
      return {
        success: false,
        error: "Please enter a Project Title or URL Slug above before uploading media.",
      }
    }

    // Generate unique UUID-based filename to prevent any naming collision
    const originalName = file.name || "image.png"
    const extMatch = originalName.match(/\.([a-zA-Z0-9]+)$/)
    const ext = extMatch ? extMatch[1].toLowerCase() : "webp"
    const uuidFileName = `${randomUUID()}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await mediaService.upload(buffer, uuidFileName, { folder })

    return {
      success: true,
      url: result.url,
      fileId: result.fileId,
      name: result.name,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload image"
    return { success: false, error: message }
  }
}

/**
 * Delete a single media file from ImageKit by its public URL.
 */
export async function deleteMediaAction(url: string, folder?: string) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    const success = await mediaService.deleteByUrl(url, folder)
    return { success }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete image"
    return { success: false, error: message }
  }
}

/**
 * Delete multiple media files from ImageKit given an array of URLs.
 */
export async function deleteMultipleMediaAction(urls: string[], folder?: string) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    const result = await mediaService.deleteMultipleByUrls(urls, folder)
    return { success: true, deletedCount: result.deletedCount }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete images"
    return { success: false, error: message }
  }
}

/**
 * Delete an entire project folder and all its media files in ImageKit.
 * e.g. /projects/{slug}
 */
export async function deleteProjectFolderAction(projectSlug: string) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    const folderPath = getImageKitProjectFolder(projectSlug)
    const success = await mediaService.deleteFolder(folderPath)
    return { success }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete project folder"
    return { success: false, error: message }
  }
}
