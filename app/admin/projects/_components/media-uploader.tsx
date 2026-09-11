"use client"

import { useState, useRef, useEffect } from "react"
import {
  UploadCloud,
  Link as LinkIcon,
  Loader2,
  ImageIcon,
  Check,
  ExternalLink,
  Trash2,
  Camera,
  AlertCircle,
} from "lucide-react"
import { uploadMediaAction, deleteMediaAction } from "@/app/admin/_actions/media.actions"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MediaUploaderProps {
  value: string
  onChange: (url: string) => void
  label?: string
  description?: string
  aspectRatio?: "video" | "square" | "wide"
  projectSlug?: string
}

export function MediaUploader({
  value,
  onChange,
  label = "Logo",
  projectSlug,
}: MediaUploaderProps) {
  const [mode, setMode] = useState<"file" | "url">("file")
  const [isUploading, setIsUploading] = useState(false)
  const [urlInput, setUrlInput] = useState(value || "")
  const [dragOver, setDragOver] = useState(false)
  const [imageLoadError, setImageLoadError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setImageLoadError(false)
  }, [value])

  const canUpload = Boolean(projectSlug && projectSlug.trim())

  async function handleFileUpload(file: File) {
    if (!canUpload) {
      toast.error("Please enter a Project Title or URL Slug above before uploading.")
      return
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP, SVG)")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size exceeds 5MB limit.")
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("projectSlug", projectSlug!.trim())

      const result = await uploadMediaAction(formData)
      if (result.success && result.url) {
        onChange(result.url)
        setUrlInput(result.url)
        toast.success("Logo uploaded successfully!")
      } else {
        toast.error(result.error || "Upload failed. You can paste an image URL instead.")
        setMode("url")
      }
    } catch {
      toast.error("An error occurred during upload. Try pasting the URL instead.")
      setMode("url")
    } finally {
      setIsUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (!canUpload) {
      toast.error("Please enter a Project Title or URL Slug above before uploading.")
      return
    }
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  function handleUrlApply() {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      toast.success("Logo URL applied!")
    }
  }

  async function handleClear() {
    const prevUrl = value
    onChange("")
    setUrlInput("")
    if (prevUrl && prevUrl.includes("ik.imagekit.io")) {
      deleteMediaAction(prevUrl).catch((err) => {
        console.error("Failed to delete cleared logo from ImageKit:", err)
      })
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setDragOver(false)
        }
      }}
      onDrop={handleDrop}
      className={`relative rounded-2xl border transition-all p-4 sm:p-5 ${
        dragOver
          ? "border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/20"
          : "border-border bg-card/60"
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

      {/* Drag Over Overlay Alert */}
      {dragOver && (
        <div className="absolute inset-0 z-20 rounded-2xl bg-background/80 backdrop-blur-xs border-2 border-dashed border-indigo-500 flex flex-col items-center justify-center gap-2 pointer-events-none">
          <UploadCloud className="h-8 w-8 text-indigo-500 animate-bounce" />
          <p className="text-sm font-semibold text-foreground">
            Drop image file here to upload logo
          </p>
          <p className="text-xs text-muted-foreground">PNG, JPG, WebP, or SVG</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
        {/* Left: Logo Preview Box (Square Icon Holder) */}
        <div
          onClick={() => {
            if (value) return
            if (!canUpload) {
              toast.error("Please enter a Project Title or URL Slug above before uploading.")
              return
            }
            fileInputRef.current?.click()
          }}
          className={`relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-2xl border-2 transition-all flex items-center justify-center overflow-hidden bg-muted/30 select-none ${
            value
              ? "border-border shadow-xs"
              : !canUpload
              ? "border-dashed border-border/60 opacity-60 cursor-not-allowed"
              : "border-dashed border-border hover:border-indigo-500/60 hover:bg-muted/50 cursor-pointer"
          }`}
          title={value ? "Project Logo" : canUpload ? "Click to select or drop image" : "Enter Project Title/Slug first"}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center gap-1.5 p-2 text-primary">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-[10px] font-medium text-muted-foreground">Uploading...</span>
            </div>
          ) : value && imageLoadError ? (
            <div className="flex flex-col items-center justify-center gap-1.5 text-center p-2 text-destructive">
              <AlertCircle className="h-6 w-6 text-amber-500" />
              <span className="text-[10px] font-medium text-muted-foreground leading-tight">
                Preview unavailable
              </span>
              <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 backdrop-blur-[2px]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
                  title="Replace logo"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClear()
                  }}
                  className="p-1.5 rounded-lg bg-destructive/80 text-white hover:bg-destructive transition-colors cursor-pointer"
                  title="Remove logo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : value ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt={label || "Logo preview"}
                className="h-full w-full object-contain p-2.5"
                onError={() => {
                  setImageLoadError(true)
                  toast.error("Failed to load logo image from URL")
                }}
              />
              {/* Hover overlay with action buttons */}
              <div className="absolute inset-0 bg-black/70 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 backdrop-blur-[2px]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
                  title="Replace logo"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-colors cursor-pointer"
                  title="View full size"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClear()
                  }}
                  className="p-1.5 rounded-lg bg-destructive/80 text-white hover:bg-destructive transition-colors cursor-pointer"
                  title="Remove logo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 text-muted-foreground p-2 text-center group">
              <div className="p-2 rounded-xl bg-muted/60 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all">
                <ImageIcon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">
                Drop Logo
              </span>
            </div>
          )}
        </div>

        {/* Right: Actions & Details */}
        <div className="flex-1 min-w-0 space-y-3">
          {mode === "file" ? (
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (!canUpload) {
                      toast.error("Please enter a Project Title or URL Slug above before uploading.")
                      return
                    }
                    fileInputRef.current?.click()
                  }}
                  disabled={isUploading}
                  className="gap-1.5 font-medium cursor-pointer"
                >
                  {isUploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <UploadCloud className="h-3.5 w-3.5" />
                  )}
                  <span>{value ? "Replace Logo" : "Upload Logo"}</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setMode("url")}
                  className="gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                  <span>Paste URL instead</span>
                </Button>

                {value && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 text-xs cursor-pointer ml-auto"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Remove</span>
                  </Button>
                )}
              </div>

              {!canUpload ? (
                <p className="text-xs text-amber-500 font-medium flex items-center gap-1.5">
                  <span>⚠️</span>
                  <span>Enter Project Title or URL Slug above to enable upload</span>
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Recommended: Square format (1:1), 256×256px or 512×512px. Supports SVG, PNG, WebP up to 5MB.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <Input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://ik.imagekit.io/... or https://example.com/logo.png"
                  className="flex-1 text-xs h-9 font-mono"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleUrlApply()
                    }
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleUrlApply}
                  className="gap-1 h-9 cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Apply</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setMode("file")}
                  className="text-xs text-muted-foreground hover:text-foreground h-9 cursor-pointer"
                >
                  Cancel
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Paste any direct public image URL to use as the project logo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
