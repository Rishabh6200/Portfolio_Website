"use client"

import { FC, useState } from "react"
import { Camera, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/toast"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export interface LogoUploaderProps {
   value?: string
   onChange: (url: string) => void
   name?: string
   className?: string
   disabled?: boolean
}

const LogoUploader: FC<LogoUploaderProps> = ({ value = "", onChange, name = "logo", className, disabled = false }) => {
   const [isDragging, setIsDragging] = useState(false)

   const handleFile = (file?: File) => {
      if (!file) return
      if (!file.type.startsWith("image/")) {
         return toast.add({ type: "error", description: "Only image files (PNG, JPG, SVG, WebP) are allowed." })
      }
      if (file.size > 5 * 1024 * 1024) {
         return toast.add({ type: "error", description: "Image exceeds 5MB limit." })
      }
      const reader = new FileReader()
      reader.onload = () => {
         onChange(reader.result as string)
         toast.add({ type: "success", description: "Logo uploaded successfully." })
      }
      reader.readAsDataURL(file)
   }

   return (
      <div className={cn("relative select-none", className)}>
         {name && <input type="hidden" name={name} value={value} />}

         <label
            onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files?.[0]) }}
            className={cn(
               "group relative flex flex-col items-center justify-center w-full h-full aspect-square rounded-2xl transition-all overflow-hidden select-none",
               disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
               value
                  ? "border border-border bg-card/80 hover:border-primary/60 shadow-xs"
                  : "border-2 border-dashed border-border/80 bg-muted/20 hover:border-primary/60 hover:bg-muted/40",
               isDragging && "border-primary bg-primary/10 ring-2 ring-primary/20 scale-[0.99]"
            )}
         >
            <input
               type="file"
               accept="image/png,image/jpeg,image/webp,image/svg+xml"
               disabled={disabled}
               className="hidden"
               onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = "" }}
            />

            {value ? (
               <>
                  <Image
                     src={value}
                     alt="Logo"
                     fill
                     className="object-contain p-2.5 transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-[1px]">
                     <Camera className="size-5" />
                     <span className="text-[11px] font-medium mt-1">Change Logo</span>
                  </div>
               </>
            ) : (
               <div className="flex flex-col items-center justify-center p-2 text-center text-muted-foreground group-hover:text-primary transition-colors">
                  <Upload className="size-5.5 text-muted-foreground/70 group-hover:text-primary stroke-2 transition-colors" />
                  <span className="text-xs font-semibold text-foreground/85 group-hover:text-foreground mt-1.5">Upload Logo</span>
               </div>
            )}
         </label>

         {value && !disabled && (
            <Button
               variant="destructive" size="icon-sm"
               className="absolute -top-1 -right-1"
               onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange("") }}
            >
               <X />
            </Button>
         )}
      </div>
   )
}

export default LogoUploader;