import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ExperiencesTableSkeleton } from "./_components/experiences-skeleton"

export default function AdminExperienceLoading() {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Experience
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your career history, roles, milestones, and technical contributions.
          </p>
        </div>

        <div>
          <Link
            href="/admin/experience/new"
            className={buttonVariants({ size: "default" })}
          >
            <Plus className="h-4 w-4" />
            <span>Add Experience</span>
          </Link>
        </div>
      </div>

      <ExperiencesTableSkeleton />
    </div>
  )
}
