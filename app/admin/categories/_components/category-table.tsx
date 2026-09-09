"use client"

import { useState } from "react"
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
import { toast } from "sonner"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  deleteCategoryAction,
} from "@/app/admin/categories/actions"

export interface SerializedCategory {
  _id: string
  name: string
  slug: string
  description?: string
  icon?: string
  order: number
  color?: string
  createdAt?: string
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

  // Delete Dialog state
  const [categoryToDelete, setCategoryToDelete] = useState<SerializedCategory | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function confirmDelete() {
    if (!categoryToDelete) return

    setIsDeleting(true)
    try {
      const res = await deleteCategoryAction(categoryToDelete._id)
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c._id !== categoryToDelete._id))
        toast.success(`Deleted category "${categoryToDelete.name}"`)
        setCategoryToDelete(null)
      } else {
        toast.error(res.error || "Failed to delete category")
      }
    } catch {
      toast.error("An error occurred while deleting")
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-3 px-4">Category</TableHead>
              <TableHead className="py-3 px-4">Icon</TableHead>
              <TableHead className="py-3 px-4">Description</TableHead>
              <TableHead className="py-3 px-4 text-center">Order</TableHead>
              <TableHead className="py-3 px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((c) => {
              const IconComp = (c.icon && ICON_MAP[c.icon]) || Layers

              return (
                <TableRow key={c._id}>
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
                      #{c.order}
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
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Modal (shadcn Dialog) */}
      <Dialog
        open={Boolean(categoryToDelete)}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg">Delete Category</DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete{" "}
              <strong className="text-foreground font-semibold">
                &ldquo;{categoryToDelete?.name}&rdquo;
              </strong>
              ? This action cannot be undone. If any projects are assigned to this category, deletion will be blocked until they are reassigned.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="default"
              onClick={() => setCategoryToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="default"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Category</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
