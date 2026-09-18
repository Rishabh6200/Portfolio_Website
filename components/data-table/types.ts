import type React from "react"
import type { ColumnDef, Row, RowData } from "@tanstack/react-table"
import type { DraggableAttributes } from "@dnd-kit/core"
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities"

export interface DataTableReorderEvent<TData> {
  activeId: string
  overId: string
  oldIndex: number
  newIndex: number
  movedItem: TData
}

export interface DataTableProps<TData extends RowData = Record<string, any>> {
  columns: ColumnDef<any, TData, any>[]
  data: TData[]
  getRowId?: (row: TData, index: number) => string
  reorderable?: boolean
  onReorder?: (
    items: TData[],
    event: DataTableReorderEvent<TData>
  ) => void | Promise<void>
  isLoading?: boolean
  skeletonRowCount?: number
  emptyState?: React.ReactNode
  className?: string
  tableClassName?: string
  headerClassName?: string
  rowClassName?: ((row: Row<any, TData>) => string | undefined) | string
}

export interface DragHandleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  attributes?: DraggableAttributes
  listeners?: SyntheticListenerMap
}

export interface DataTableRowContextValue {
  attributes: DraggableAttributes
  listeners: SyntheticListenerMap | undefined
  isDragging: boolean
}
