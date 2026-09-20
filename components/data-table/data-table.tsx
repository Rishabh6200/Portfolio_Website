"use client"

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { useTable, FlexRender } from "@tanstack/react-table"
import type { RowData } from "@tanstack/react-table"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { DataTableRow } from "./data-table-row"
import { DataTableSkeleton, DataTableSkeletonRows } from "./data-table-skeleton"
import type { DataTableProps } from "./types"
import { Suspense, use, useCallback, useEffect, useId, useMemo, useState } from "react"

function isPromise<T>(value: any): value is Promise<T> {
   return Boolean(value && typeof value.then === "function")
}

export function DataTable<TData extends RowData = Record<string, any>>({
   data,
   columns,
   skeletonRowCount = 5,
   className,
   tableClassName,
   headerClassName,
   ...props
}: DataTableProps<TData>) {
   if (isPromise<TData[]>(data)) {
      return (
         <Suspense
            fallback={
               <DataTableSkeleton
                  columns={columns}
                  rowCount={skeletonRowCount}
                  className={className}
                  tableClassName={tableClassName}
                  headerClassName={headerClassName}
               />
            }
         >
            <DataTableAsync
               {...props}
               dataPromise={data}
               columns={columns}
               skeletonRowCount={skeletonRowCount}
               className={className}
               tableClassName={tableClassName}
               headerClassName={headerClassName}
            />
         </Suspense>
      )
   }

   return (
      <DataTableResolved
         {...props}
         data={data ?? []}
         columns={columns}
         skeletonRowCount={skeletonRowCount}
         className={className}
         tableClassName={tableClassName}
         headerClassName={headerClassName}
      />
   )
}

function DataTableAsync<TData extends RowData = Record<string, any>>({
   dataPromise,
   ...props
}: Omit<DataTableProps<TData>, "data"> & { dataPromise: Promise<TData[]> }) {
   const resolvedData = use(dataPromise)
   return <DataTableResolved {...props} data={resolvedData ?? []} />
}

function DataTableResolved<TData extends RowData = Record<string, any>>({
   columns,
   data,
   getRowId,
   reorderable,
   onReorder,
   isLoading = false,
   skeletonRowCount = 5,
   emptyState,
   className,
   tableClassName,
   headerClassName,
   rowClassName,
}: Omit<DataTableProps<TData>, "data"> & { data: TData[] }) {
   const dndId = useId()
   const isReorderEnabled = reorderable ?? Boolean(onReorder)

   // Local state for immediate smooth optimistic reordering
   const [items, setItems] = useState<TData[]>(data)

   useEffect(() => {
      setItems(data)
   }, [data])

   const resolveRowId = useCallback(
      (row: TData, index: number): string => {
         if (getRowId) return getRowId(row, index)
         const record = row as Record<string, any>
         return record?.id ?? record?._id ?? String(index)
      },
      [getRowId]
   )

   const rowIds = useMemo(() => {
      return items.map((item, index) => resolveRowId(item, index))
   }, [items, resolveRowId])

   const table = useTable({
      features: {},
      columns,
      data: items,
      getRowId: (row, index) => resolveRowId(row, index),
   })

   // Configure accessible sensors with movement constraints to avoid misclicks
   const sensors = useSensors(
      useSensor(PointerSensor, {
         activationConstraint: {
            distance: 5,
         },
      }),
      useSensor(TouchSensor, {
         activationConstraint: {
            delay: 200,
            tolerance: 5,
         },
      }),
      useSensor(KeyboardSensor, {
         coordinateGetter: sortableKeyboardCoordinates,
      })
   )

   const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return

      const oldIndex = rowIds.indexOf(String(active.id))
      const newIndex = rowIds.indexOf(String(over.id))

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return

      const previousItems = items
      const reordered = arrayMove(items, oldIndex, newIndex)
      setItems(reordered)

      if (onReorder) {
         try {
            const res = onReorder(reordered, {
               activeId: String(active.id),
               overId: String(over.id),
               oldIndex,
               newIndex,
               movedItem: items[oldIndex],
            })
            if (res instanceof Promise) {
               res.catch(() => {
                  // Revert back if the async handler rejects
                  setItems(previousItems)
               })
            }
         } catch {
            setItems(previousItems)
         }
      }
   }

   const rows = table.getRowModel().rows
   const columnCount = columns.length

   const renderContent = () => {
      if (isLoading) {
         return <DataTableSkeletonRows columns={columns} rowCount={skeletonRowCount} />
      }

      if (rows.length === 0) {
         return (
            <TableRow className="hover:bg-transparent">
               <TableCell
                  colSpan={columnCount}
                  className="h-44 text-center text-muted-foreground"
               >
                  {emptyState || (
                     <div className="flex flex-col items-center justify-center gap-1.5 py-6">
                        <p className="text-sm font-medium text-foreground">No records found</p>
                        <p className="text-xs text-muted-foreground">
                           There are no items to display right now.
                        </p>
                     </div>
                  )}
               </TableCell>
            </TableRow>
         )
      }

      if (isReorderEnabled) {
         return (
            <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
               {rows.map((row) => {
                  const rowClass =
                     typeof rowClassName === "function"
                        ? rowClassName(row as any)
                        : rowClassName

                  return (
                     <DataTableRow
                        key={row.id}
                        row={row as any}
                        rowId={row.id}
                        reorderable={true}
                        className={rowClass}
                     />
                  )
               })}
            </SortableContext>
         )
      }

      return rows.map((row) => {
         const rowClass =
            typeof rowClassName === "function"
               ? rowClassName(row as any)
               : rowClassName

         return (
            <DataTableRow
               key={row.id}
               row={row as any}
               rowId={row.id}
               reorderable={false}
               className={rowClass}
            />
         )
      })
   }

   const tableElement = (
      <div
         className={cn(
            "rounded-xl border border-border bg-card overflow-hidden shadow-xs",
            className
         )}
      >
         <Table className={tableClassName}>
            <TableHeader className={cn("bg-muted/40", headerClassName)}>
               {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent">
                     {headerGroup.headers.map((header) => (
                        <TableHead
                           key={header.id}
                           colSpan={header.colSpan}
                           style={{
                              width: header.getSize ? header.getSize() : undefined,
                           }}
                           className="py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider"
                        >
                           {header.isPlaceholder ? null : (
                              <FlexRender header={header} />
                           )}
                        </TableHead>
                     ))}
                  </TableRow>
               ))}
            </TableHeader>
            <TableBody>{renderContent()}</TableBody>
         </Table>
      </div>
   )

   if (isReorderEnabled) {
      return (
         <DndContext
            id={dndId}
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
         >
            {tableElement}
         </DndContext>
      )
   }

   return tableElement
}
