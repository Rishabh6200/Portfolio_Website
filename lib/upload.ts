export interface UploadOptions {
   folder?: string
   onProgress?: (percent: number) => void
   signal?: AbortSignal
}

export interface UploadResult {
   url: string
   key: string
}

export async function uploadMediaToS3(file: File, options: UploadOptions = {}): Promise<UploadResult> {
   const { folder = "uploads", onProgress, signal } = options

   const res = await fetch("/api/uploads/presign", {
      method: "POST",
      headers: {
         "Content-Type": "application/json",
      },
      body: JSON.stringify({
         filename: file.name,
         contentType: file.type || "application/octet-stream",
         folder,
      }),
      signal,
   })

   if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || "Failed to generate upload URL")
   }

   const { uploadUrl, publicUrl, key } = (await res.json()) as {
      uploadUrl: string
      publicUrl: string
      key: string
   }

   return new Promise<UploadResult>((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      if (signal) {
         signal.addEventListener("abort", () => {
            xhr.abort()
            reject(new DOMException("Upload aborted", "AbortError"))
         })
      }

      xhr.upload.onprogress = (event) => {
         if (event.lengthComputable && onProgress) {
            const percent = Math.round((event.loaded / event.total) * 100)
            onProgress(percent)
         }
      }

      xhr.onload = () => {
         if (xhr.status >= 200 && xhr.status < 300) {
            if (onProgress) onProgress(100)
            resolve({
               url: publicUrl,
               key,
            })
         } else {
            reject(new Error(`S3 upload failed with status ${xhr.status}`))
         }
      }

      xhr.onerror = () => {
         reject(
            new Error(
               "Network error during upload to S3. Please verify S3 CORS settings."
            )
         )
      }

      xhr.ontimeout = () => {
         reject(new Error("File upload timed out"))
      }

      xhr.open("PUT", uploadUrl, true)
      xhr.setRequestHeader("Content-Type", file.type)
      xhr.send(file)
   })
}
