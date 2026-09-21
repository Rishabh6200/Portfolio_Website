"use client"

import * as React from "react"
import { IconName, iconNames, DynamicIcon } from "lucide-react/dynamic"
import { cn } from "@/lib/utils"
import { Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ComboboxEmpty } from "@/components/ui/combobox"
import { InputGroupAddon } from "@/components/ui/input-group"

type IconPickerProps = {
   value?: IconName
   onChange: (value: IconName) => void
   className?: string
}

function formatIconLabel(name?: string | null): string {
   if (!name) return ""
   return name
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function IconPicker({ value, onChange, className }: IconPickerProps) {
   const [search, setSearch] = React.useState("")

   const filteredIcons = React.useMemo(() => {
      const rawQuery = search.toLowerCase().trim()
      const hyphenQuery = rawQuery.replace(/\s+/g, "-")
      const currentLabel = formatIconLabel(value).toLowerCase()

      if (!rawQuery || rawQuery === currentLabel || rawQuery === value?.toLowerCase()) {
         const remaining = iconNames.filter((name) => name !== value)
         return value ? [value, ...remaining.slice(0, 99)] : iconNames.slice(0, 100)
      }

      return iconNames
         .filter((name) => {
            const formatted = name.replace(/-/g, " ")
            return name.includes(hyphenQuery) || name.includes(rawQuery) || formatted.includes(rawQuery)
         })
         .slice(0, 150)
   }, [search, value])

   return (
      <Combobox
         items={filteredIcons}
         value={value || null}
         itemToStringLabel={formatIconLabel}
         onValueChange={(val) => {
            onChange((val || "") as IconName)
            if (!val) {
               setSearch("")
            }
         }}
         onInputValueChange={setSearch}
         openOnInputClick
         autoHighlight
      >
         <ComboboxInput
            className={cn("h-10 w-full", className)}
            placeholder="Search icons (e.g. server, database)..."
            showClear
            onClear={() => {
               onChange("" as IconName)
               setSearch("")
            }}
         >
            {value && (
               <InputGroupAddon align="inline-start">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-muted-foreground shrink-0">
                     <DynamicIcon name={value} className="h-4 w-4" />
                  </div>
               </InputGroupAddon>
            )}
         </ComboboxInput>

         <ComboboxContent>
            <div className="flex items-center justify-between px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50 mb-1">
               <span>Available Icons</span>
               <span className="font-mono text-[10px]">{filteredIcons.length} shown</span>
            </div>

            <ComboboxEmpty className="py-6 text-center text-sm text-muted-foreground">
               No icons found.
            </ComboboxEmpty>

            <ComboboxList className="max-h-72 overflow-y-auto space-y-0.5 no-scrollbar">
               {(name: IconName) => (
                  <ComboboxItem
                     key={name}
                     value={name}
                     className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer"
                  >
                     <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/60 text-muted-foreground group-data-highlighted:bg-accent group-data-highlighted:text-accent-foreground group-data-highlighted:border-primary/20">
                        <DynamicIcon name={name} className="h-4 w-4 shrink-0" />
                     </div>
                     <span className="truncate capitalize text-xs font-medium text-foreground">
                        {name.replace(/-/g, " ")}
                     </span>
                  </ComboboxItem>
               )}
            </ComboboxList>
         </ComboboxContent>
      </Combobox>
   )
}
