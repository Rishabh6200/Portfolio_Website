"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTable, createDragColumn } from "@/components/data-table";
import { toast } from "@/components/ui/toast";
import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Edit3, Trash2, Sparkles, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { deleteSkillAction, reorderSkillsAction, updateSkillLevelAction } from "../actions";
import ConfirmDialog from "@/components/dialogs/confirm-dialog";
import { SkillItem } from "../db/queries";
import { SkillLevel } from "../schema";
import { cn } from "@/lib/utils";

const PROFICIENCY_LEVELS = [
   { value: "Expert", label: "Expert", dotColor: "bg-indigo-500" },
   { value: "Advanced", label: "Advanced", dotColor: "bg-sky-500" },
   { value: "Proficient", label: "Proficient", dotColor: "bg-emerald-500" },
] as const;

export interface SkillTableProps {
   skills: SkillItem[] | Promise<SkillItem[]>;
   activeCategoryId?: string;
}

export default function SkillTable({ skills, activeCategoryId }: SkillTableProps) {
   const [isPending, startTransition] = useTransition();
   const [deletingSkill, setDeletingSkill] = useState<SkillItem | null>(null);
   const [updatingSkillId, setUpdatingSkillId] = useState<string | null>(null);

   const handleLevelChange = (skillId: string, skillName: string, newLevel: SkillLevel) => {
      setUpdatingSkillId(skillId);
      startTransition(async () => {
         try {
            const res = await updateSkillLevelAction(skillId, newLevel);
            toast.add({
               type: res.success ? "success" : "error",
               title: res.success ? "Proficiency updated" : "Update failed",
               description: res.success
                  ? `Updated "${skillName}" to ${newLevel}.`
                  : res.error,
            });
         } finally {
            setUpdatingSkillId(null);
         }
      });
   };

   const handleConfirmDelete = () => {
      if (!deletingSkill) return;

      startTransition(async () => {
         const result = await deleteSkillAction(deletingSkill.id);
         setDeletingSkill(null);
         toast.add({
            type: result.success ? "success" : "error",
            title: result.success ? "Skill deleted" : "Delete failed",
            description: result.success
               ? `Skill "${deletingSkill.name}" deleted successfully.`
               : result.error,
         });
      });
   };

   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const columns = useMemo<ColumnDef<any, SkillItem, unknown>[]>(
      () => [
         createDragColumn<SkillItem>(),
         {
            id: "name",
            header: "Skill / Technology",
            cell: ({ row }) => (
               <div className="flex items-center gap-2.5">
                  <Link
                     href={`/console/skills/${row.original.id}`}
                     className="font-semibold text-sm text-foreground hover:underline"
                  >
                     {row.original.name}
                  </Link>
                  {row.original.highlight && (
                     <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        <Sparkles className="h-3 w-3" />
                        <span>Highlighted</span>
                     </span>
                  )}
               </div>
            ),
            
         },
         {
            id: "category",
            header: "Category",
            cell: ({ row }) => {
               const cat = row.original.category;
               if (!cat) {
                  return <span className="text-xs text-muted-foreground">—</span>;
               }
               return (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-border bg-muted/40">
                     {cat.color && (
                        <span
                           className="h-2 w-2 rounded-full shrink-0"
                           style={{ backgroundColor: cat.color }}
                        />
                     )}
                     <span>{cat.name}</span>
                  </div>
               );
            },
         },
         {
            id: "level",
            header: "Proficiency",
            cell: ({ row }) => {
               const currentLevel = row.original.level;
               const isRowUpdating = updatingSkillId === row.original.id;

               return (
                  <Select
                     value={currentLevel}
                     onValueChange={(val) => {
                        if (val && val !== currentLevel) {
                           handleLevelChange(
                              row.original.id,
                              row.original.name,
                              val as SkillLevel
                           );
                        }
                     }}
                     items={PROFICIENCY_LEVELS.map((lvl) => ({
                        value: lvl.value,
                        label: lvl.label,
                     }))}
                     disabled={isRowUpdating}
                  >
                     <SelectTrigger
                        size="sm"
                        className={cn(
                           "h-7 w-32 px-2.5 rounded-full text-xs font-semibold border justify-between cursor-pointer transition-all select-none",
                           currentLevel === "Expert" &&
                           "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20",
                           currentLevel === "Advanced" &&
                           "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30 hover:bg-sky-500/20",
                           currentLevel === "Proficient" &&
                           "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20",
                           isRowUpdating && "opacity-60 cursor-wait pointer-events-none"
                        )}
                     >
                        <SelectValue>
                           {(val) => {
                              const lvl =
                                 PROFICIENCY_LEVELS.find((l) => l.value === val) ||
                                 PROFICIENCY_LEVELS[1];
                              return (
                                 <span className="flex items-center gap-1.5">
                                    <span
                                       className={cn(
                                          "h-2 w-2 rounded-full shrink-0",
                                          lvl.dotColor
                                       )}
                                    />
                                    <span>{lvl.label}</span>
                                 </span>
                              );
                           }}
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
               );
            },
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
                     href={`/console/skills/${row.original.id}`}
                     title="Edit Skill"
                     className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                  >
                     <Edit3 className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Button
                     variant="ghost"
                     size="icon-sm"
                     onClick={() => setDeletingSkill(row.original)}
                     className="hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                     title="Delete Skill"
                  >
                     <Trash2 className="h-4 w-4" />
                  </Button>
               </div>
            ),
         },
      ],
      [updatingSkillId]
   );

   const emptyState = (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
         <div className="rounded-full bg-primary/10 p-3 text-primary">
            <Sparkles className="h-6 w-6" />
         </div>
         <div className="text-center space-y-1">
            <h3 className="text-sm font-semibold text-foreground">
               No skills found in this category
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm">
               There are no competencies registered under this category yet.
            </p>
         </div>
         <Link
            href={
               activeCategoryId
                  ? `/console/skills/new?categoryId=${activeCategoryId}`
                  : "/console/skills/new"
            }
            className={buttonVariants({ size: "sm", className: "gap-1.5 mt-1" })}
         >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Skill</span>
         </Link>
      </div>
   );

   return (
      <>
         <div className="space-y-3">
            <DataTable<SkillItem>
               columns={columns}
               data={skills}
               reorderable={true}
               getRowId={(p) => p.id}
               emptyState={emptyState}
               onReorder={async (newItems) => {
                  const reorderPromise = new Promise<{ name: string }>(
                     async (resolve, reject) => {
                        try {
                           const result = await reorderSkillsAction(
                              newItems.map((s) => s.id)
                           );
                           if (!result.success) {
                              reject(
                                 new Error(result.error || "Failed to update skill order")
                              );
                           } else {
                              resolve({ name: "Skill order" });
                           }
                        } catch (err) {
                           reject(err);
                        }
                     }
                  );

                  toast.promise(reorderPromise, {
                     loading: "Updating skill order…",
                     success: (data) => `${data.name} updated.`,
                     error: (err) =>
                        err instanceof Error
                           ? err.message
                           : "Could not update skill order.",
                  });
               }}
            />
         </div>

         <ConfirmDialog
            open={!!deletingSkill}
            onOpenChange={(open) => !open && setDeletingSkill(null)}
            title="Delete Skill"
            itemName={deletingSkill?.name}
            variant="destructive"
            confirmText="Delete"
            isPending={isPending}
            onConfirm={handleConfirmDelete}
         />
      </>
   );
}
