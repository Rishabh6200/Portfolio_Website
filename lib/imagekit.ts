import ImageKit from "imagekit"

export function isImageKitConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY &&
    process.env.IMAGEKIT_PRIVATE_KEY &&
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
  )
}

export const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""

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

let imagekitInstance: ImageKit | null = null

export function getImageKit(): ImageKit {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
  const endpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT

  if (!publicKey || !privateKey || !endpoint) {
    throw new Error(
      "ImageKit is not configured. Please set NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT."
    )
  }

  if (!imagekitInstance) {
    imagekitInstance = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint: endpoint,
    })
  }

  return imagekitInstance
}

/**
 * Lazy proxy to ImageKit client. Avoids throwing at module evaluation time
 * during static page data collection (e.g. Next.js /_not-found) on Vercel builds.
 */
export const imagekit = new Proxy({} as ImageKit, {
  get(_target, prop: string | symbol) {
    const instance = getImageKit()
    const val = Reflect.get(instance, prop)
    if (typeof val === "function") {
      return val.bind(instance)
    }
    return val
  },
})

