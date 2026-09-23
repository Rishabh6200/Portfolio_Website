"use client"

import { FC, useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { closestCorners, DndContext, DragOverlay, KeyboardSensor, pointerWithin, PointerSensor, useSensor, useSensors, type CollisionDetection, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core"
import { arrayMove, rectSortingStrategy, SortableContext, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { restrictToParentElement } from "@dnd-kit/modifiers"
import { GripVertical, Image as ImageIcon, Plus, Sparkles, Upload } from "lucide-react"
import Image from "next/image"
import { cn, generateGalleryItemId, getMediaUrl } from "@/lib/utils"
import { uploadMediaToS3 } from "@/lib/upload"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/toast"
import SortableGalleryCard from "./sortable-gallery-card"

export interface GalleryUploaderProps {
   images?: string[]
   onChange: (images: string[]) => void
   name?: string
   maxImages?: number
   className?: string
   disabled?: boolean
   projectSlug?: string
   onRequireTitle?: () => void
}

interface GalleryItem {
   id: string
   url: string
   isUploading?: boolean
   progress?: number
   error?: string
   file?: File
   isNewUpload?: boolean
}


function getValidUrls(items: GalleryItem[]): string[] {
   return items
      .filter((item) => !item.isUploading && !item.error)
      .map((item) => item.url)
}


const GalleryUploader: FC<GalleryUploaderProps> = ({
   images = [],
   onChange,
   name = "images",
   maxImages = 10,
   className,
   disabled = false,
   projectSlug = "",
   onRequireTitle,
}) => {
   const dndId = useId()

   const [activeId, setActiveId] = useState<string | null>(null)

   const [items, setItems] = useState<GalleryItem[]>(() =>
      images.map((url) => ({
         id: generateGalleryItemId(),
         url,
      })),
   )

   const itemsRef = useRef<GalleryItem[]>(items)

   const updateItems = useCallback((updater: GalleryItem[] | ((current: GalleryItem[]) => GalleryItem[]), notify = true) => {
      const current = itemsRef.current
      const next = typeof updater === "function" ? updater(current) : updater

      itemsRef.current = next
      setItems(next)

      if (notify) {
         onChange(getValidUrls(next))
      }

      return next
   }, [onChange])

   useEffect(() => {
      const current = itemsRef.current

      if (current.some((item) => item.isUploading)) {
         return
      }

      const currentUrls = current.map((item) => item.url)

      const isSame = currentUrls.length === images.length && currentUrls.every((url, index) => url === images[index])
      if (isSame) {
         return
      }
      const pool = [...current]

      const next = images.map((url) => {
         const matchIndex = pool.findIndex(
            (item) => item.url === url,
         )

         if (matchIndex !== -1) {
            const [matched] = pool.splice(matchIndex, 1)

            return matched
         }

         return {
            id: generateGalleryItemId(),
            url,
         }
      })

      itemsRef.current = next
      setItems(next)
   }, [images])

   const sensors = useSensors(
      useSensor(PointerSensor, {
         activationConstraint: {
            distance: 5,
         },
      }),
      useSensor(KeyboardSensor, {
         coordinateGetter: sortableKeyboardCoordinates,
      }),
   )

   const collisionDetection: CollisionDetection = useCallback(
      (args) => {
         const pointerCollisions = pointerWithin(args)

         if (pointerCollisions.length > 0) {
            return pointerCollisions
         }

         return closestCorners(args)
      }, [],)

   const itemIds = useMemo(() => items.map((item) => item.id), [items])

   const activeItem = useMemo(() => {
      if (!activeId) {
         return null
      }

      const index = items.findIndex((item) => item.id === activeId)

      if (index === -1) {
         return null
      }

      return {
         url: items[index].url,
         isCover: index === 0,
      }
   }, [activeId, items])

   const handleDropFiles = useCallback(
      async (acceptedFiles: File[]) => {
         if (disabled || acceptedFiles.length === 0) {
            return
         }

         if (!projectSlug?.trim()) {
            if (onRequireTitle) {
               onRequireTitle()
            } else {
               toast.add({
                  type: "warning",
                  title: "Project Title Required",
                  description:
                     "Please enter a project title before uploading screenshots.",
               })
            }

            return
         }

         const currentItems = itemsRef.current

         const availableSlots =
            maxImages - currentItems.length

         if (availableSlots <= 0) {
            toast.add({
               type: "error",
               description: `Maximum limit of ${maxImages} screenshots reached.`,
            })

            return
         }

         const filesToProcess = acceptedFiles.slice(
            0,
            availableSlots,
         )

         if (acceptedFiles.length > availableSlots) {
            toast.add({
               type: "info",
               description: `Only ${availableSlots} more screenshot(s) could be added (max ${maxImages}).`,
            })
         }

         const tempItems: GalleryItem[] = filesToProcess.map((file) => {
            const objectUrl = URL.createObjectURL(file)

            return {
               id: generateGalleryItemId(),
               url: objectUrl,
               isUploading: true,
               progress: 0,
               file,
               isNewUpload: true,
            }
         })

         updateItems((current) => [...current, ...tempItems], false)

         const folder = `projects/${projectSlug.trim().toLowerCase()}/gallery`

         await Promise.all(
            tempItems.map(async (tempItem) => {
               try {
                  const { key } = await uploadMediaToS3(tempItem.file!, {
                     folder,
                     onProgress: (pct) => {
                        updateItems(
                           (current) =>
                              current.map((item) =>
                                 item.id === tempItem.id
                                    ? {
                                       ...item,
                                       progress: pct,
                                    }
                                    : item,
                              ),
                           false,
                        )
                     },
                  });

                  updateItems((current) =>
                     current.map((item) =>
                        item.id === tempItem.id
                           ? {
                              ...item,
                              url: key,
                              isUploading: false,
                              progress: 100,
                              error: undefined,
                              file: undefined,
                              isNewUpload: true,
                           }
                           : item,
                     ),
                  )

                  if (tempItem.url.startsWith("blob:")) {
                     URL.revokeObjectURL(tempItem.url)
                  }
               } catch (err: unknown) {
                  const message = err instanceof Error ? err.message : "Upload failed"
                  updateItems((current) =>
                     current.map((item) =>
                        item.id === tempItem.id
                           ? {
                              ...item,
                              isUploading: false,
                              error: message,
                           }
                           : item,
                     ),
                     false,
                  )

                  toast.add({
                     type: "error",
                     title: "Upload Failed",
                     description: `${tempItem.file?.name}: ${message}`,
                  })
               }
            }),
         )
      }, [disabled, maxImages, onRequireTitle, projectSlug, updateItems],
   )

   const handleRetry = useCallback(
      async (itemId: string) => {
         const item = itemsRef.current.find(
            (current) => current.id === itemId,
         )

         if (
            !item ||
            !item.file ||
            !projectSlug?.trim()
         ) {
            return
         }

         updateItems(
            (current) =>
               current.map((galleryItem) =>
                  galleryItem.id === itemId
                     ? {
                        ...galleryItem,
                        isUploading: true,
                        error: undefined,
                        progress: 0,
                     }
                     : galleryItem,
               ),
            false,
         )

         try {
            const folder = `projects/${projectSlug
               .trim()
               .toLowerCase()}/gallery`

            const { key } = await uploadMediaToS3(
               item.file,
               {
                  folder,

                  onProgress: (pct) => {
                     updateItems(
                        (current) =>
                           current.map((galleryItem) =>
                              galleryItem.id === itemId
                                 ? {
                                    ...galleryItem,
                                    progress: pct,
                                 }
                                 : galleryItem,
                           ),
                        false,
                     )
                  },
               },
            )

            /**
             * Upload succeeded.
             *
             * onChange happens OUTSIDE the state updater.
             */
            updateItems((current) =>
               current.map((galleryItem) =>
                  galleryItem.id === itemId
                     ? {
                        ...galleryItem,
                        url: key,
                        isUploading: false,
                        progress: 100,
                        error: undefined,
                        file: undefined,
                        isNewUpload: true,
                     }
                     : galleryItem,
               ),
            )

            /**
             * Revoke old blob preview.
             */
            if (item.url.startsWith("blob:")) {
               URL.revokeObjectURL(item.url)
            }
         } catch (err: unknown) {
            const message =
               err instanceof Error
                  ? err.message
                  : "Retry failed"

            updateItems(
               (current) =>
                  current.map((galleryItem) =>
                     galleryItem.id === itemId
                        ? {
                           ...galleryItem,
                           isUploading: false,
                           error: message,
                        }
                        : galleryItem,
                  ),
               false,
            )

            toast.add({
               type: "error",
               title: "Retry Failed",
               description: message,
            })
         }
      },
      [projectSlug, updateItems],
   )

   /**
    * Dropzone.
    */
   const {
      getRootProps,
      getInputProps,
      isDragActive,
      open,
   } = useDropzone({
      onDrop: handleDropFiles,

      accept: {
         "image/png": [".png"],
         "image/jpeg": [".jpg", ".jpeg"],
         "image/webp": [".webp"],
         "image/svg+xml": [".svg"],
      },

      maxSize: 5 * 1024 * 1024,

      disabled:
         disabled || items.length >= maxImages,

      noClick: items.length > 0,
      noKeyboard: items.length > 0,

      onDropRejected: (fileRejections) => {
         fileRejections.forEach((rejection) => {
            const error = rejection.errors[0]

            const reason =
               error?.code === "file-too-large"
                  ? "Exceeds 5MB size limit"
                  : error?.code === "file-invalid-type"
                     ? "Unsupported file type (use PNG, JPG, WebP, or SVG)"
                     : error?.message || "Invalid file"

            toast.add({
               type: "error",
               description: `"${rejection.file.name}": ${reason}`,
            })
         })
      },
   })

   /**
    * Drag start.
    */
   const handleDragStart = useCallback(
      (event: DragStartEvent) => {
         setActiveId(event.active.id as string)
      },
      [],
   )

   /**
    * Drag end / reorder.
    */
   const handleDragEnd = useCallback(
      (event: DragEndEvent) => {
         const { active, over } = event

         setActiveId(null)

         if (!over || active.id === over.id) {
            return
         }

         const current = itemsRef.current

         const oldIndex = current.findIndex(
            (item) => item.id === active.id,
         )

         const newIndex = current.findIndex(
            (item) => item.id === over.id,
         )

         if (oldIndex === -1 || newIndex === -1) {
            return
         }

         const reordered = arrayMove(
            current,
            oldIndex,
            newIndex,
         )

         updateItems(reordered)
      },
      [updateItems],
   )

   /**
    * Drag cancel.
    */
   const handleDragCancel = useCallback(() => {
      setActiveId(null)
   }, [])

   /**
    * Move selected image to position 0.
    */
   const handleSetCover = useCallback(
      (index: number) => {
         if (disabled) {
            return
         }

         const current = itemsRef.current

         if (
            index <= 0 ||
            index >= current.length
         ) {
            return
         }

         const target = current[index]

         const remaining = current.filter(
            (_, currentIndex) => currentIndex !== index,
         )

         const next = [target, ...remaining]

         updateItems(next)

         toast.add({
            type: "success",
            description: "Set as Main Cover Hero.",
         })
      },
      [disabled, updateItems],
   )

   /**
    * Remove image.
    */
   const handleRemove = useCallback(
      (index: number) => {
         if (disabled) {
            return
         }

         const current = itemsRef.current

         if (
            index < 0 ||
            index >= current.length
         ) {
            return
         }

         const removed = current[index]

         /**
          * Revoke optimistic preview if necessary.
          */
         if (removed?.url?.startsWith("blob:")) {
            URL.revokeObjectURL(removed.url)
         }

         const next = current.filter(
            (_, currentIndex) => currentIndex !== index,
         )

         updateItems(next)
      },
      [disabled, updateItems],
   )

   /**
    * Remove everything.
    */
   const handleClearAll = useCallback(() => {
      if (disabled) {
         return
      }

      const current = itemsRef.current

      current.forEach((item) => {
         if (item.url.startsWith("blob:")) {
            URL.revokeObjectURL(item.url)
         }
      })

      updateItems([])
   }, [disabled, updateItems])

   return (
      <div
         className={cn(
            "space-y-3 select-none",
            className,
         )}
      >
         {/* Hidden form fields */}
         {name &&
            items.map((item, index) => (
               <input
                  key={item.id || index}
                  type="hidden"
                  name={name}
                  value={item.url}
               />
            ))}

         {/* Header */}
         <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
               <span className="text-xs font-semibold text-foreground">
                  Showcase Gallery ({items.length}/{maxImages})
               </span>

               <span className="text-[11px] text-muted-foreground">
                  • Drag to reorder • #1 is Cover Hero
               </span>
            </div>

            <div className="flex items-center gap-1.5">
               {items.length > 0 && (
                  <Button
                     type="button"
                     variant="ghost"
                     size="xs"
                     onClick={handleClearAll}
                     disabled={disabled}
                     className="h-7 cursor-pointer px-2 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                     Clear all
                  </Button>
               )}
            </div>
         </div>

         {/* Empty state */}
         {items.length === 0 ? (
            <div
               {...getRootProps()}
               className={cn(
                  "flex cursor-pointer flex-col items-center justify-center space-y-2 rounded-xl border-2 border-dashed px-4 py-10 text-center outline-none transition-all select-none",
                  isDragActive
                     ? "scale-[0.99] border-primary bg-primary/5"
                     : "border-border/80 bg-muted/20 hover:border-primary/50 hover:bg-muted/30",
                  disabled &&
                  "pointer-events-none cursor-not-allowed opacity-50",
               )}
            >
               <input {...getInputProps()} />

               <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <ImageIcon className="size-5" />
               </div>

               <div>
                  <p className="text-sm font-medium text-foreground">
                     Drag & drop project screenshots here
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                     PNG, JPG, WebP, SVG up to 5MB each •
                     Click to browse files
                  </p>
               </div>

               <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Plus className="size-3.5" />
                  <span>Choose Screenshots</span>
               </span>
            </div>
         ) : (
            <div
               {...getRootProps()}
               className="relative outline-none"
            >
               <input {...getInputProps()} />

               {/* Drop overlay */}
               {isDragActive && (
                  <div className="pointer-events-none absolute inset-0 z-40 flex animate-in flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary bg-background/85 backdrop-blur-xs fade-in duration-150">
                     <Upload className="size-8 animate-bounce text-primary" />

                     <p className="text-sm font-semibold text-foreground">
                        Drop screenshots to add to gallery
                     </p>

                     <p className="text-xs text-muted-foreground">
                        PNG, JPG, WebP, SVG up to 5MB
                     </p>
                  </div>
               )}

               <DndContext
                  id={dndId}
                  sensors={sensors}
                  collisionDetection={collisionDetection}
                  modifiers={[restrictToParentElement]}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onDragCancel={handleDragCancel}
               >
                  <div className="relative rounded-xl p-1">
                     <SortableContext
                        items={itemIds}
                        strategy={rectSortingStrategy}
                     >
                        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                           {items.map((item, index) => (
                              <SortableGalleryCard
                                 key={item.id}
                                 id={item.id}
                                 url={item.url}
                                 index={index}
                                 isCover={index === 0}
                                 disabled={disabled}
                                 isUploading={item.isUploading}
                                 progress={item.progress}
                                 error={item.error}
                                 onSetCover={() => handleSetCover(index)}
                                 onRemove={() => handleRemove(index)}
                                 onRetry={() => handleRetry(item.id)}
                              />
                           ))}

                           {/* Add button */}
                           {items.length < maxImages && (
                              <button
                                 type="button"
                                 onClick={open}
                                 disabled={disabled}
                                 className={cn(
                                    "flex aspect-video cursor-pointer flex-col items-center justify-center space-y-1 rounded-xl border-2 border-dashed p-3 text-center outline-none transition-all select-none",
                                    "border-border/70 bg-muted/20 hover:border-primary/50 hover:bg-muted/40",
                                    disabled &&
                                    "pointer-events-none cursor-not-allowed opacity-50",
                                 )}
                              >
                                 <Upload className="size-5 text-muted-foreground/70" />

                                 <span className="text-xs font-medium text-foreground">
                                    Add Screenshot
                                 </span>

                                 <span className="text-[10px] text-muted-foreground">
                                    Click or drop file
                                 </span>
                              </button>
                           )}
                        </div>
                     </SortableContext>

                     {/* Drag overlay */}
                     <DragOverlay
                        dropAnimation={null}
                        zIndex={100}
                     >
                        {activeItem ? (
                           <div className="relative aspect-video w-full scale-[1.03] rotate-1 overflow-hidden rounded-xl border-2 border-primary bg-card shadow-2xl ring-2 ring-primary/40">
                              <Image
                                 src={getMediaUrl(activeItem.url)}
                                 alt="Dragging screenshot"
                                 fill
                                 unoptimized
                                 className="pointer-events-none select-none object-cover"
                              />

                              {activeItem.isCover ? (
                                 <div className="absolute left-2 top-2 z-10">
                                    <Badge className="gap-1 border-none bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                                       <Sparkles className="size-3" />
                                       <span>Cover Hero</span>
                                    </Badge>
                                 </div>
                              ) : (
                                 <div className="absolute right-2 top-2 z-10 flex size-6 items-center justify-center rounded-md bg-black/60 text-white">
                                    <GripVertical className="size-3.5" />
                                 </div>
                              )}
                           </div>
                        ) : null}
                     </DragOverlay>
                  </div>
               </DndContext>
            </div>
         )}
      </div>
   )
}

export default GalleryUploader