"use client"

import type { ColumnDef, RowData } from "@tanstack/react-table"
import { DataTableDragHandle } from "./data-table-drag-handle"

/**
 * Convenience helper to create a drag handle column definition for TanStack Table
 */
export function createDragColumn<TData extends RowData = Record<string, any>>(): ColumnDef<any, TData, any> {
  return {
    id: "drag-handle",
    header: () => <span className="sr-only">Drag to reorder</span>,
    cell: () => <DataTableDragHandle />,
    size: 40,
  }
}
