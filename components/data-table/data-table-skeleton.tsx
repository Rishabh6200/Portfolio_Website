"use client"

import * as React from "react"
import type { ColumnDef, RowData } from "@tanstack/react-table"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export interface DataTableSkeletonRowsProps<TData extends RowData = Record<string, any>> {
   columns: ColumnDef<any, TData, any>[]
   rowCount?: number
}

function renderColumnSkeletonCell<TData extends RowData>(
   col: ColumnDef<any, TData, any>,
   colIndex: number
) {
   const colId = col.id?.toLowerCase() || ""

   if (colId === "drag-handle") {
      return (
         <div className="flex items-center justify-center">
            <Skeleton className="h-4 w-4 rounded" />
         </div>
      )
   }

   if (colId === "project" || colId === "title") {
      return (
         <div className="flex items-center gap-3.5">
            <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
            <div className="space-y-1.5 min-w-0">
               <Skeleton className="h-4 w-32" />
               <Skeleton className="h-3 w-20" />
            </div>
         </div>
      )
   }

   if (colId === "skills" || colId === "tags") {
      return (
         <div className="flex items-center gap-1.5 max-w-72">
            <Skeleton className="h-5 w-14 rounded-md shrink-0" />
            <Skeleton className="h-5 w-12 rounded-md shrink-0" />
            <Skeleton className="h-5 w-16 rounded-md shrink-0" />
         </div>
      )
   }

   if (colId === "status") {
      return <Skeleton className="h-6 w-18 rounded-md" />
   }

   if (colId === "actions") {
      return (
         <div className="flex items-center justify-end gap-1.5">
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
         </div>
      )
   }

   if (colId === "role") {
      return <Skeleton className="h-4 w-24" />
   }

   // Default text skeleton with slightly alternating widths
   const widths = ["w-20", "w-28", "w-24", "w-32"]
   const widthClass = widths[colIndex % widths.length]
   return <Skeleton className={cn("h-4", widthClass)} />
}

export function DataTableSkeletonRows<TData extends RowData = Record<string, unknown>>({
   columns,
   rowCount = 5,
}: DataTableSkeletonRowsProps<TData>) {
   return Array.from({ length: rowCount }).map((_, rIndex) => (
      <TableRow key={`skeleton-row-${rIndex}`} className="hover:bg-transparent">
         {columns.map((col, cIndex) => (
            <TableCell
               key={`skeleton-cell-${rIndex}-${col.id ?? cIndex}`}
               style={{
                  width: col.size ? col.size : undefined,
               }}
               className="py-3 px-4"
            >
               {renderColumnSkeletonCell(col, cIndex)}
            </TableCell>
         ))}
      </TableRow>
   ))
}

export interface DataTableSkeletonProps<TData extends RowData = Record<string, any>> {
   columns: ColumnDef<any, TData, any>[]
   rowCount?: number
   className?: string
   tableClassName?: string
   headerClassName?: string
}

export function DataTableSkeleton<TData extends RowData = Record<string, any>>({
   columns,
   rowCount = 5,
   className,
   tableClassName,
   headerClassName,
}: DataTableSkeletonProps<TData>) {
   return (
      <div
         className={cn(
            "rounded-xl border border-border bg-card overflow-hidden shadow-xs",
            className
         )}
      >
         <Table className={tableClassName}>
            <TableHeader className={cn("bg-muted/40", headerClassName)}>
               <TableRow className="hover:bg-transparent">
                  {columns.map((col, idx) => {
                     const headerContent =
                        typeof col.header === "function"
                           ? (col.header as (context: unknown) => React.ReactNode)({} as never)
                           : col.header

                     return (
                        <TableHead
                           key={col.id ?? `col-${idx}`}
                           style={{
                              width: col.size ? col.size : undefined,
                           }}
                           className={cn(
                              "py-3 px-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider",
                              col.id === "actions" && "text-right"
                           )}
                        >
                           {headerContent ?? null}
                        </TableHead>
                     )
                  })}
               </TableRow>
            </TableHeader>
            <TableBody>
               <DataTableSkeletonRows columns={columns} rowCount={rowCount} />
            </TableBody>
         </Table>
      </div>
   )
}
