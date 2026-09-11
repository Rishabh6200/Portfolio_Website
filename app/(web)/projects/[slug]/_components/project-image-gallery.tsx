"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { Maximize2, ZoomIn, ChevronLeft, ChevronRight, Images } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProjectImageModal } from "./project-image-modal"

interface ProjectImageGalleryProps {
  images: string[]
  title: string
  liveUrl?: string
}

export function ProjectImageGallery({ images = [], title, liveUrl }: ProjectImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const validImages = images.filter((img) => typeof img === "string" && img.trim().length > 0)

  if (validImages.length === 0) {
    return null
  }

  const currentPreview = validImages[selectedIndex] || validImages[0]

  return (
    <section className="mt-10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="font-mono text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
          <Images className="h-3.5 w-3.5" />
          <span>
            Project Gallery {validImages.length > 1 ? `(${validImages.length} screens)` : ""}
          </span>
        </div>
        <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline-block">
          Click image to expand full view • ← → to cycle
        </span>
      </div>

      <div className="flex flex-col items-center">
        {/* Main Preview Container */}
        <div className="relative w-full max-w-2xl group">
          <div
            role="button"
            tabIndex={0}
            aria-label={`Open full preview for ${title}`}
            onClick={() => setModalOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                setModalOpen(true)
              } else if (e.key === "ArrowRight") {
                e.preventDefault()
                setSelectedIndex((prev) => (prev + 1) % validImages.length)
              } else if (e.key === "ArrowLeft") {
                e.preventDefault()
                setSelectedIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
              }
            }}
            className={cn(
              "relative w-full aspect-video sm:aspect-16/10 md:aspect-video overflow-hidden rounded-2xl",
              "border border-black/10 dark:border-white/12 bg-neutral-100 dark:bg-[#0c101b]",
              "shadow-xl shadow-black/5 dark:shadow-black/40 cursor-pointer transition-all duration-300",
              "hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="relative h-full w-full"
              >
                <Image
                  src={currentPreview}
                  alt={`${title} Preview ${selectedIndex + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 672px"
                  loading="eager"
                  preload={true}
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
              </motion.div>
            </AnimatePresence>

            {/* Quick Expand Button on Top-Right */}
            <div className="absolute top-3 right-3 z-10 opacity-90 group-hover:opacity-100 transition-opacity">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-950/70 hover:bg-neutral-900/90 border border-white/15 backdrop-blur-md text-white font-mono text-xs shadow-lg transition-transform duration-200 group-hover:scale-105">
                <Maximize2 className="h-3 w-3 text-indigo-400" />
                <span className="hidden sm:inline text-[11px]">Full Preview</span>
              </span>
            </div>

            {/* Bottom Counter Pill */}
            <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950/70 border border-white/10 backdrop-blur-md text-white font-mono text-[11px] shadow-md">
                <ZoomIn className="h-3 w-3 text-indigo-400" />
                <span>
                  {selectedIndex + 1} / {validImages.length}
                </span>
              </span>
            </div>

            {/* Subtle Hover Center Hint */}
            <div className="absolute inset-0 bg-neutral-950/20 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-950/85 text-white font-mono text-xs font-medium shadow-2xl border border-white/20 transform scale-95 group-hover:scale-100 transition-transform duration-300">
                <Maximize2 className="h-3.5 w-3.5 text-indigo-400" />
                <span>Click to expand full resolution</span>
              </div>
            </div>
          </div>

          {/* Prev / Next Quick Arrows on Main Card (if > 1 image) */}
          {validImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedIndex((prev) => (prev - 1 + validImages.length) % validImages.length)
                }}
                aria-label="Previous image preview"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-neutral-950/65 hover:bg-neutral-900/95 text-white border border-white/15 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedIndex((prev) => (prev + 1) % validImages.length)
                }}
                aria-label="Next image preview"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-neutral-950/65 hover:bg-neutral-900/95 text-white border border-white/15 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Optimized Sleek Thumbnails Dock (if more than 1 image) */}
        {validImages.length > 1 && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="p-2 rounded-2xl bg-neutral-100/80 dark:bg-white/4 border border-black/8 dark:border-white/8 backdrop-blur-md shadow-xs inline-flex items-center justify-center gap-3 max-w-full overflow-x-auto scrollbar-none">
              {validImages.map((imgUrl, idx) => {
                const isSelected = idx === selectedIndex
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setModalOpen(true)
                        } else {
                          setSelectedIndex(idx)
                        }
                      }}
                      title={isSelected ? "Click to expand full resolution" : `Switch to screen ${idx + 1}`}
                      aria-label={`View screen ${idx + 1}`}
                      className={cn(
                        "group relative w-22 sm:w-26 md:w-30 aspect-video overflow-hidden rounded-xl transition-all duration-300",
                        "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                        isSelected
                          ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-background dark:ring-offset-[#0b0f19] shadow-md shadow-indigo-500/25 scale-[1.03] opacity-100"
                          : "border border-black/10 dark:border-white/10 opacity-60 hover:opacity-100 hover:scale-[1.02] hover:border-black/25 dark:hover:border-white/30"
                      )}
                    >
                      <Image
                        src={imgUrl}
                        alt={`${title} thumbnail ${idx + 1}`}
                        fill
                        sizes="(max-width: 640px) 90px, 120px"
                        loading={idx === selectedIndex ? "eager" : "lazy"}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                        <div className="p-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-xs">
                          <Maximize2 className="h-2.5 w-2.5" />
                        </div>
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <ProjectImageModal
        isOpen={modalOpen}
        onClose={(lastIndex) => {
          setSelectedIndex(lastIndex)
          setModalOpen(false)
        }}
        images={validImages}
        title={title}
        liveUrl={liveUrl}
        initialIndex={selectedIndex}
      />
    </section>
  )
}
