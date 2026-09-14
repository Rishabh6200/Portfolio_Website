"use client"

import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import {
  Edit3,
  Trash2,
  Sparkles,
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
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { DeleteConfirmDialog } from "@/app/admin/_components/delete-confirm-dialog"
import { EmptyState } from "@/components/custom-ui/empty-state"
import { deleteSkillAction, reorderSkillsAction, updateSkillLevelAction } from "@/app/admin/skills/actions"
import { DragHandle, SortableRow } from "@/components/ui/sortable-row"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

const PROFICIENCY_LEVELS: {
  value: "Proficient" | "Advanced" | "Expert"
  label: string
  dotColor: string
}[] = [
  { value: "Expert", label: "Expert", dotColor: "bg-indigo-500" },
  { value: "Advanced", label: "Advanced", dotColor: "bg-sky-500" },
  { value: "Proficient", label: "Proficient", dotColor: "bg-emerald-500" },
]

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

  // Level quick-change state
  const [updatingSkillId, setUpdatingSkillId] = useState<string | null>(null)

  async function handleLevelChange(
    skillId: string,
    skillName: string,
    newLevel: "Proficient" | "Advanced" | "Expert"
  ) {
    const previousSkills = [...skills]
    // Optimistic UI update
    setSkills((prev) =>
      prev.map((s) => (s._id === skillId ? { ...s, level: newLevel } : s))
    )
    setUpdatingSkillId(skillId)

    try {
      const res = await updateSkillLevelAction(skillId, newLevel)
      if (res.success) {
        toast.success(`Updated "${skillName}" to ${newLevel}`, { duration: 1500 })
      } else {
        setSkills(previousSkills)
        toast.error(res.error || "Failed to update proficiency level")
      }
    } catch {
      setSkills(previousSkills)
      toast.error("An error occurred while updating proficiency level")
    } finally {
      setUpdatingSkillId(null)
    }
  }

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
      <EmptyState
        icon={Sparkles}
        title="No skills found in this category"
        description="There are no technologies registered under this category yet. Add your first technology to get started."
        actionLabel="Add Skill"
        actionHref={
          activeCategoryId
            ? `/admin/skills/new?categoryId=${activeCategoryId}`
            : "/admin/skills/new"
        }
      />
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
                <TableHead className="w-32">Proficiency</TableHead>
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

                          {/* Quick Changeable Proficiency Level */}
                          <TableCell>
                            <Select
                              value={skill.level}
                              onValueChange={(val) => {
                                if (val && val !== skill.level) {
                                  handleLevelChange(
                                    skill._id,
                                    skill.name,
                                    val as "Proficient" | "Advanced" | "Expert"
                                  )
                                }
                              }}
                              items={PROFICIENCY_LEVELS.map((lvl) => ({
                                value: lvl.value,
                                label: lvl.label,
                              }))}
                              disabled={updatingSkillId === skill._id}
                            >
                              <SelectTrigger
                                size="sm"
                                className={cn(
                                  "h-6! w-26 px-2.5 py-0! rounded-full text-[11px] sm:text-xs font-semibold border justify-between transition-all cursor-pointer shadow-none group select-none leading-none",
                                  "[&_svg]:size-3 [&_svg]:opacity-60 group-hover:[&_svg]:opacity-100 [&_svg]:transition-opacity [&_svg]:text-current",
                                  skill.level === "Expert"
                                    ? "bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground border-transparent hover:bg-primary/90 dark:hover:bg-primary/90 shadow-xs"
                                    : skill.level === "Advanced"
                                    ? "bg-secondary text-secondary-foreground dark:bg-secondary dark:text-secondary-foreground border-border/80 hover:bg-secondary/80"
                                    : "bg-background text-muted-foreground dark:bg-background/80 border-border hover:bg-muted hover:text-foreground",
                                  updatingSkillId === skill._id && "opacity-60 cursor-wait pointer-events-none"
                                )}
                              >
                                <SelectValue className="leading-none">
                                  {(val) => val || skill.level}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent align="start" className="min-w-36 p-1">
                                {PROFICIENCY_LEVELS.map((lvl) => (
                                  <SelectItem
                                    key={lvl.value}
                                    value={lvl.value}
                                    label={lvl.label}
                                    className="py-1.5 text-xs font-medium cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={cn(
                                          "h-2 w-2 rounded-full shrink-0",
                                          lvl.dotColor
                                        )}
                                      />
                                      <span>{lvl.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
      <DeleteConfirmDialog
        open={Boolean(skillToDelete)}
        onOpenChange={(open) => !open && setSkillToDelete(null)}
        title="Delete Skill"
        itemName={skillToDelete?.name}
        description={
          <>
            Are you sure you want to delete{" "}
            <strong className="text-foreground">
              &ldquo;{skillToDelete?.name}&rdquo;
            </strong>
            ? This competency will be permanently removed from your portfolio.
          </>
        }
        confirmText="Delete Skill"
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
      />
    </>
  )
}
