import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  SkillsTableSkeleton,
  SkillsTabsSkeleton,
} from "./_components/skills-skeleton"

export default function AdminSkillsLoading() {
  return (
    <div className="w-full space-y-6">
      {/* Static Page Header - Loaded Instantly */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Skills & Competencies
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage production technologies, frameworks, and tools bound to technical categories.
          </p>
        </div>

        <div>
          <Link
            href="/admin/skills/new"
            className={buttonVariants({ size: "default" })}
          >
            <Plus className="h-4 w-4" />
            <span>Add Skill</span>
          </Link>
        </div>
      </div>

      {/* Tabs & Table Skeletons */}
      <div className="space-y-4">
        <SkillsTabsSkeleton />
        <SkillsTableSkeleton />
      </div>
    </div>
  )
}
