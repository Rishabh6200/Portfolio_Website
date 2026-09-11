"use client"

import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import {
  Edit3,
  Trash2,
  Layers,
  Database,
  Loader2,
  Plus,
  Server,
  Layout,
  Cloud,
  Cpu,
  Code2,
  Terminal,
} from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { toast } from "sonner"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { DeleteConfirmDialog } from "@/app/admin/_components/delete-confirm-dialog"
import {
  deleteCategoryAction,
  reorderCategoriesAction,
} from "@/app/admin/categories/actions"
import { DragHandle, SortableRow } from "@/components/ui/sortable-row"

export interface SerializedCategory {
  _id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  order: number
}

interface CategoryTableProps {
  categories: SerializedCategory[]
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Server,
  Layout,
  Cloud,
  Database,
  Cpu,
  Code2,
  Terminal,
}

export function CategoryTable({ categories: initialCategories }: CategoryTableProps) {
  const [categories, setCategories] = useState<SerializedCategory[]>(initialCategories)
  const [, startTransition] = useTransition()

  // Delete Dialog state
  const [categoryToDelete, setCategoryToDelete] = useState<SerializedCategory | null>(null)
  const [deleteWithSkills, setDeleteWithSkills] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setCategories(initialCategories)
  }, [initialCategories])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = categories.findIndex((c) => c._id === active.id)
    const newIndex = categories.findIndex((c) => c._id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(categories, oldIndex, newIndex)
      setCategories(reordered)

      const payload = reordered.map((item, idx) => ({
        id: item._id,
        order: idx,
      }))

      startTransition(async () => {
        const res = await reorderCategoriesAction(payload)
        if (res.success) {
          toast.success("Category order updated", { duration: 1500 })
        } else {
          toast.error("Failed to update category order")
          setCategories(categories) // rollback
        }
      })
    }
  }

  async function confirmDelete() {
    if (!categoryToDelete) return

    setIsDeleting(true)
    try {
      const res = await deleteCategoryAction(categoryToDelete._id, deleteWithSkills)
      if (res?.success) {
        setCategories((prev) => prev.filter((c) => c._id !== categoryToDelete._id))
        toast.success(`Deleted category "${categoryToDelete.name}"`)
        setCategoryToDelete(null)
        setDeleteWithSkills(false)
      } else {
        toast.error("Cannot delete category", {
          description: res?.error || "Failed to delete category.",
        })
      }
    } catch (err: unknown) {
      console.error("Delete category error:", err)
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while deleting. Please refresh the page and try again."
      toast.error("Deletion failed", {
        description: message,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-4 bg-card/50">
        <div className="inline-flex p-3.5 rounded-2xl bg-muted text-muted-foreground">
          <Layers className="h-8 w-8" />
        </div>
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-foreground">
            No categories found
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Categories organize your portfolio projects and technical competencies. Create your first category to get started.
          </p>
        </div>
        <div className="flex items-center justify-center pt-3">
          <Link
            href="/admin/categories/new"
            className={buttonVariants({ size: "default" })}
          >
            <Plus className="h-4 w-4" />
            <span>Create Category</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10 px-2 text-center">
                  <span className="sr-only">Drag</span>
                </TableHead>
                <TableHead className="py-3 px-4">Category</TableHead>
                <TableHead className="py-3 px-4">Icon</TableHead>
                <TableHead className="py-3 px-4">Description</TableHead>
                <TableHead className="py-3 px-4 text-center w-28">Order</TableHead>
                <TableHead className="py-3 px-4 text-right w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SortableContext
                items={categories.map((c) => c._id)}
                strategy={verticalListSortingStrategy}
              >
                {categories.map((c, index) => {
                  const IconComp = (c.icon && ICON_MAP[c.icon]) || Layers

                  return (
                    <SortableRow key={c._id} id={c._id}>
                      {({ attributes, listeners }) => (
                        <>
                          {/* Drag Handle */}
                          <TableCell className="w-10 px-2 text-center">
                            <DragHandle attributes={attributes} listeners={listeners} />
                          </TableCell>

                          {/* Name + Slug */}
                          <TableCell className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <span
                                className="h-3 w-3 rounded-full shrink-0"
                                style={{ backgroundColor: c.color || "#6366f1" }}
                              />
                              <div>
                                <Link
                                  href={`/admin/categories/${c._id}`}
                                  className="text-sm font-semibold text-foreground hover:underline"
                                >
                                  {c.name}
                                </Link>
                                <p className="text-xs font-mono text-muted-foreground mt-0.5">
                                  slug: {c.slug}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          {/* Icon */}
                          <TableCell className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <IconComp className="h-4 w-4" />
                              </div>
                              <span className="text-xs font-mono text-muted-foreground">
                                {c.icon || "Server"}
                              </span>
                            </div>
                          </TableCell>

                          {/* Description */}
                          <TableCell className="py-3.5 px-4 max-w-md">
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {c.description || "—"}
                            </p>
                          </TableCell>

                          {/* Order */}
                          <TableCell className="py-3.5 px-4 text-center">
                            <Badge variant="outline" className="font-mono text-xs">
                              #{index}
                            </Badge>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Link
                                href={`/admin/categories/${c._id}`}
                                title="Edit Category"
                                className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                              >
                                <Edit3 className="h-4 w-4 text-muted-foreground" />
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setCategoryToDelete(c)}
                                className="hover:text-destructive hover:bg-destructive/10"
                                title="Delete Category"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </SortableRow>
                  )
                })}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        open={Boolean(categoryToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setCategoryToDelete(null)
            setDeleteWithSkills(false)
          }
        }}
        title="Delete Category"
        itemName={categoryToDelete?.name}
        confirmText="Delete Category"
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
      >
        <div className="py-2">
          <div className="flex items-start space-x-3 rounded-lg border border-border p-3.5 bg-muted/30">
            <Checkbox
              id="cascade-delete"
              checked={deleteWithSkills}
              onCheckedChange={(checked) => setDeleteWithSkills(Boolean(checked))}
              className="mt-0.5"
            />
            <div className="space-y-1 leading-none">
              <label
                htmlFor="cascade-delete"
                className="text-xs font-medium text-foreground cursor-pointer"
              >
                Cascade delete associated skills
              </label>
              <p className="text-[11px] text-muted-foreground">
                Check this if you want to automatically remove all skills belonging to this category.
              </p>
            </div>
          </div>
        </div>
      </DeleteConfirmDialog>
    </>
  )
}
