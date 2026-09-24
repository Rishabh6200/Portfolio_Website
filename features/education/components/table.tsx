"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { Award, Calendar, Edit3, MapPin, Trash2 } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable, createDragColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import ConfirmDialog from "@/components/dialogs/confirm-dialog"
import { deleteEducationAction, reorderEducationsAction } from "../actions"
import type { EducationItem } from "../db/queries"
import EducationStatusBadge from "./status-badge"

export interface EducationTableProps {
   educationList: EducationItem[] | Promise<EducationItem[]>
}

export default function EducationTable({ educationList }: EducationTableProps) {
   const [deleteTarget, setDeleteTarget] = useState<EducationItem | null>(null)
   const [isPending, startTransition] = useTransition()

   const handleConfirmDelete = () => {
      if (!deleteTarget) return

      startTransition(async () => {
         try {
            const result = await deleteEducationAction(deleteTarget.id)
            if (result.success) {
               toast.add({
                  type: "success",
                  title: "Education record deleted",
                  description: `"${deleteTarget.degree}" was deleted successfully.`,
               })
               setDeleteTarget(null)
            } else {
               toast.add({
                  type: "error",
                  title: "Delete failed",
                  description: result.error || "Could not delete education record.",
               })
            }
         } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to delete education record"
            toast.add({
               type: "error",
               title: "Delete failed",
               description: message,
            })
         }
      })
   }

   const columns = useMemo<ColumnDef<any, EducationItem, unknown>[]>(
      () => [
         createDragColumn<EducationItem>(),
         {
            id: "degreeInstitution",
            header: "Degree & Institution",
            cell: ({ row }) => {
               const edu = row.original
               return (
                  <div className="space-y-1">
                     <Link
                        href={`/console/education/${edu.id}`}
                        className="text-sm font-semibold text-foreground hover:underline truncate block max-w-xs sm:max-w-sm"
                     >
                        {edu.degree}
                     </Link>
                     <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate max-w-xs sm:max-w-sm">
                        <span className="font-medium text-foreground/80">{edu.institution}</span>
                        {edu.fieldOfStudy && (
                           <>
                              <span>•</span>
                              <span>{edu.fieldOfStudy}</span>
                           </>
                        )}
                     </div>
                  </div>
               )
            },
         },
         {
            id: "type",
            header: "Type",
            cell: ({ row }) => {
               const typeLabel = row.original.type || "Degree"
               const isCert = typeLabel.toLowerCase().includes("cert")
               const isDegree = typeLabel.toLowerCase().includes("degree")

               return (
                  <Badge
                     variant="secondary"
                     className={`text-[10px] font-normal px-2 py-0.5 rounded-full ${
                        isCert
                           ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                           : isDegree
                           ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                           : "bg-muted text-muted-foreground border-border"
                     }`}
                  >
                     {typeLabel}
                  </Badge>
               )
            },
         },
         {
            id: "periodLocation",
            header: "Period & Location",
            cell: ({ row }) => {
               const edu = row.original
               return (
                  <div className="space-y-1">
                     <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 shrink-0" />
                        <span className="font-mono whitespace-nowrap">{edu.period}</span>
                     </div>
                     <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-36">{edu.location}</span>
                     </div>
                     {edu.grade && (
                        <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                           <Award className="h-3 w-3 shrink-0" />
                           <span className="truncate max-w-36">{edu.grade}</span>
                        </div>
                     )}
                  </div>
               )
            },
         },
         {
            id: "skills",
            header: "Related Skills",
            cell: ({ row }) => {
               const skills = row.original.skills || []
               const maxVisible = 4
               const visibleSkills = skills.slice(0, maxVisible)
               const remainingCount = skills.length - maxVisible
               const remainingNames =
                  remainingCount > 0
                     ? skills
                          .slice(maxVisible)
                          .map((s) => s.name)
                          .join(", ")
                     : ""

               return (
                  <div className="flex flex-wrap items-center gap-1.5 max-w-72">
                     {visibleSkills.map((skill) => (
                        <Badge
                           key={skill.id}
                           variant="secondary"
                           className="text-[11px] font-normal py-0 px-1.5 bg-muted/80 text-foreground/80 border-border/50 shrink-0"
                        >
                           {skill.name}
                        </Badge>
                     ))}
                     {remainingCount > 0 && (
                        <Badge
                           variant="outline"
                           title={remainingNames ? `+${remainingCount} more: ${remainingNames}` : undefined}
                           className="text-[10px] font-mono font-medium py-0 px-1.5 text-muted-foreground bg-muted/40 border-border/60 hover:bg-muted/80 shrink-0 cursor-default"
                        >
                           +{remainingCount}
                        </Badge>
                     )}
                  </div>
               )
            },
         },
         {
            id: "status",
            header: "Status",
            cell: ({ row }) => <EducationStatusBadge education={row.original} />,
         },
         {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => {
               const edu = row.original
               return (
                  <div className="flex items-center justify-end gap-1">
                     <Link
                        href={`/console/education/${edu.id}`}
                        title="Edit Qualification"
                        className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                     >
                        <Edit3 className="h-4 w-4 text-muted-foreground" />
                     </Link>
                     <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteTarget(edu)}
                        className="hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        title="Delete Qualification"
                     >
                        <Trash2 className="h-4 w-4" />
                     </Button>
                  </div>
               )
            },
         },
      ],
      []
   )

   return (
      <div className="space-y-3">
         <DataTable<EducationItem>
            columns={columns}
            data={educationList}
            reorderable={true}
            getRowId={(e) => e.id}
            onReorder={async (newItems, event) => {
               const movedTitle = event?.movedItem?.degree
               const newPosition = (event?.newIndex ?? 0) + 1

               const reorderPromise = new Promise<{ name: string }>(
                  async (resolve, reject) => {
                     try {
                        const result = await reorderEducationsAction(
                           newItems.map((e) => e.id)
                        )
                        if (!result.success) {
                           reject(
                              new Error(result.error || "Failed to update education order")
                           )
                        } else {
                           resolve({
                              name: movedTitle
                                 ? `"${movedTitle}" moved to position #${newPosition}`
                                 : "Education order",
                           })
                        }
                     } catch (err) {
                        reject(err)
                     }
                  }
               )

               toast.promise(reorderPromise, {
                  loading: movedTitle ? `Reordering "${movedTitle}"…` : "Updating education order…",
                  success: (data) => `${data.name} updated.`,
                  error: (err) =>
                     err instanceof Error
                        ? err.message
                        : "Could not update education order.",
               })

               await reorderPromise
            }}
         />

         <ConfirmDialog
            open={Boolean(deleteTarget)}
            onOpenChange={(open) => !open && setDeleteTarget(null)}
            title="Delete Education Record"
            itemName={deleteTarget?.degree}
            variant="destructive"
            confirmText="Delete"
            isPending={isPending}
            onConfirm={handleConfirmDelete}
         />
      </div>
   )
}
