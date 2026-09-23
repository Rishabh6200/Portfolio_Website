import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn, getMediaUrl } from "@/lib/utils"
import { AlertCircle, GripVertical, Loader2, Sparkles, Trash2 } from "lucide-react"
import Image from "next/image"
import { FC } from "react"

interface SortableGalleryCardProps {
   id: string
   url: string
   index: number
   isCover: boolean
   disabled?: boolean
   isUploading?: boolean
   progress?: number
   error?: string
   onSetCover: () => void
   onRemove: () => void
   onRetry?: () => void
}

const SortableGalleryCard: FC<SortableGalleryCardProps> = ({ id, url, index, isCover, disabled = false, isUploading = false, progress = 0, error, onSetCover, onRemove, onRetry }) => {
   const isCardDisabled = disabled || isUploading || Boolean(error)

   const { attributes, listeners, setNodeRef, transform, transition, isDragging, } = useSortable({
      id,
      disabled: isCardDisabled,
      transition: {
         duration: 150,
         easing: "cubic-bezier(0.2, 0, 1)",
      },
   })

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
            "group relative overflow-hidden rounded-xl border bg-card shadow-2xs transition-[border-color,box-shadow] touch-none select-none",
            !isCardDisabled && "cursor-grab active:cursor-grabbing",
            isCover
               ? "border-primary/50 ring-2 ring-primary/20"
               : "border-border hover:border-border/80 hover:shadow-md",
            error && "border-destructive/60 bg-destructive/5",
         )}
      >
         <div className="relative aspect-video w-full overflow-hidden bg-muted/40">
            <Image
               src={getMediaUrl(url)}
               alt={`Screenshot ${index + 1}`}
               fill
               unoptimized
               className="pointer-events-none select-none object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {isUploading && (
               <div className="pointer-events-auto absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 text-white backdrop-blur-[2px]">
                  <Loader2 className="size-6 animate-spin text-primary" />

                  <span className="mt-2 text-[11px] font-medium">
                     {progress > 0 ? `${progress}%` : "Uploading..."}
                  </span>
               </div>
            )}

            {error && (
               <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 p-3 text-center text-white">
                  <AlertCircle className="mb-1 size-5 text-destructive" />

                  <span className="mb-2 line-clamp-2 text-[11px] font-medium text-destructive-foreground">
                     {error}
                  </span>

                  <div className="flex items-center gap-1.5">
                     {onRetry && (
                        <Button
                           type="button"
                           size="xs"
                           variant="secondary"
                           onPointerDown={(event) => event.stopPropagation()}
                           onClick={(event) => {
                              event.stopPropagation()
                              onRetry()
                           }}
                           className="h-6 px-2 text-[10px]"
                        >
                           Retry
                        </Button>
                     )}

                     <Button
                        type="button"
                        size="xs"
                        variant="destructive"
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={(event) => {
                           event.stopPropagation()
                           onRemove()
                        }}
                        className="h-6 px-2 text-[10px]"
                     >
                        Remove
                     </Button>
                  </div>
               </div>
            )}

            {!isUploading && !error && isCover && (
               <div className="absolute left-2 top-2 z-10">
                  <Badge className="gap-1 border-none bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow-xs select-none">
                     <Sparkles className="size-3" />
                     <span>Cover Hero</span>
                  </Badge>
               </div>
            )}

            {!isUploading && !error && !isCover && (
               <div className="pointer-events-none absolute left-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] font-medium text-white backdrop-blur-xs">
                     #{index + 1}
                  </span>
               </div>
            )}

            {!isCardDisabled && (
               <div
                  title="Drag to reorder"
                  className="pointer-events-none absolute right-2 top-2 z-10 flex size-6 items-center justify-center rounded-md bg-black/50 text-white/90 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100 hover:bg-black/70 hover:text-white"
               >
                  <GripVertical className="size-3.5" />
               </div>
            )}

            {!isUploading && !error && (
               <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-1 bg-linear-to-t from-black/80 via-black/40 to-transparent p-2 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
                  <div className="flex items-center gap-1">
                     {!isCover && !disabled && (
                        <Button
                           type="button"
                           size="xs"
                           variant="secondary"
                           onPointerDown={(event) => {
                              event.stopPropagation()
                           }}
                           onClick={(event) => {
                              event.stopPropagation()
                              onSetCover()
                           }}
                           className="h-6 cursor-pointer bg-white/90 px-2 text-[11px] font-medium text-black hover:bg-white"
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
                        onPointerDown={(event) => event.stopPropagation()}
                        onClick={(event) => {
                           event.stopPropagation()
                           onRemove()
                        }}
                        title="Delete screenshot"
                        className="h-6 w-6 cursor-pointer"
                     >
                        <Trash2 className="size-3" />
                     </Button>
                  )}
               </div>
            )}
         </div>
      </div>
   )
}

export default SortableGalleryCard;