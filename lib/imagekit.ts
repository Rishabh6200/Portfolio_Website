import ImageKit from "imagekit"

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || ""
export const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""

export function isImageKitConfigured(): boolean {
  return Boolean(publicKey && privateKey && urlEndpoint)
}

/**
 * Returns the configured root directory in ImageKit from IMAGEKIT_ROOT_DIR env variable.
 * Defaults to "portfolio-site" if not set.
 */
export function getImageKitRootDir(): string {
  const raw = process.env.IMAGEKIT_ROOT_DIR || "portfolio-site"
  const clean = raw.trim().replace(/^\/+|\/+$/g, "")
  return clean || "portfolio-site"
}

/**
 * Returns the folder path for a project under the configured root directory.
 * e.g. "/portfolio-site/projects/my-slug"
 */
export function getImageKitProjectFolder(slug?: string): string {
  const root = getImageKitRootDir()
  if (!slug) {
    return root.endsWith("projects") ? `/${root}` : `/${root}/projects`
  }

  const cleanSlug = slug
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")

  if (root.endsWith("projects")) {
    return `/${root}/${cleanSlug}`
  }
  return `/${root}/projects/${cleanSlug}`
}

export const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
})
