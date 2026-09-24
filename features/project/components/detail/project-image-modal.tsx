"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectImageModalProps {
  isOpen: boolean
  onClose: (lastViewedIndex: number) => void
  images: string[]
  title: string
  liveUrl?: string
  initialIndex?: number
}

export function ProjectImageModal({
  isOpen,
  onClose,
  images = [],
  title,
  liveUrl,
  initialIndex = 0,
}: ProjectImageModalProps) {
  const [modalIndex, setModalIndex] = useState(initialIndex)
  const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Sync state during render when initialIndex changes
  if (initialIndex !== prevInitialIndex) {
    setPrevInitialIndex(initialIndex)
    setModalIndex(initialIndex)
  }

  const handleClose = useCallback(() => {
    onClose(modalIndex)
  }, [onClose, modalIndex])

  const nextImage = useCallback(() => {
    setModalIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const prevImage = useCallback(() => {
    setModalIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  // Reset scroll position to top whenever the displayed image changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: "instant" })
    }
  }, [modalIndex])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
      if (e.key === "ArrowRight") nextImage()
      if (e.key === "ArrowLeft") prevImage()
    }

    window.addEventListener("keydown", handleKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, nextImage, prevImage, handleClose])

  if (!isOpen || images.length === 0) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-neutral-950/85 backdrop-blur-xl select-none"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} Full Preview`}
        >
          {/* Top Bar Floating Controls - Fixed to Viewport */}
          <div
            className="fixed top-3 sm:top-5 left-0 right-0 px-3 sm:px-6 md:px-8 flex items-center justify-between z-30 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Title & Image Counter */}
            <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-neutral-900/80 border border-white/12 backdrop-blur-md shadow-2xl text-white">
              <span className="text-xs font-semibold max-w-[45vw] sm:max-w-xs truncate font-mono">
                {title}
              </span>
              {images.length > 1 && (
                <>
                  <span className="text-white/30 text-xs">•</span>
                  <span className="text-[11px] font-mono text-white/70">
                    {modalIndex + 1} of {images.length}
                  </span>
                </>
              )}
            </div>

            {/* Action buttons: Live link (if available) & Close Button */}
            <div className="pointer-events-auto flex items-center gap-2">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white/90 hover:text-white border border-white/12 backdrop-blur-md text-xs font-mono transition-colors shadow-lg"
                >
                  <span>Visit Live</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close preview modal (Escape)"
                className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white/80 hover:text-white border border-white/12 backdrop-blur-md transition-all shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Left Navigation Arrow - Fixed to Viewport Center */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              aria-label="Previous image"
              className="fixed left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-neutral-900/75 hover:bg-neutral-800 text-white border border-white/15 backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}

          {/* Right Navigation Arrow - Fixed to Viewport Center */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              aria-label="Next image"
              className="fixed right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center h-9 w-9 sm:h-11 sm:w-11 rounded-full bg-neutral-900/75 hover:bg-neutral-800 text-white border border-white/15 backdrop-blur-md shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          )}

          {/* Scrollable Viewport Area */}
          <div
            ref={scrollContainerRef}
            className="fixed inset-0 z-20 overflow-y-auto overflow-x-hidden overscroll-contain"
            onClick={handleClose}
          >
            <div
              className={cn(
                "min-h-full w-full flex flex-col items-center justify-center px-4 sm:px-14 md:px-20 pt-16 sm:pt-20",
                images.length > 1 ? "pb-24 sm:pb-28" : "pb-16 sm:pb-20"
              )}
            >
              <motion.div
                key={modalIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="relative flex items-center justify-center my-auto max-w-[94vw] sm:max-w-[88vw] md:max-w-5xl xl:max-w-6xl w-auto cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={images[modalIndex]}
                  alt={`${title} Full Preview ${modalIndex + 1}`}
                  width={1920}
                  height={1080}
                  sizes="(max-width: 1200px) 95vw, 1920px"
                  priority
                  className="w-auto h-auto max-w-full rounded-xl sm:rounded-2xl shadow-2xl border border-white/15 ring-1 ring-white/10"
                />
              </motion.div>
            </div>
          </div>

          {/* Bottom Dock Mini-Thumbnails (if more than 1 image) - Fixed to Viewport Bottom */}
          {images.length > 1 && (
            <div
              className="fixed bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-2.5 p-1.5 sm:p-2 rounded-2xl bg-neutral-950/80 border border-white/15 backdrop-blur-xl shadow-2xl max-w-[94vw] sm:max-w-[90vw] overflow-x-auto scrollbar-none overscroll-x-contain snap-x"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setModalIndex(idx)}
                  aria-label={`Jump to image ${idx + 1}`}
                  className={cn(
                    "relative w-14 sm:w-18 md:w-22 aspect-video rounded-lg sm:rounded-xl overflow-hidden border shrink-0 snap-center transition-all duration-200 cursor-pointer",
                    idx === modalIndex
                      ? "ring-2 ring-indigo-400 ring-offset-2 ring-offset-neutral-950 shadow-lg shadow-indigo-500/30 scale-105 opacity-100"
                      : "border-white/15 opacity-40 hover:opacity-100 hover:border-white/40"
                  )}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 60px, 88px"
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
