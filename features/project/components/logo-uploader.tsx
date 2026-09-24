"use client"

import { FC, useState } from "react"
import { Camera, Loader2, Upload, X } from "lucide-react"
import { cn, getMediaUrl } from "@/lib/utils"
import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { uploadMediaToS3 } from "@/lib/upload"

export interface LogoUploaderProps {
   value?: string
   onChange: (url: string) => void
   name?: string
   className?: string
   disabled?: boolean
   projectSlug?: string
   onRequireTitle?: () => void
}

const LogoUploader: FC<LogoUploaderProps> = ({
   value = "",
   onChange,
   name = "logo",
   className,
   disabled = false,
   projectSlug = "",
   onRequireTitle,
}) => {
   const [isDragging, setIsDragging] = useState(false)
   const [isUploading, setIsUploading] = useState(false)
   const [uploadProgress, setUploadProgress] = useState(0)
   const [previewUrl, setPreviewUrl] = useState<string | null>(null)

   const handleFile = async (file?: File) => {
      if (!file) return

      // Validate project title/slug presence
      if (!projectSlug?.trim()) {
         if (onRequireTitle) {
            onRequireTitle()
         } else {
            toast.add({
               type: "warning",
               title: "Project Title Required",
               description: "Please enter a project title before uploading a logo.",
            })
         }
         return
      }

      if (!file.type.startsWith("image/")) {
         return toast.add({
            type: "error",
            description: "Only image files (PNG, JPG, SVG, WebP) are allowed.",
         })
      }

      if (file.size > 5 * 1024 * 1024) {
         return toast.add({
            type: "error",
            description: "Image exceeds 5MB limit.",
         })
      }

      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)
      setIsUploading(true)
      setUploadProgress(0)

      try {
         const folder = `projects/${projectSlug.trim().toLowerCase()}/logos`
         const { key } = await uploadMediaToS3(file, {
            folder,
            onProgress: (pct) => setUploadProgress(pct),
         })

         onChange(key)
         setPreviewUrl(null)
         toast.add({
            type: "success",
            description: "Logo uploaded successfully.",
         })
      } catch (err: unknown) {
         setPreviewUrl(null)
         const message = err instanceof Error ? err.message : "Failed to upload logo"
         toast.add({
            type: "error",
            title: "Upload Failed",
            description: message,
         })
      } finally {
         setIsUploading(false)
         URL.revokeObjectURL(objectUrl)
      }
   }

   const currentDisplayUrl = previewUrl || (value ? getMediaUrl(value) : "")
   const isDisabled = disabled || isUploading

   return (
      <div className={cn("relative select-none", className)}>
         {name && <input type="hidden" name={name} value={value} />}

         <label
            onDragOver={(e) => {
               e.preventDefault()
               if (!isDisabled) setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
               e.preventDefault()
               setIsDragging(false)
               if (!isDisabled) handleFile(e.dataTransfer.files?.[0])
            }}
            className={cn(
               "group relative flex flex-col items-center justify-center w-full h-full aspect-square rounded-2xl transition-all overflow-hidden select-none",
               isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
               currentDisplayUrl
                  ? "border border-border bg-card/80 hover:border-primary/60 shadow-xs"
                  : "border-2 border-dashed border-border/80 bg-muted/20 hover:border-primary/60 hover:bg-muted/40",
               isDragging && "border-primary bg-primary/10 ring-2 ring-primary/20 scale-[0.99]"
            )}
         >
            <input
               type="file"
               accept="image/png,image/jpeg,image/webp,image/svg+xml"
               disabled={isDisabled}
               className="hidden"
               onChange={(e) => {
                  handleFile(e.target.files?.[0])
                  e.target.value = ""
               }}
            />

            {currentDisplayUrl ? (
               <>
                  <Image
                     src={currentDisplayUrl}
                     alt="Logo"
                     fill
                     unoptimized={Boolean(previewUrl)}
                     className="object-contain p-2.5 transition-transform group-hover:scale-105"
                  />
                  {isUploading ? (
                     <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white backdrop-blur-[2px] z-10">
                        <Loader2 className="size-6 animate-spin text-primary" />
                        <span className="text-[11px] font-medium mt-2">
                           {uploadProgress > 0 ? `${uploadProgress}%` : "Uploading..."}
                        </span>
                     </div>
                  ) : (
                     <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-[1px]">
                        <Camera className="size-5" />
                        <span className="text-[11px] font-medium mt-1">Change Logo</span>
                     </div>
                  )}
               </>
            ) : isUploading ? (
               <div className="flex flex-col items-center justify-center p-2 text-center text-muted-foreground">
                  <Loader2 className="size-6 animate-spin text-primary" />
                  <span className="text-xs font-semibold text-foreground mt-2">
                     {uploadProgress > 0 ? `Uploading (${uploadProgress}%)` : "Uploading..."}
                  </span>
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center p-2 text-center text-muted-foreground group-hover:text-primary transition-colors">
                  <Upload className="size-5.5 text-muted-foreground/70 group-hover:text-primary stroke-2 transition-colors" />
                  <span className="text-xs font-semibold text-foreground/85 group-hover:text-foreground mt-1.5">
                     Upload Logo
                  </span>
               </div>
            )}
         </label>

         {value && !isDisabled && (
            <Button
               variant="destructive"
               size="icon-sm"
               className="absolute -top-1 -right-1 z-10"
               onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onChange("")
               }}
            >
               <X />
            </Button>
         )}
      </div>
   )
}

export default LogoUploader