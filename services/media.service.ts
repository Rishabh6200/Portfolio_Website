import {
  imagekit,
  isImageKitConfigured,
  getImageKitRootDir,
  getImageKitProjectFolder,
} from "@/lib/imagekit"

export interface UploadOptions {
  folder?: string
  tags?: string[]
  useUniqueFileName?: boolean
}

export interface UploadResult {
  url: string
  fileId: string
  name: string
  thumbnailUrl?: string
}

export class MediaService {
  /**
   * Check if ImageKit API credentials are configured.
   */
  isConfigured(): boolean {
    return isImageKitConfigured()
  }

  /**
   * Upload an image buffer or base64 string to ImageKit.
   */
  async upload(
    fileBase64OrBuffer: string | Buffer,
    fileName: string,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    if (!this.isConfigured()) {
      throw new Error(
        "ImageKit credentials are not configured. Please add NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT to .env.local"
      )
    }

    const folder = options.folder || getImageKitProjectFolder()
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_")

    const response = await imagekit.upload({
      file: fileBase64OrBuffer,
      fileName: sanitizedName,
      folder,
      tags: options.tags,
      useUniqueFileName: options.useUniqueFileName ?? false,
    })

    return {
      url: response.url,
      fileId: response.fileId,
      name: response.name,
      thumbnailUrl: response.thumbnailUrl,
    }
  }

  /**
   * Delete a file directly by its ImageKit fileId.
   */
  async deleteById(fileId: string): Promise<boolean> {
    if (!this.isConfigured() || !fileId) return false
    try {
      await imagekit.deleteFile(fileId)
      return true
    } catch (err) {
      console.error(`MediaService: Failed to delete file by ID "${fileId}":`, err)
      return false
    }
  }

  /**
   * Delete an entire folder and all nested assets in ImageKit.
   * e.g. folderPath: "/projects/my-project-slug"
   */
  async deleteFolder(folderPath: string): Promise<boolean> {
    if (!this.isConfigured() || !folderPath) return false
    try {
      const cleanPath = folderPath.startsWith("/") ? folderPath : `/${folderPath}`
      await imagekit.deleteFolder(cleanPath)
      return true
    } catch (err) {
      console.error(`MediaService: Failed to delete folder "${folderPath}":`, err)
      return false
    }
  }

  /**
   * Delete a file from ImageKit given its full CDN URL.
   * Extracts filename, locates the fileId, and triggers removal.
   */
  async deleteByUrl(url: string, folder?: string): Promise<boolean> {
    if (!this.isConfigured() || !url) return false

    try {
      const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""
      if (!url.includes("ik.imagekit.io") && (!urlEndpoint || !url.includes(urlEndpoint))) {
        return false
      }

      const urlObj = new URL(url)
      const rawFileName = urlObj.pathname.substring(urlObj.pathname.lastIndexOf("/") + 1)
      const fileName = decodeURIComponent(rawFileName)
      if (!fileName) return false

      // Search for file by name (optionally filtered by folder if provided)
      const files = await imagekit.listFiles({
        name: fileName,
        ...(folder ? { path: folder } : {}),
        limit: 10,
      })

      if (Array.isArray(files)) {
        const match = files.find(
          (f) => "fileId" in f && (f.name === fileName || f.filePath.endsWith(fileName))
        )
        if (match && "fileId" in match) {
          await imagekit.deleteFile(match.fileId)
          return true
        }
      }
    } catch (err) {
      console.error(`MediaService: Error deleting file by URL "${url}":`, err)
    }

    return false
  }

  /**
   * Delete multiple media assets given an array of URLs.
   */
  async deleteMultipleByUrls(
    urls: (string | undefined | null)[],
    folder?: string
  ): Promise<{ deletedCount: number }> {
    if (!this.isConfigured() || !urls || urls.length === 0) {
      return { deletedCount: 0 }
    }

    const validUrls = Array.from(
      new Set(urls.filter((u): u is string => Boolean(u && typeof u === "string")))
    )
    let deletedCount = 0

    for (const url of validUrls) {
      const success = await this.deleteByUrl(url, folder)
      if (success) deletedCount++
    }

    return { deletedCount }
  }

  /**
   * List files in ImageKit folder.
   */
  async listFiles(options: { path?: string; limit?: number; name?: string } = {}) {
    if (!this.isConfigured()) return []
    try {
      const res = await imagekit.listFiles({
        path: options.path || getImageKitRootDir(),
        limit: options.limit || 50,
        name: options.name,
      })
      return Array.isArray(res) ? res : []
    } catch (err) {
      console.error("MediaService: Error listing files:", err)
      return []
    }
  }
}

export const mediaService = new MediaService()
