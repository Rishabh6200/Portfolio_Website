import ImageKit from "imagekit"

const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || ""
const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""

export function isImageKitConfigured(): boolean {
  return Boolean(publicKey && privateKey && urlEndpoint)
}

export const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
})

export async function uploadToImageKit(
  fileBase64OrBuffer: string | Buffer,
  fileName: string,
  folder: string = "/portfolio/projects"
): Promise<{ url: string; fileId: string }> {
  if (!isImageKitConfigured()) {
    throw new Error(
      "ImageKit credentials are not configured. Please add NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT to .env.local"
    )
  }

  const response = await imagekit.upload({
    file: fileBase64OrBuffer,
    fileName,
    folder,
  })

  return {
    url: response.url,
    fileId: response.fileId,
  }
}
