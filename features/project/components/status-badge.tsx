"use client"

import { useTransition } from "react"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/toast"
import { toggleProjectStatusAction } from "../actions"
import type { ProjectStatus } from "@/prisma/db"

export interface ProjectStatusBadgeProps {
   project: {
      id: string
      status: ProjectStatus | "published" | "draft" | string
   }
}

export function ProjectStatusBadge({ project }: ProjectStatusBadgeProps) {
   const [isPending, startTransition] = useTransition()
   const isPublished = project.status?.toLowerCase() === "published"

   const handleToggleStatus = () => {
      startTransition(async () => {
         const result = await toggleProjectStatusAction(project.id)
         toast.add({
            type: result.success ? "success" : "error",
            title: result.success ? "Success" : "Error",
            description: result.success ? "Project status toggled successfully" : result.error,
         })
      })
   }

   return (
      <Badge
         variant={isPublished ? "default" : "secondary"}
         onClick={() => !isPending && handleToggleStatus()}
         className={`w-24 justify-center gap-1.5 h-6 select-none transition-transform ${
            isPending ? "cursor-wait opacity-80" : "cursor-pointer active:scale-95"
         }`}
      >
         {isPending ? (
            <Spinner className="size-3" />
         ) : (
            <span
               className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                  isPublished ? "bg-emerald-500" : "bg-muted-foreground"
               }`}
            />
         )}
         <span className="capitalize">{project.status?.toLowerCase()}</span>
      </Badge>
   )
}

export default ProjectStatusBadge
