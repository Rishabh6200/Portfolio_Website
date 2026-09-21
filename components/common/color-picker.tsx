"use client"

import * as React from "react"
import { HexColorPicker } from "react-colorful"
import { Pipette } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

export interface ColorPickerProps {
   value: string
   onChange: (value: string) => void
   className?: string
   inputClassName?: string
}

const isValidHex = (hex: string) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)

export default function ColorPicker({
   value,
   onChange,
   className,
   inputClassName,
}: ColorPickerProps) {
   const [open, setOpen] = React.useState(false);

   const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      let raw = e.target.value.trim()
      if (raw && !raw.startsWith("#")) {
         raw = `#${raw}`
      }
      onChange(raw)
   }

   const currentColor = isValidHex(value) ? value : "#6366f1"

   return (
      <div className={cn("space-y-2.5", className)}>
         <div className="flex items-center gap-2">
            <Popover open={open} onOpenChange={setOpen}>
               <PopoverTrigger
                  className="group relative h-10 w-12 rounded-lg border border-input shrink-0 overflow-hidden shadow-xs cursor-pointer transition-all"
                  style={{ backgroundColor: currentColor }}
                  aria-label="Open color picker palette"
               >
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white backdrop-blur-[1px]">
                     <Pipette className="h-3.5 w-3.5" />
                  </div>
               </PopoverTrigger>
               <PopoverContent
                  align="start"
                  className="w-auto p-0"
               >
                  <HexColorPicker
                     color={currentColor}
                     onChange={onChange}
                  />
               </PopoverContent>
            </Popover>

            <Input
               type="text"
               value={value}
               onChange={handleHexInput}
               placeholder="e.g. #6366f1"
               className={cn("font-mono h-10 flex-1", inputClassName)}
            />
         </div>
      </div>
   )
}
