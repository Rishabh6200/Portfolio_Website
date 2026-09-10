import { Suspense } from "react"
import Link from "next/link"
import { projectService } from "@/services"
import { ProjectTable } from "./projects/_components/project-table"
import { ProjectsDashboardSkeleton } from "./projects/_components/projects-skeleton"
import { buttonVariants } from "@/components/ui/button"
import { Plus, AlertCircle, FolderGit2, CheckCircle2, Clock, Sparkles } from "lucide-react"

export const dynamic = "force-dynamic"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Static Page Header - Loaded Immediately */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your project case studies and ImageKit media assets.
          </p>
        </div>

        <div>
          <Link
            href="/admin/projects/new"
            className={buttonVariants({ size: "sm" })}
          >
            <Plus className="h-4 w-4" />
            <span>Add Project</span>
          </Link>
        </div>
      </div>

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
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 space-y-3">
        <div className="flex items-center gap-2 text-destructive font-medium text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>Database Connection Notice</span>
        </div>
        <p className="text-xs font-mono text-muted-foreground leading-relaxed">
          {dbError}
        </p>
        <div className="pt-1 text-xs text-muted-foreground">
          Please add your <code className="font-mono text-foreground font-semibold">MONGODB_URI</code> to{" "}
          <code className="font-mono text-foreground">.env.local</code> and restart the development server.
        </div>
      </div>
    )
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
