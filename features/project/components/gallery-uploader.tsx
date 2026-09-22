"use client"

import { FC, useState, useId, useMemo, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent, DragOverlay, closestCorners, pointerWithin, type CollisionDetection } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Image as ImageIcon, Plus, Sparkles, Trash2, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/toast"
import Image from "next/image"
import { restrictToParentElement } from "@dnd-kit/modifiers"

export interface GalleryUploaderProps {
   images?: string[]
   onChange: (images: string[]) => void
   name?: string
   maxImages?: number
   className?: string
   disabled?: boolean
}

interface GalleryItem {
   id: string
   url: string
}

function generateGalleryItemId(): string {
   return `gallery_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

interface SortableGalleryCardProps {
   id: string
   url: string
   index: number
   isCover: boolean
   disabled?: boolean
   onSetCover: () => void
   onRemove: () => void
}

const SortableGalleryCard: FC<SortableGalleryCardProps> = ({
   id,
   url,
   index,
   isCover,
   disabled = false,
   onSetCover,
   onRemove,
}) => {
   const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled, transition: { duration: 150, easing: "cubic-bezier(0.2, 0, 0, 1)" }, })

   if (isDragging) {
      return (
         <div
            ref={setNodeRef}
            className="aspect-video rounded-xl border-2 border-dashed border-primary/50 bg-primary/10 shadow-inner"
         />
      )
   }

   const style: React.CSSProperties = {
      transform: CSS.Translate.toString(transform),
      transition,
   }

   return (
      <div
         ref={setNodeRef}
         style={style}
         {...attributes}
         {...listeners}
         className={cn(
            "group relative rounded-xl border bg-card overflow-hidden shadow-2xs transition-[border-color,box-shadow] touch-none select-none",
            !disabled && "cursor-grab active:cursor-grabbing",
            isCover ? "border-primary/50 ring-2 ring-primary/20" : "border-border hover:border-border/80 hover:shadow-md"
         )}
      >
         <div className="aspect-video w-full bg-muted/40 relative overflow-hidden">
            <Image
               src={url}
               alt={`Screenshot ${index + 1}`}
               fill
               unoptimized
               className="object-cover transition-transform duration-300 group-hover:scale-105 select-none pointer-events-none"
            />

            {isCover ? (
               <div className="absolute top-2 left-2 z-10">
                  <Badge className="bg-amber-500 text-white gap-1 text-[10px] font-semibold py-0.5 px-2 shadow-xs border-none select-none">
                     <Sparkles className="size-3" />
                     <span>Cover Hero</span>
                  </Badge>
               </div>
            ) : (
               <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                     #{index + 1}
                  </span>
               </div>
            )}

            {!disabled && (
               <div
                  title="Drag to reorder"
                  className="absolute top-2 right-2 z-10 size-6 rounded-md bg-black/50 text-white/90 hover:text-white hover:bg-black/70 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
               >
                  <GripVertical className="size-3.5" />
               </div>
            )}

            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between gap-1 z-10 backdrop-blur-[1px]">
               <div className="flex items-center gap-1">
                  {!isCover && !disabled && (
                     <Button
                        type="button"
                        size="xs"
                        variant="secondary"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                           e.stopPropagation()
                           onSetCover()
                        }}
                        className="h-6 text-[11px] px-2 font-medium bg-white/90 hover:bg-white text-black cursor-pointer"
                     >
                        Make Cover
                     </Button>
                  )}
               </div>

               {!disabled && (
                  <Button
                     type="button"
                     size="icon-xs"
                     variant="destructive"
                     onPointerDown={(e) => e.stopPropagation()}
                     onClick={(e) => {
                        e.stopPropagation()
                        onRemove()
                     }}
                     title="Delete screenshot"
                     className="h-6 w-6 cursor-pointer"
                  >
                     <Trash2 className="size-3" />
                  </Button>
               )}
            </div>
         </div>
      </div>
   )
}

const GalleryUploader: FC<GalleryUploaderProps> = ({ images = [], onChange, name = "images", maxImages = 10, className, disabled = false }) => {
   const dndId = useId()
   const [activeId, setActiveId] = useState<string | null>(null)
   const [items, setItems] = useState<GalleryItem[]>(() =>
      images.map((url) => ({
         id: generateGalleryItemId(),
         url,
      }))
   )

   useEffect(() => {
      setItems((prevItems) => {
         const currentUrls = prevItems.map((item) => item.url)
         if (
            currentUrls.length === images.length &&
            currentUrls.every((url, idx) => url === images[idx])
         ) {
            return prevItems
         }

         const pool = [...prevItems]
         return images.map((url) => {
            const matchIndex = pool.findIndex((item) => item.url === url)
            if (matchIndex !== -1) {
               const [matched] = pool.splice(matchIndex, 1)
               return matched
            }
            return {
               id: generateGalleryItemId(),
               url,
            }
         })
      })
   }, [images])

   const sensors = useSensors(
      useSensor(PointerSensor, {
         activationConstraint: {
            distance: 5,
         },
      }),
      useSensor(KeyboardSensor, {
         coordinateGetter: sortableKeyboardCoordinates,
      })
   )

   const collisionDetection: CollisionDetection = useCallback((args) => {
      const pointerCollisions = pointerWithin(args)
      if (pointerCollisions.length > 0) {
         return pointerCollisions
      }
      return closestCorners(args)
   }, [])

   const itemIds = useMemo(() => items.map((item) => item.id), [items])

   const activeItem = useMemo(() => {
      if (!activeId) return null
      const idx = items.findIndex((item) => item.id === activeId)
      if (idx === -1) return null
      return {
         url: items[idx].url,
         isCover: idx === 0,
      }
   }, [activeId, items])

   const handleDropFiles = useCallback(
      async (acceptedFiles: File[]) => {
         if (disabled || acceptedFiles.length === 0) return

         const availableSlots = maxImages - items.length
         if (availableSlots <= 0) {
            toast.add({
               type: "error",
               description: `Maximum limit of ${maxImages} screenshots reached.`,
            })
            return
         }

         const filesToProcess = acceptedFiles.slice(0, availableSlots)
         if (acceptedFiles.length > availableSlots) {
            toast.add({
               type: "info",
               description: `Only ${availableSlots} more screenshot(s) could be added (max ${maxImages}).`,
            })
         }

         try {
            const readFile = (file: File): Promise<string> =>
               new Promise((resolve, reject) => {
                  const reader = new FileReader()
                  reader.onload = () => resolve(reader.result as string)
                  reader.onerror = reject
                  reader.readAsDataURL(file)
               })

            const newImages = await Promise.all(filesToProcess.map(readFile))
            const newGalleryItems = newImages.map((url) => ({
               id: generateGalleryItemId(),
               url,
            }))

            const next = [...items, ...newGalleryItems]
            setItems(next)
            onChange(next.map((item) => item.url))

            toast.add({
               type: "success",
               description: `Added ${newImages.length} screenshot${newImages.length > 1 ? "s" : ""}.`,
            })
         } catch {
            toast.add({
               type: "error",
               description: "An error occurred while reading images.",
            })
         }
      },
      [disabled, items, maxImages, onChange]
   )

   const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
      onDrop: handleDropFiles,
      accept: {
         "image/png": [".png"],
         "image/jpeg": [".jpg", ".jpeg"],
         "image/webp": [".webp"],
         "image/svg+xml": [".svg"],
      },
      maxSize: 5 * 1024 * 1024,
      disabled: disabled || items.length >= maxImages,
      noClick: items.length > 0,
      noKeyboard: items.length > 0,
      onDropRejected: (fileRejections) => {
         fileRejections.forEach((rej) => {
            const err = rej.errors[0]
            const reason =
               err?.code === "file-too-large"
                  ? "Exceeds 5MB size limit"
                  : err?.code === "file-invalid-type"
                     ? "Unsupported file type (use PNG, JPG, WebP, or SVG)"
                     : err?.message || "Invalid file"
            toast.add({
               type: "error",
               description: `"${rej.file.name}": ${reason}`,
            })
         })
      },
   })

   const handleDragStart = (event: DragStartEvent) => {
      setActiveId(event.active.id as string)
   }

   const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event
      setActiveId(null)

      if (over && active.id !== over.id) {
         const oldIndex = items.findIndex((item) => item.id === active.id)
         const newIndex = items.findIndex((item) => item.id === over.id)
         if (oldIndex !== -1 && newIndex !== -1) {
            const reordered = arrayMove(items, oldIndex, newIndex)
            setItems(reordered)
            onChange(reordered.map((item) => item.url))
         }
      }
   }

   const handleDragCancel = () => {
      setActiveId(null)
   }

   const handleSetCover = (index: number) => {
      if (disabled || index === 0 || index >= items.length) return
      const target = items[index]
      const remaining = items.filter((_, i) => i !== index)
      const next = [target, ...remaining]
      setItems(next)
      onChange(next.map((item) => item.url))
      toast.add({
         type: "success",
         description: "Set as Main Cover Hero.",
      })
   }

   const handleRemove = (index: number) => {
      if (disabled || index < 0 || index >= items.length) return
      const next = items.filter((_, i) => i !== index)
      setItems(next)
      onChange(next.map((item) => item.url))
   }

   const handleClearAll = () => {
      if (disabled) return
      setItems([])
      onChange([])
   }

   return (
      <div className={cn("space-y-3 select-none", className)}>
         {name &&
            items.map((item, idx) => (
               <input key={item.id || idx} type="hidden" name={name} value={item.url} />
            ))}

         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
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
                     className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                  >
                     Clear all
                  </Button>
               )}
            </div>
         </div>

         {items.length === 0 ? (
            <div
               {...getRootProps()}
               className={cn(
                  "flex flex-col items-center justify-center py-10 px-4 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center space-y-2 select-none outline-none",
                  isDragActive
                     ? "border-primary bg-primary/5 scale-[0.99]"
                     : "border-border/80 bg-muted/20 hover:border-primary/50 hover:bg-muted/30",
                  disabled && "opacity-50 cursor-not-allowed pointer-events-none"
               )}
            >
               <input {...getInputProps()} />
               <div className="size-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="size-5" />
               </div>
               <div>
                  <p className="text-sm font-medium text-foreground">
                     Drag & drop project screenshots here
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                     PNG, JPG, WebP, SVG up to 5MB each • Click to browse files
                  </p>
               </div>
               <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mt-1">
                  <Plus className="size-3.5" />
                  <span>Choose Screenshots</span>
               </span>
            </div>
         ) : (
            <div {...getRootProps()} className="relative outline-none">
               <input {...getInputProps()} />

               {isDragActive && (
                  <div className="absolute inset-0 z-40 bg-background/85 backdrop-blur-xs border-2 border-dashed border-primary rounded-xl flex flex-col items-center justify-center gap-2 pointer-events-none animate-in fade-in duration-150">
                     <Upload className="size-8 text-primary animate-bounce" />
                     <p className="text-sm font-semibold text-foreground">
                        Drop screenshots to add to gallery
                     </p>
                     <p className="text-xs text-muted-foreground">PNG, JPG, WebP, SVG up to 5MB</p>
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
                     <SortableContext items={itemIds} strategy={rectSortingStrategy}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                           {items.map((item, idx) => (
                              <SortableGalleryCard
                                 key={item.id}
                                 id={item.id}
                                 url={item.url}
                                 index={idx}
                                 isCover={idx === 0}
                                 disabled={disabled}
                                 onSetCover={() => handleSetCover(idx)}
                                 onRemove={() => handleRemove(idx)}
                              />
                           ))}

                           {items.length < maxImages && (
                              <button
                                 type="button"
                                 onClick={open}
                                 disabled={disabled}
                                 className={cn(
                                    "aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-3 text-center transition-all cursor-pointer space-y-1 select-none outline-none",
                                    "border-border/70 bg-muted/20 hover:border-primary/50 hover:bg-muted/40",
                                    disabled && "opacity-50 cursor-not-allowed pointer-events-none"
                                 )}
                              >
                                 <Upload className="size-5 text-muted-foreground/70" />
                                 <span className="text-xs font-medium text-foreground">Add Screenshot</span>
                                 <span className="text-[10px] text-muted-foreground">Click or drop file</span>
                              </button>
                           )}
                        </div>
                     </SortableContext>

                     <DragOverlay dropAnimation={null} zIndex={100}>
                        {activeItem ? (
                           <div className="aspect-video w-full rounded-xl border-2 border-primary bg-card overflow-hidden shadow-2xl scale-[1.03] rotate-1 ring-2 ring-primary/40 cursor-grabbing relative">
                              <Image
                                 src={activeItem.url}
                                 alt="Dragging screenshot"
                                 fill
                                 unoptimized
                                 className="object-cover select-none pointer-events-none"
                              />
                              {activeItem.isCover ? (
                                 <div className="absolute top-2 left-2 z-10">
                                    <Badge className="bg-amber-500 text-white gap-1 text-[10px] font-semibold py-0.5 px-2 shadow-xs border-none">
                                       <Sparkles className="size-3" />
                                       <span>Cover Hero</span>
                                    </Badge>
                                 </div>
                              ) : (
                                 <div className="absolute top-2 right-2 z-10 size-6 rounded-md bg-black/60 text-white flex items-center justify-center">
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
