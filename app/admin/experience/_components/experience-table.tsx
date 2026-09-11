"use client"

import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import { Edit3, Trash2, Briefcase, Plus, MapPin, Calendar } from "lucide-react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { toast } from "sonner"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { DeleteConfirmDialog } from "@/app/admin/_components/delete-confirm-dialog"
import { deleteExperienceAction, reorderExperiencesAction } from "../actions"
import { DragHandle, SortableRow } from "@/components/ui/sortable-row"

export interface PopulatedSkill {
  _id: string
  name: string
  level?: string
  categoryId?: { _id: string; name: string; color?: string } | string
}

export interface SerializedExperience {
  _id: string
  company: string
  role: string
  period: string
  location: string
  locationType?: string
  type: string
  description: string
  achievements: string[]
  skills?: (PopulatedSkill | string)[]
  order: number
  updatedAt?: string
}

interface ExperienceTableProps {
  experiences: SerializedExperience[]
}

export function ExperienceTable({ experiences: initialExperiences }: ExperienceTableProps) {
  const [experiences, setExperiences] = useState<SerializedExperience[]>(initialExperiences)
  const [, startTransition] = useTransition()

  const [experienceToDelete, setExperienceToDelete] = useState<SerializedExperience | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setExperiences(initialExperiences)
  }, [initialExperiences])

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = experiences.findIndex((e) => e._id === active.id)
    const newIndex = experiences.findIndex((e) => e._id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const newOrder = arrayMove(experiences, oldIndex, newIndex)
    setExperiences(newOrder)

    const payload = newOrder.map((item, index) => ({
      id: item._id,
      order: index,
    }))

    startTransition(async () => {
      const res = await reorderExperiencesAction(payload)
      if (res.success) {
        toast.success("Order updated successfully")
      } else {
        toast.error(res.error || "Failed to save new order")
        setExperiences(initialExperiences)
      }
    })
  }

  const handleDelete = async () => {
    if (!experienceToDelete) return
    setIsDeleting(true)

    try {
      const res = await deleteExperienceAction(experienceToDelete._id)
      if (res.success) {
        toast.success(`Deleted experience at "${experienceToDelete.company}"`)
        setExperiences((prev) => prev.filter((e) => e._id !== experienceToDelete._id))
        setExperienceToDelete(null)
      } else {
        toast.error(res.error || "Failed to delete experience")
      }
    } catch {
      toast.error("An unexpected error occurred while deleting")
    } finally {
      setIsDeleting(false)
    }
  }

  if (experiences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
          <Briefcase className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">No experience entries found</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          Add your career milestones, roles, and companies to display your track record on your portfolio.
        </p>
        <Link
          href="/admin/experience/new"
          className={buttonVariants({ size: "sm", className: "mt-4 gap-1.5" })}
        >
          <Plus className="h-4 w-4" />
          <span>Add First Experience</span>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10 text-center">
                  <span className="sr-only">Reorder</span>
                </TableHead>
                <TableHead className="min-w-55">Role & Company</TableHead>
                <TableHead className="min-w-35">Period</TableHead>
                <TableHead className="min-w-30">Location & Type</TableHead>
                <TableHead className="min-w-50">Technologies</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SortableContext
                items={experiences.map((e) => e._id)}
                strategy={verticalListSortingStrategy}
              >
                {experiences.map((exp) => {
                  const isCurrent = exp.period.toLowerCase().includes("present")

                  return (
                    <SortableRow key={exp._id} id={exp._id}>
                      {({ attributes, listeners }) => (
                        <>
                          <TableCell className="text-center py-3">
                            <DragHandle attributes={attributes} listeners={listeners} />
                          </TableCell>

                          <TableCell className="py-3">
                            <div className="space-y-1">
                              <span className="font-semibold text-sm text-foreground hover:underline">
                                <Link href={`/admin/experience/${exp._id}`}>
                                  {exp.role}
                                </Link>
                              </span>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <span className="font-medium text-foreground/80">{exp.company}</span>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="py-3">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
                              <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                                {exp.period}
                              </span>
                              {isCurrent && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 shrink-0"
                                >
                                  Current
                                </Badge>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="py-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3 shrink-0" />
                                <span>
                                  {exp.locationType &&
                                    exp.locationType !== "Remote" &&
                                    !exp.location.toLowerCase().includes(exp.locationType.toLowerCase())
                                    ? `${exp.location} (${exp.locationType})`
                                    : exp.location || exp.locationType || "Remote"}
                                </span>
                              </div>
                              <Badge variant="secondary" className="text-[10px] font-normal px-1.5 py-0">
                                {exp.type}
                              </Badge>
                            </div>
                          </TableCell>

                          <TableCell className="py-3">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {Array.isArray(exp.skills) && exp.skills.length > 0 ? (
                                exp.skills.slice(0, 4).map((skill) => {
                                  const name = typeof skill === "object" ? skill.name : String(skill)
                                  return (
                                    <span
                                      key={typeof skill === "object" ? skill._id : skill}
                                      className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border truncate"
                                    >
                                      {name}
                                    </span>
                                  )
                                })
                              ) : (
                                <span className="text-xs text-muted-foreground italic">None</span>
                              )}
                              {Array.isArray(exp.skills) && exp.skills.length > 4 && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground">
                                  +{exp.skills.length - 4}
                                </span>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                href={`/admin/experience/${exp._id}`}
                                className={buttonVariants({
                                  variant: "ghost",
                                  size: "icon",
                                  className: "h-8 w-8 text-muted-foreground hover:text-foreground",
                                })}
                                title="Edit experience"
                              >
                                <Edit3 className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setExperienceToDelete(exp)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                title="Delete experience"
                              >
                                <Trash2 className="h-4 w-4" />
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

      <DeleteConfirmDialog
        open={Boolean(experienceToDelete)}
        onOpenChange={(open) => !open && setExperienceToDelete(null)}
        title="Delete Experience Entry"
        itemName={experienceToDelete ? `${experienceToDelete.role} at ${experienceToDelete.company}` : undefined}
        description={
          <>
            Are you sure you want to delete the experience role{" "}
            <strong className="text-foreground font-semibold">
              &ldquo;{experienceToDelete?.role} at {experienceToDelete?.company}&rdquo;
            </strong>
            ? This action cannot be undone and will remove it from your public portfolio.
          </>
        }
        confirmText="Delete Experience"
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  )
}
