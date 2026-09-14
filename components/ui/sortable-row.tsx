"use client"

import * as React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { TableRow } from "@/components/ui/table"
import { cn } from "cn"

interface DragHandleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listeners?: any
}

export function DragHandle({
  attributes,
  listeners,
  className,
  ...props
}: DragHandleProps) {
  return (
    <button
      type="button"
      suppressHydrationWarning
      {...attributes}
      {...listeners}
      aria-label="Drag to reorder"
      className={cn(
        "inline-flex items-center justify-center p-1 rounded-md text-muted-foreground/40 hover:text-foreground hover:bg-muted/70 transition-colors cursor-grab active:cursor-grabbing touch-none select-none",
        className
      )}
      {...props}
    >
      <GripVertical className="h-4 w-4 shrink-0" />
    </button>
  )
}

interface SortableRowProps
  extends Omit<React.HTMLAttributes<HTMLTableRowElement>, "children"> {
  id: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: (handleProps: { attributes: any; listeners: any; isDragging: boolean }) => React.ReactNode
}

export function SortableRow({
  id,
  children,
  className,
  style: userStyle,
  ...props
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: isDragging ? "relative" : undefined,
    ...userStyle,
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-state={isDragging ? "selected" : undefined}
      className={cn(
        "transition-colors",
        isDragging && "bg-muted/80 opacity-60 shadow-lg border-primary/40",
        className
      )}
      {...props}
    >
      {children({ attributes, listeners, isDragging })}
    </TableRow>
  )
}
