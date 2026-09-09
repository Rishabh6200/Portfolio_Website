import Link from "next/link"
import { skillService, categoryService } from "@/services"
import { SkillTable } from "./_components/skill-table"
import { buttonVariants } from "@/components/ui/button"
import { Plus, AlertCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminSkillsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let skills: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let categories: any[] = []
  let dbError: string | null = null

  try {
    const [skillDocs, categoryDocs] = await Promise.all([
      skillService.getAll(),
      categoryService.getAll(),
    ])
    skills = skillDocs
    categories = categoryDocs
  } catch (err: unknown) {
    dbError = err instanceof Error ? err.message : "Failed to connect to database"
  }

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
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

      {dbError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 space-y-3">
          <div className="flex items-center gap-2 text-destructive font-medium text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Database Connection Notice</span>
          </div>
          <p className="text-xs font-mono text-muted-foreground leading-relaxed">
            {dbError}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <SkillTable skills={skills} categories={categories} />
        </div>
      )}
    </div>
  )
}
