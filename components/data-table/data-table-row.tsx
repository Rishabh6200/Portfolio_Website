"use client"

import * as React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { TableRow, TableCell } from "@/components/ui/table"
import { FlexRender } from "@tanstack/react-table"
import type { Row, RowData } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import type { DataTableRowContextValue } from "./types"

const DataTableRowContext = React.createContext<DataTableRowContextValue | null>(
  null
)

export function useDataTableRow(): DataTableRowContextValue {
  const context = React.useContext(DataTableRowContext)
  if (!context) {
    return {
      attributes: {} as any,
      listeners: undefined,
      isDragging: false,
    }
  }
  return context
}

interface DataTableRowProps<TData extends RowData = Record<string, any>> {
  row: Row<any, TData>
  rowId: string
  reorderable?: boolean
  className?: string
  style?: React.CSSProperties
}

export function DataTableRow<TData extends RowData = Record<string, any>>({
  row,
  rowId,
  reorderable = false,
  className,
  style: userStyle,
  ...props
}: DataTableRowProps<TData> & React.HTMLAttributes<HTMLTableRowElement>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: rowId,
    disabled: !reorderable,
  })

  const style: React.CSSProperties = {
    // Translate prevents width/scale deformation during row drag
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.65 : 1,
    zIndex: isDragging ? 30 : undefined,
    position: isDragging ? "relative" : undefined,
    ...userStyle,
  }

  const cells = row.getVisibleCells
    ? row.getVisibleCells()
    : row.getAllCells()

  return (
    <DataTableRowContext.Provider
      value={{
        attributes,
        listeners,
        isDragging,
      }}
    >
      <TableRow
        ref={setNodeRef}
        style={style}
        data-state={isDragging ? "selected" : undefined}
        className={cn(
          "transition-colors",
          isDragging &&
            "bg-muted/80 opacity-60 shadow-lg border-primary/40 pointer-events-none",
          className
        )}
        {...props}
      >
        {cells.map((cell: any) => (
          <TableCell
            key={cell.id}
            style={{
              width: cell.column?.getSize ? cell.column.getSize() : undefined,
            }}
          >
            <FlexRender cell={cell} />
          </TableCell>
        ))}
      </TableRow>
    </DataTableRowContext.Provider>
  )
}
