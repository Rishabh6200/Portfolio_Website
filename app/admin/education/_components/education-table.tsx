"use client"

import { useState, useEffect, useTransition } from "react"
import Link from "next/link"
import { Edit3, Trash2, GraduationCap, Plus, MapPin, Calendar, Award } from "lucide-react"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { toast } from "sonner"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { DeleteConfirmDialog } from "@/app/admin/_components/delete-confirm-dialog"
import { deleteEducationAction, reorderEducationAction } from "../actions"
import { DragHandle, SortableRow } from "@/components/ui/sortable-row"

export interface PopulatedSkill {
  _id: string
  name: string
  level?: string
  categoryId?: { _id: string; name: string; color?: string } | string
}

export interface SerializedEducation {
  _id: string
  institution: string
  degree: string
  fieldOfStudy?: string
  period: string
  location: string
  type?: string
  grade?: string
  description: string
  highlights?: string[]
  skills?: (PopulatedSkill | string)[]
  order: number
  updatedAt?: string
}

interface EducationTableProps {
  educationList: SerializedEducation[]
}

export function EducationTable({ educationList: initialList }: EducationTableProps) {
  const [items, setItems] = useState<SerializedEducation[]>(initialList)
  const [, startTransition] = useTransition()

  const [itemToDelete, setItemToDelete] = useState<SerializedEducation | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setItems(initialList)
  }, [initialList])

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

    const oldIndex = items.findIndex((e) => e._id === active.id)
    const newIndex = items.findIndex((e) => e._id === over.id)

    if (oldIndex === -1 || newIndex === -1) return

    const newOrder = arrayMove(items, oldIndex, newIndex)
    setItems(newOrder)

    const payload = newOrder.map((item, index) => ({
      id: item._id,
      order: index,
    }))

    startTransition(async () => {
      const res = await reorderEducationAction(payload)
      if (res.success) {
        toast.success("Order updated successfully")
      } else {
        toast.error(res.error || "Failed to save new order")
        setItems(initialList)
      }
    })
  }

  const handleDelete = async () => {
    if (!itemToDelete) return
    setIsDeleting(true)

    try {
      const res = await deleteEducationAction(itemToDelete._id)
      if (res.success) {
        toast.success(`Deleted "${itemToDelete.degree}" from ${itemToDelete.institution}`)
        setItems((prev) => prev.filter((e) => e._id !== itemToDelete._id))
        setItemToDelete(null)
      } else {
        toast.error(res.error || "Failed to delete education record")
      }
    } catch {
      toast.error("An unexpected error occurred while deleting")
    } finally {
      setIsDeleting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
          <GraduationCap className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">No education entries found</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          Add degrees, certifications, or coursework to showcase your formal qualifications and learning milestones.
        </p>
        <Link
          href="/admin/education/new"
          className={buttonVariants({ size: "sm", className: "mt-4 gap-1.5" })}
        >
          <Plus className="h-4 w-4" />
          <span>Add First Education</span>
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
                <TableHead className="min-w-55">Degree & Institution</TableHead>
                <TableHead className="min-w-28">Type</TableHead>
                <TableHead className="min-w-35">Period & Location</TableHead>
                <TableHead className="min-w-44">Related Skills</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SortableContext
                items={items.map((e) => e._id)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((edu) => {
                  const typeLabel = edu.type || "Degree"
                  const isCert = typeLabel.toLowerCase().includes("cert")

                  return (
                    <SortableRow key={edu._id} id={edu._id}>
                      {({ attributes, listeners }) => (
                        <>
                          <TableCell className="text-center py-3">
                            <DragHandle attributes={attributes} listeners={listeners} />
                          </TableCell>

                          <TableCell className="py-3">
                            <div className="space-y-1">
                              <span className="font-semibold text-sm text-foreground hover:underline">
                                <Link href={`/admin/education/${edu._id}`}>
                                  {edu.degree}
                                </Link>
                              </span>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <span className="font-medium text-foreground/80">{edu.institution}</span>
                                {edu.fieldOfStudy && (
                                  <>
                                    <span>•</span>
                                    <span>{edu.fieldOfStudy}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="py-3">
                            <Badge
                              variant="secondary"
                              className={`text-[10px] font-normal px-2 py-0.5 rounded-full ${
                                isCert
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                                  : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                              }`}
                            >
                              {typeLabel}
                            </Badge>
                          </TableCell>

                          <TableCell className="py-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3 shrink-0" />
                                <span className="font-mono whitespace-nowrap">{edu.period}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MapPin className="h-3 w-3 shrink-0" />
                                <span className="truncate max-w-35">{edu.location}</span>
                              </div>
                              {edu.grade && (
                                <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                                  <Award className="h-3 w-3 shrink-0" />
                                  <span className="truncate max-w-35">{edu.grade}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="py-3">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {Array.isArray(edu.skills) && edu.skills.length > 0 ? (
                                edu.skills.slice(0, 4).map((skill) => {
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
                              {Array.isArray(edu.skills) && edu.skills.length > 4 && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground">
                                  +{edu.skills.length - 4}
                                </span>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link
                                href={`/admin/education/${edu._id}`}
                                className={buttonVariants({
                                  variant: "ghost",
                                  size: "icon",
                                  className: "h-8 w-8 text-muted-foreground hover:text-foreground",
                                })}
                                title="Edit education record"
                              >
                                <Edit3 className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Link>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setItemToDelete(edu)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                title="Delete education record"
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
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Delete Education Entry"
        itemName={itemToDelete ? `${itemToDelete.degree} (${itemToDelete.institution})` : undefined}
        description={
          <>
            Are you sure you want to delete{" "}
            <strong className="text-foreground font-semibold">
              &ldquo;{itemToDelete?.degree} at {itemToDelete?.institution}&rdquo;
            </strong>
            ? This action cannot be undone and will remove it from your public portfolio.
          </>
        }
        confirmText="Delete Education"
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  )
}
