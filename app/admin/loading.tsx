import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ProjectsDashboardSkeleton } from "./projects/_components/projects-skeleton"

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Static Page Header - Loaded Instantly */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your engineering case studies and ImageKit media assets.
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

      {/* Dashboard Metrics and Table Skeleton */}
      <ProjectsDashboardSkeleton />
    </div>
  )
}
