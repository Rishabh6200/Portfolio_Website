export { cn } from "cn"

export function slugify(text: string): string {
   return (text || "")
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "")
}


export function generateGalleryItemId(): string {
   return `gallery_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 9)}`
}

export function getMediaUrl(keyOrUrl?: string | null): string {
   if (!keyOrUrl) return ""
   if (
      keyOrUrl.startsWith("http://") ||
      keyOrUrl.startsWith("https://") ||
      keyOrUrl.startsWith("blob:") ||
      keyOrUrl.startsWith("data:")
   ) {
      return keyOrUrl
   }

   const baseUrl =
      process.env.NEXT_PUBLIC_S3_URL ||
      (process.env.S3_ENDPOINT && process.env.S3_BUCKET
         ? `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}`
         : "")

   if (!baseUrl) {
      return keyOrUrl.startsWith("/") ? keyOrUrl : `/${keyOrUrl}`
   }

   return `${baseUrl.replace(/\/+$/, "")}/${keyOrUrl.replace(/^\/+/, "")}`
}