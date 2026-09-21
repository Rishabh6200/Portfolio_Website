"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { DataTable, createDragColumn } from "@/components/data-table"
import { toast } from "@/components/ui/toast"
import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { Edit3, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DynamicIcon, type IconName } from "lucide-react/dynamic"
import { deleteCategoryAction, reorderCategoriesAction } from "../actions"
import ConfirmDialog from "@/components/dialogs/confirm-dialog"

export interface CategoryItem {
   id: string
   color: string
   name: string
   slug: string
   icon: string
   description: string
   order: number
}

export interface CategoryTableProps {
   categories: CategoryItem[] | Promise<CategoryItem[]>
}

export default function CategoryTable({ categories }: CategoryTableProps) {
   const [isPending, startTransition] = useTransition()
   const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null)

   const handleConfirmDelete = () => {
      if (!deletingCategory) return

      startTransition(async () => {
         const result = await deleteCategoryAction(deletingCategory.id)
         setDeletingCategory(null)
         toast.add({
            type: result.success ? "success" : "error",
            title: result.success ? "Category deleted" : "Delete failed",
            description: result.success
               ? `Category "${deletingCategory.name}" deleted successfully.`
               : result.error,
         })
      })
   }

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const columns = useMemo<ColumnDef<any, CategoryItem, unknown>[]>(
      () => [
         createDragColumn<CategoryItem>(),
         {
            id: "category",
            header: "Category",
            cell: ({ row }) => (
               <div className="flex items-center gap-3">
                  <span
                     className="h-3 w-3 rounded-full shrink-0"
                     style={{ backgroundColor: row.original.color || "#6366f1" }}
                  />
                  <div>
                     <Link
                        href={`/console/categories/${row.original.id}`}
                        className="text-sm font-semibold text-foreground hover:underline"
                     >
                        {row.original.name}
                     </Link>
                     <p className="text-xs font-mono text-muted-foreground mt-0.5">
                        slug: {row.original.slug}
                     </p>
                  </div>
               </div>
            ),
         },
         {
            id: "icon",
            header: "Icon",
            cell: ({ row }) => {
               const iconName = (row.original.icon?.toLowerCase() || "folder") as IconName
               return (
                  <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                     <DynamicIcon name={iconName} size={16} />
                     <span className="capitalize">{row.original.icon}</span>
                  </span>
               )
            },
         },
         {
            id: "description",
            header: "Description",
            cell: ({ row }) => (
               <p className="text-sm text-muted-foreground max-w-sm truncate" title={row.original.description}>
                  {row.original.description || "—"}
               </p>
            ),
         },
         {
            id: "order",
            header: "Order",
            cell: ({ row }) => (
               <Badge variant="outline" className="font-mono text-xs">
                  #{row.original.order}
               </Badge>
            ),
         },
         {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => (
               <div className="flex items-center justify-end gap-1.5">
                  <Link
                     href={`/console/categories/${row.original.id}`}
                     title="Edit Category"
                     className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                  >
                     <Edit3 className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Button
                     variant="ghost"
                     size="icon-sm"
                     onClick={() => setDeletingCategory(row.original)}
                     className="hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                     title="Delete Category"
                  >
                     <Trash2 className="h-4 w-4" />
                  </Button>
               </div>
            ),
         },
      ],
      []
   )

   return (
      <>
         <div className="space-y-3">
            <DataTable<CategoryItem>
               columns={columns}
               data={categories}
               reorderable={true}
               getRowId={(p) => p.id}
               onReorder={async (newItems) => {
                  const reorderPromise = new Promise<{ name: string }>(
                     async (resolve, reject) => {
                        try {
                           const result = await reorderCategoriesAction(
                              newItems.map((c) => c.id)
                           )
                           if (!result.success) {
                              reject(
                                 new Error(result.error || "Failed to update category order")
                              )
                           } else {
                              resolve({ name: "Category order" })
                           }
                        } catch (err) {
                           reject(err)
                        }
                     }
                  )

                  toast.promise(reorderPromise, {
                     loading: "Updating category order…",
                     success: (data) => `${data.name} updated.`,
                     error: (err) =>
                        err instanceof Error
                           ? err.message
                           : "Could not update category order.",
                  })
               }}
            />
         </div>

         <ConfirmDialog
            open={!!deletingCategory}
            onOpenChange={(open) => !open && setDeletingCategory(null)}
            title="Delete Category"
            itemName={deletingCategory?.name}
            variant="destructive"
            confirmText="Delete"
            isPending={isPending}
            onConfirm={handleConfirmDelete}
         />
      </>
   )
}