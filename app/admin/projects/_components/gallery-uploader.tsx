"use client"

import { useState, useRef } from "react"
import { Plus, Trash2, Upload, Link as LinkIcon, Loader2, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadProjectMediaAction } from "../actions"

interface GalleryUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
}

export function GalleryUploader({ images, onChange }: GalleryUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const [showUrlInput, setShowUrlInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFilesUpload(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"))
    if (imageFiles.length === 0) {
      toast.error("Please upload image files (PNG, JPG, WebP, SVG)")
      return
    }

    setIsUploading(true)
    const uploadedUrls: string[] = []
    let hasError = false

    try {
      for (const file of imageFiles) {
        const formData = new FormData()
        formData.append("file", file)

        const res = await uploadProjectMediaAction(formData)
        if (res.success && res.url) {
          uploadedUrls.push(res.url)
        } else {
          hasError = true
        }
      }

      if (uploadedUrls.length > 0) {
        onChange([...images, ...uploadedUrls])
        toast.success(
          `Added ${uploadedUrls.length} screenshot${uploadedUrls.length > 1 ? "s" : ""} to gallery`
        )
      }

      if (hasError) {
        toast.error("One or more images failed to upload")
      }
    } catch {
      toast.error("Upload failed. Try using the URL input instead.")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesUpload(e.target.files)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files)
    }
  }

  function handleAddUrl() {
    const trimmed = urlInput.trim()
    if (!trimmed) return

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      toast.error("Please enter a valid URL starting with http:// or https://")
      return
    }

    onChange([...images, trimmed])
    setUrlInput("")
    setShowUrlInput(false)
    toast.success("Image URL added to gallery")
  }

  function handleRemove(index: number) {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      {/* Hidden Multi-file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Gallery Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="group relative aspect-video rounded-xl border border-border bg-muted overflow-hidden shadow-2xs"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`Gallery image ${idx + 1}`}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemove(idx)}
                  className="h-8 w-8 rounded-lg"
                  title="Remove image"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white">
                #{idx + 1}
              </span>
            </div>
          ))}

          {/* Quick Drop Target card inside grid */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 p-2 text-center transition-colors ${
              dragOver
                ? "border-primary bg-primary/10"
                : "border-border hover:border-foreground/30 bg-muted/20 hover:bg-muted/40"
            }`}
          >
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <Plus className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="text-xs font-medium text-muted-foreground">
              {isUploading ? "Uploading..." : "Add / Drop image"}
            </span>
          </div>
        </div>
      )}

      {/* Empty State Drag and Drop Zone */}
      {images.length === 0 && !showUrlInput && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed p-7 text-center transition-colors ${
            dragOver
              ? "border-primary bg-primary/10"
              : "border-border hover:border-foreground/30 bg-muted/10 hover:bg-muted/20"
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-2.5">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              {isUploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Upload className="h-5 w-5" />
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">
                {isUploading ? "Uploading files to ImageKit..." : "Click to select or drag & drop screenshots here"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                PNG, JPG, WebP, or SVG (multiple files supported)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload / Add Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="gap-2"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Upload Screenshots</span>
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <LinkIcon className="h-3.5 w-3.5" />
          <span>Paste Image URL</span>
        </Button>
      </div>

      {/* URL Input Form */}
      {showUrlInput && (
        <div className="flex items-center gap-2 max-w-md pt-1">
          <Input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://ik.imagekit.io/.../screenshot.png"
            className="text-xs"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddUrl()
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            onClick={handleAddUrl}
            className="shrink-0"
          >
            Add
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowUrlInput(false)}
            className="shrink-0"
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}
