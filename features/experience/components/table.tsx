"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { Calendar, Edit3, MapPin, Sparkles, Trash2 } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable, createDragColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import ConfirmDialog from "@/components/dialogs/confirm-dialog"
import { deleteExperienceAction, reorderExperiencesAction } from "../actions"
import type { ExperienceItem } from "../db/queries"

export interface ExperienceTableProps {
   experiences: ExperienceItem[] | Promise<ExperienceItem[]>
}

export default function ExperienceTable({ experiences }: ExperienceTableProps) {
   const [deleteTarget, setDeleteTarget] = useState<ExperienceItem | null>(null)
   const [isPending, startTransition] = useTransition()

   const handleConfirmDelete = () => {
      if (!deleteTarget) return

      startTransition(async () => {
         try {
            const result = await deleteExperienceAction(deleteTarget.id)
            if (result.success) {
               toast.add({
                  type: "success",
                  title: "Experience deleted",
                  description: `"${deleteTarget.role} at ${deleteTarget.company}" was deleted successfully.`,
               })
               setDeleteTarget(null)
            } else {
               toast.add({
                  type: "error",
                  title: "Delete failed",
                  description: result.error || "Could not delete experience entry.",
               })
            }
         } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to delete experience"
            toast.add({
               type: "error",
               title: "Delete failed",
               description: message,
            })
         }
      })
   }

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const columns = useMemo<ColumnDef<any, ExperienceItem, unknown>[]>(
      () => [
         createDragColumn<ExperienceItem>(),
         {
            id: "roleCompany",
            header: "Role & Company",
            cell: ({ row }) => {
               const exp = row.original
               return (
                  <div className="space-y-1">
                     <Link
                        href={`/console/experience/${exp.id}`}
                        className="text-sm font-semibold text-foreground hover:underline truncate block max-w-xs sm:max-w-sm"
                     >
                        {exp.role}
                     </Link>
                     <p className="text-xs font-medium text-muted-foreground truncate max-w-xs sm:max-w-sm">
                        {exp.company}
                     </p>
                  </div>
               )
            },
         },
         {
            id: "period",
            header: "Period",
            cell: ({ row }) => {
               const exp = row.original
               const isCurrent = exp.period?.toLowerCase().includes("present")

               return (
                  <div className="flex items-center gap-1.5 flex-wrap">
                     <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                     <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                        {exp.period}
                     </span>
                     {isCurrent && (
                        <Badge
                           variant="outline"
                           className="text-[10px] px-1.5 py-0 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 shrink-0 gap-1 font-sans"
                        >
                           <Sparkles className="size-2.5" />
                           <span>Current</span>
                        </Badge>
                     )}
                  </div>
               )
            },
         },
         {
            id: "location",
            header: "Location & Type",
            cell: ({ row }) => {
               const exp = row.original
               return (
                  <div className="space-y-1">
                     <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate max-w-40">
                           {exp.locationType && exp.locationType !== "Remote" && !exp.location.toLowerCase().includes(exp.locationType.toLowerCase())
                              ? `${exp.location} (${exp.locationType})`
                              : exp.location || exp.locationType || "Remote"}
                        </span>
                     </div>
                     <Badge variant="secondary" className="text-[10px] font-normal px-1.5 py-0 shrink-0">
                        {exp.type}
                     </Badge>
                  </div>
               )
            },
         },
         {
            id: "skills",
            header: "Technologies",
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
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => {
               const exp = row.original
               return (
                  <div className="flex items-center justify-end gap-1">
                     <Link
                        href={`/console/experience/${exp.id}`}
                        title="Edit Experience"
                        className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                     >
                        <Edit3 className="h-4 w-4 text-muted-foreground" />
                     </Link>
                     <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteTarget(exp)}
                        className="hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        title="Delete Experience"
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
         <DataTable<ExperienceItem>
            columns={columns}
            data={experiences}
            reorderable={true}
            getRowId={(e) => e.id}
            onReorder={async (newItems, event) => {
               const movedTitle = event?.movedItem ? `${event.movedItem.role} at ${event.movedItem.company}` : undefined
               const newPosition = (event?.newIndex ?? 0) + 1

               const reorderPromise = new Promise<{ name: string }>(
                  async (resolve, reject) => {
                     try {
                        const result = await reorderExperiencesAction(
                           newItems.map((e) => e.id)
                        )
                        if (!result.success) {
                           reject(
                              new Error(result.error || "Failed to update experience order")
                           )
                        } else {
                           resolve({
                              name: movedTitle
                                 ? `"${movedTitle}" moved to position #${newPosition}`
                                 : "Experience order",
                           })
                        }
                     } catch (err) {
                        reject(err)
                     }
                  }
               )

               toast.promise(reorderPromise, {
                  loading: movedTitle ? `Reordering "${movedTitle}"…` : "Updating experience order…",
                  success: (data) => `${data.name} updated.`,
                  error: (err) =>
                     err instanceof Error
                        ? err.message
                        : "Could not update experience order.",
               })

               await reorderPromise
            }}
         />

         <ConfirmDialog
            open={Boolean(deleteTarget)}
            onOpenChange={(open) => !open && setDeleteTarget(null)}
            title="Delete Experience Entry"
            itemName={deleteTarget ? `${deleteTarget.role} at ${deleteTarget.company}` : undefined}
            variant="destructive"
            confirmText="Delete"
            isPending={isPending}
            onConfirm={handleConfirmDelete}
         />
      </div>
   )
}
