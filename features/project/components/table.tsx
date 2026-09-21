"use client"

import Link from "next/link"
import { FolderGit2, Sparkles, ExternalLink, Edit3, Trash2 } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable, createDragColumn } from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import Image from "next/image"

import { ProjectStatus } from "@/prisma/db"
import { toast } from "@/components/ui/toast"
import { reorderProjectsAction } from "../actions"
import { useMemo } from "react"
import { ProjectStatusBadge } from "./status-badge"

export interface ProjectItem {
   id: string
   title: string
   slug: string
   role: string
   status: ProjectStatus | "published" | "draft"
   featured: boolean
   logo?: string | null
   order: number
   skills: string[]
}

export interface ProjectTableProps {
   projects: ProjectItem[] | Promise<ProjectItem[]>
}

export default function ProjectTable({ projects }: ProjectTableProps) {
   const handleDelete = (id: string, title: string) => {
      toast.add({
         title: "Project deleted",
         description: "Project deleted successfully",
         type: "success",
      })
   };

   const columns = useMemo<ColumnDef<any, ProjectItem, unknown>[]>(
      () => [
         createDragColumn<ProjectItem>(),
         {
            id: "project",
            header: "Project",
            cell: ({ row }) => {
               const p = row.original
               return (
                  <div className="flex items-center gap-3.5">
                     <div className="h-10 w-10 rounded-lg border border-border bg-muted/60 shrink-0 overflow-hidden flex items-center justify-center p-1">
                        {p.logo ? (
                           <Image
                              src={p.logo}
                              alt={p.title}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover rounded"
                           />
                        ) : (
                           <FolderGit2 className="h-5 w-5 text-muted-foreground" />
                        )}
                     </div>
                     <div className="min-w-0">
                        <div className="flex items-center gap-2">
                           <Link
                              href={`/console/projects/${p.id}`}
                              className="text-sm font-semibold text-foreground hover:underline truncate max-w-xs sm:max-w-sm"
                           >
                              {p.title}
                           </Link>
                           {p.featured && (
                              <Badge
                                 variant="secondary"
                                 className="gap-1 text-[11px] py-0 px-1.5 text-amber-500 bg-amber-500/10 border-amber-500/20"
                              >
                                 <Sparkles className="h-3 w-3" />
                                 <span>Featured</span>
                              </Badge>
                           )}
                        </div>
                        <p className="text-xs font-mono text-muted-foreground truncate max-w-xs sm:max-w-sm mt-0.5">
                           /projects/{p.slug}
                        </p>
                     </div>
                  </div>
               )
            },
         },

         {
            id: "role",
            header: "Role",
            cell: ({ row }) => (
               <span className="text-xs font-medium text-muted-foreground">
                  {row.original.role}
               </span>
            ),
         },

         {
            id: "skills",
            header: "Skills",
            cell: ({ row }) => {
               const skills = row.original.skills || []
               const maxVisible = 4
               const visibleSkills = skills.slice(0, maxVisible)
               const remainingCount = skills.length - maxVisible
               const remainingNames =
                  remainingCount > 0
                     ? skills
                        .slice(maxVisible)
                        .map((s: any) => (typeof s === "string" ? s : s.name || s.skill?.name || ""))
                        .filter(Boolean)
                        .join(", ")
                     : ""

               return (
                  <div className="flex flex-wrap items-center gap-1.5 max-w-72">
                     {visibleSkills.map((skill: any, index) => {
                        const name =
                           typeof skill === "string"
                              ? skill
                              : skill.name || skill.skill?.name || ""
                        const key =
                           typeof skill === "string"
                              ? skill
                              : skill.id || skill.skillId || skill.skill?.id || index

                        return (
                           <Badge
                              key={key}
                              variant="secondary"
                              className="text-[11px] font-normal py-0 px-1.5 bg-muted/80 text-foreground/80 border-border/50 shrink-0"
                           >
                              {name}
                           </Badge>
                        )
                     })}
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
            cell: ({ row }) => <ProjectStatusBadge project={row.original} />,
         },

         {
            id: "actions",
            header: () => <div className="text-right">Actions</div>,
            cell: ({ row }) => {
               const p = row.original
               return (
                  <div className="flex items-center justify-end gap-1">
                     {p.status?.toLowerCase() === "published" && (
                        <a
                           href={`/projects/${p.slug}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           title="Preview site"
                           className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                        >
                           <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </a>
                     )}
                     <Link
                        href={`/console/projects/${p.id}`}
                        title="Edit Project"
                        className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                     >
                        <Edit3 className="h-4 w-4 text-muted-foreground" />
                     </Link>
                     <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(p.id, p.title)}
                        className="hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        title="Delete Project"
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
         <DataTable<ProjectItem>
            columns={columns}
            data={projects}
            reorderable={true}
            getRowId={(p) => p.id}
            onReorder={async (newItems) => {
               const result = await reorderProjectsAction(newItems.map((p) => p.id))
               toast.add({
                  type: result.success ? "success" : "error",
                  title: result.success ? "Success" : "Error",
                  description: result.success ? "Projects reordered successfully" : result.error,
               })
            }}

         />
      </div>
   )
}