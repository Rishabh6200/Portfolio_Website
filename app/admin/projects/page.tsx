import { Suspense } from "react"
import { projectService } from "@/services"
import { ProjectTable } from "./_components/project-table"
import { ProjectsDashboardSkeleton } from "./_components/projects-skeleton"
import { AdminPageHeader } from "../_components/admin-page-header"
import { DbConnectionAlert } from "../_components/db-connection-alert"
import { FolderGit2, CheckCircle2, Clock, Sparkles } from "lucide-react"

export const dynamic = "force-dynamic"

export default function AdminProjectsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Projects"
        description="Manage your project case studies and ImageKit media assets."
        actionLabel="Add Project"
        actionHref="/admin/projects/new"
        actionSize="sm"
      />

      {/* Partial Streaming with Suspense for Dashboard Metrics & Table Data */}
      <Suspense fallback={<ProjectsDashboardSkeleton />}>
        <ProjectsDashboardData />
      </Suspense>
    </div>
  )
}

async function ProjectsDashboardData() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let projects: any[] = []
  let dbError: string | null = null

  try {
    projects = await projectService.getAllAdmin()
  } catch (err: unknown) {
    dbError = err instanceof Error ? err.message : "Failed to connect to database"
  }

  if (dbError) {
    return <DbConnectionAlert error={dbError} />
  }

  const totalCount = projects.length
  const publishedCount = projects.filter((p) => p.status === "published").length
  const draftCount = projects.filter((p) => p.status === "draft").length
  const featuredCount = projects.filter((p) => p.featured).length

  return (
    <div className="space-y-6">
      {/* Metric Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total</span>
            <FolderGit2 className="h-3.5 w-3.5" />
          </div>
          <div className="text-xl font-bold text-foreground font-mono">
            {totalCount}
          </div>
          <p className="text-[11px] text-muted-foreground">Systems in DB</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Live</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-foreground font-mono">
            {publishedCount}
          </div>
          <p className="text-[11px] text-muted-foreground">Published to site</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Drafts</span>
            <Clock className="h-3.5 w-3.5" />
          </div>
          <div className="text-xl font-bold text-foreground font-mono">
            {draftCount}
          </div>
          <p className="text-[11px] text-muted-foreground">Hidden from public</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Featured</span>
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-foreground font-mono">
            {featuredCount}
          </div>
          <p className="text-[11px] text-muted-foreground">Spotlight systems</p>
        </div>
      </div>

      {/* Projects Table */}
      <div className="space-y-3">
        <ProjectTable projects={projects} />
      </div>
    </div>
  )
}
