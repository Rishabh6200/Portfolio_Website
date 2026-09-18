"use client"

import * as React from "react"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDataTableRow } from "./data-table-row"
import type { DragHandleProps } from "./types"

export function DataTableDragHandle({
  attributes: propAttributes,
  listeners: propListeners,
  className,
  disabled = false,
  ...props
}: DragHandleProps) {
  const rowContext = useDataTableRow()

  const attributes = propAttributes ?? rowContext.attributes
  const listeners = propListeners ?? rowContext.listeners

  return (
    <button
      type="button"
      suppressHydrationWarning
      aria-label="Drag to reorder"
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center p-1 rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-muted/70 transition-colors cursor-grab active:cursor-grabbing touch-none select-none disabled:opacity-30 disabled:cursor-not-allowed pointer-events-auto",
        className
      )}
      {...attributes}
      {...listeners}
      {...props}
    >
      <GripVertical className="h-4 w-4 shrink-0" />
    </button>
  )
}
