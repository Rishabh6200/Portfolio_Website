"use client"

import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import {
  Edit3,
  Trash2,
  Sparkles,
  Loader2,
  Plus,
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
import { deleteSkillAction, reorderSkillsAction } from "@/app/admin/skills/actions"
import { DragHandle, SortableRow } from "@/components/ui/sortable-row"

export interface SerializedSkill {
  _id: string
  name: string
  categoryId: {
    _id: string
    name: string
    slug?: string
    color?: string
  } | string
  level: "Proficient" | "Advanced" | "Expert"
  highlight: boolean
  order: number
  createdAt?: string
}

export interface SerializedCategory {
  _id: string
  name: string
  slug: string
  color?: string
}

interface SkillTableProps {
  skills: SerializedSkill[]
  categories: SerializedCategory[]
  activeCategoryId?: string
}

export function SkillTable({
  skills: initialSkills,
  categories,
  activeCategoryId,
}: SkillTableProps) {
  const [skills, setSkills] = useState<SerializedSkill[]>(initialSkills)
  const [, startTransition] = useTransition()

  // Delete Dialog state
  const [skillToDelete, setSkillToDelete] = useState<SerializedSkill | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Keep state in sync when category tab changes
  useEffect(() => {
    setSkills(initialSkills)
  }, [initialSkills])

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

    const oldIndex = skills.findIndex((s) => s._id === active.id)
    const newIndex = skills.findIndex((s) => s._id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(skills, oldIndex, newIndex)
      setSkills(reordered)

      const payload = reordered.map((item, idx) => ({
        id: item._id,
        order: idx,
      }))

      startTransition(async () => {
        const res = await reorderSkillsAction(payload)
        if (res.success) {
          toast.success("Skill order updated", { duration: 1500 })
        } else {
          toast.error("Failed to update skill order")
          setSkills(skills) // rollback
        }
      })
    }
  }

  async function confirmDelete() {
    if (!skillToDelete) return

    setIsDeleting(true)
    try {
      const res = await deleteSkillAction(skillToDelete._id)
      if (res.success) {
        setSkills((prev) => prev.filter((s) => s._id !== skillToDelete._id))
        toast.success(`Deleted skill "${skillToDelete.name}"`)
        setSkillToDelete(null)
      } else {
        toast.error(res.error || "Failed to delete skill")
      }
    } catch {
      toast.error("An error occurred while deleting skill")
    } finally {
      setIsDeleting(false)
    }
  }

  if (skills.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-4 bg-card/50">
        <div className="inline-flex p-3.5 rounded-2xl bg-muted text-muted-foreground">
          <Sparkles className="h-8 w-8 text-indigo-500" />
        </div>
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-foreground">
            No skills found in this category
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            There are no technologies registered under this category yet. Add your first technology to get started.
          </p>
        </div>
        <div className="flex items-center justify-center pt-3">
          <Link
            href={
              activeCategoryId
                ? `/admin/skills/new?categoryId=${activeCategoryId}`
                : "/admin/skills/new"
            }
            className={buttonVariants({ size: "default" })}
          >
            <Plus className="h-4 w-4" />
            <span>Add Skill</span>
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
                <TableHead className="w-75">Skill / Technology</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Proficiency</TableHead>
                <TableHead className="w-28 text-center">Sort Order</TableHead>
                <TableHead className="text-right w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SortableContext
                items={skills.map((s) => s._id)}
                strategy={verticalListSortingStrategy}
              >
                {skills.map((skill, index) => {
                  const categoryObj =
                    typeof skill.categoryId === "object"
                      ? skill.categoryId
                      : categories.find((c) => c._id === skill.categoryId)

                  return (
                    <SortableRow key={skill._id} id={skill._id}>
                      {({ attributes, listeners }) => (
                        <>
                          {/* Drag Handle */}
                          <TableCell className="w-10 px-2 text-center">
                            <DragHandle attributes={attributes} listeners={listeners} />
                          </TableCell>

                          {/* Name & Highlight */}
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <span className="font-semibold text-foreground">
                                {skill.name}
                              </span>
                              {skill.highlight && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                                  <Sparkles className="h-3 w-3" />
                                  <span>Highlighted</span>
                                </span>
                              )}
                            </div>
                          </TableCell>

                          {/* Category Badge */}
                          <TableCell>
                            {categoryObj ? (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-border bg-muted/50">
                                {categoryObj.color && (
                                  <span
                                    className="h-2 w-2 rounded-full shrink-0"
                                    style={{ backgroundColor: categoryObj.color }}
                                  />
                                )}
                                <span>{categoryObj.name}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>

                          {/* Proficiency Level */}
                          <TableCell>
                            <Badge
                              variant={
                                skill.level === "Expert"
                                  ? "default"
                                  : skill.level === "Advanced"
                                  ? "secondary"
                                  : "outline"
                              }
                              className="text-xs"
                            >
                              {skill.level}
                            </Badge>
                          </TableCell>

                          {/* Sort Order Badge */}
                          <TableCell className="text-center">
                            <span className="inline-flex items-center justify-center font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md min-w-8">
                              {index}
                            </span>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                href={`/admin/skills/${skill._id}`}
                                className={buttonVariants({
                                  variant: "ghost",
                                  size: "icon",
                                  className: "h-8 w-8 text-muted-foreground hover:text-foreground",
                                })}
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                                <span className="sr-only">Edit</span>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSkillToDelete(skill)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                <span className="sr-only">Delete</span>
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(skillToDelete)}
        onOpenChange={(open) => !open && setSkillToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Skill</DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete{" "}
              <strong className="text-foreground">
                &ldquo;{skillToDelete?.name}&rdquo;
              </strong>
              ? This competency will be permanently removed from your portfolio.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button
              variant="outline"
              onClick={() => setSkillToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Skill</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
