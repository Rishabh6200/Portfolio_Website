"use client"

import { useState, useRef } from "react"
import { UploadCloud, Link as LinkIcon, X, Loader2, ImageIcon, Check, ExternalLink, RefreshCw } from "lucide-react"
import { uploadProjectMediaAction } from "../actions"
import { toast } from "sonner"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface MediaUploaderProps {
  value: string
  onChange: (url: string) => void
  label: string
  description?: string
  aspectRatio?: "video" | "square" | "wide"
}

export function MediaUploader({
  value,
  onChange,
  label,
  description,
  aspectRatio = "video",
}: MediaUploaderProps) {
  const [tab, setTab] = useState<"upload" | "url">("upload")
  const [isUploading, setIsUploading] = useState(false)
  const [urlInput, setUrlInput] = useState(value || "")
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const aspectClass =
    aspectRatio === "square"
      ? "h-40 w-40 aspect-square"
      : aspectRatio === "wide"
      ? "aspect-[21/9] max-w-sm w-full"
      : "aspect-video max-w-sm w-full"

  async function handleFileUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP, SVG)")
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadProjectMediaAction(formData)
      if (result.success && result.url) {
        onChange(result.url)
        setUrlInput(result.url)
        toast.success("Image uploaded to ImageKit successfully!")
      } else {
        toast.error(result.error || "Upload failed. You can paste an image URL instead.")
        setTab("url")
      }
    } catch {
      toast.error("An error occurred during upload. Try pasting the URL instead.")
      setTab("url")
    } finally {
      setIsUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  function handleUrlApply() {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      toast.success("Image URL applied")
    }
  }

  function handleClear() {
    onChange("")
    setUrlInput("")
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-sm font-medium text-foreground">{label}</Label>
          {description && (
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 text-xs"
          >
            <X className="h-3.5 w-3.5" />
            <span>Remove</span>
          </Button>
        )}
      </div>

      {value ? (
        <div className={`relative overflow-hidden rounded-xl border border-border bg-muted/20 ${aspectClass}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={label}
            className={`h-full w-full ${aspectRatio === "square" ? "object-contain p-2" : "object-cover"}`}
            onError={() => {
              toast.error("Image failed to load. Please verify the URL.")
            }}
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2 backdrop-blur-[2px]">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleClear}
              className="h-8 w-8 rounded-lg"
              title="Replace image"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "secondary", size: "icon", className: "h-8 w-8 rounded-lg" })}
              title="View full size"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card/60 p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={tab === "upload" ? "default" : "outline"}
              size="sm"
              onClick={() => setTab("upload")}
              className="gap-1.5"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload to ImageKit</span>
            </Button>
            <Button
              type="button"
              variant={tab === "url" ? "default" : "outline"}
              size="sm"
              onClick={() => setTab("url")}
              className="gap-1.5"
            >
              <LinkIcon className="h-4 w-4" />
              <span>Paste URL</span>
            </Button>
          </div>

          {tab === "upload" ? (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-foreground/30 bg-background/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file)
                }}
              />
              <div className="flex flex-col items-center justify-center gap-2.5">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  {isUploading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <ImageIcon className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {isUploading ? "Uploading file directly to ImageKit CDN..." : "Click to select or drag & drop image"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, WebP, or SVG up to 10MB
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://ik.imagekit.io/... or image link"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleUrlApply}
                size="default"
                className="gap-1.5"
              >
                <Check className="h-4 w-4" />
                <span>Apply URL</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
