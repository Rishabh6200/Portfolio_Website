import { Suspense } from "react"
import Link from "next/link"
import { skillService, categoryService } from "@/services"
import { SkillTable } from "./_components/skill-table"
import { SkillTabs } from "./_components/skill-tabs"
import { SkillsTableSkeleton } from "./_components/skills-skeleton"
import { buttonVariants } from "@/components/ui/button"
import { Plus, AlertCircle, Sparkles } from "lucide-react"

export const dynamic = "force-dynamic"

interface AdminSkillsPageProps {
  searchParams: Promise<{ category?: string; c?: string }>
}

export default async function AdminSkillsPage({ searchParams }: AdminSkillsPageProps) {
  const resolvedParams = await searchParams
  const categoryQuery = resolvedParams?.c || resolvedParams?.category

  // Fetch categories and lightweight counts for tab rendering
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let categories: any[] = []
  let counts: Record<string, number> = {}
  let categoryError: string | null = null

  try {
    const [catDocs, categoryCounts] = await Promise.all([
      categoryService.getAll(),
      skillService.getCategoryCounts(),
    ])
    categories = catDocs
    counts = categoryCounts
  } catch (err: unknown) {
    categoryError = err instanceof Error ? err.message : "Failed to load categories"
  }

  // Determine active category (either matched by slug / id, or the first available category)
  const activeCategory =
    categories.find(
      (c) => c._id === categoryQuery || c.slug === categoryQuery
    ) || categories[0]

  return (
    <div className="w-full space-y-6">
      {/* Static Page Header - Renders Immediately */}
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
            href={
              activeCategory
                ? `/admin/skills/new?categoryId=${activeCategory._id}`
                : "/admin/skills/new"
            }
            className={buttonVariants({ size: "default" })}
          >
            <Plus className="h-4 w-4" />
            <span>Add Skill</span>
          </Link>
        </div>
      </div>

      {categoryError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 space-y-3">
          <div className="flex items-center gap-2 text-destructive font-medium text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Database Connection Notice</span>
          </div>
          <p className="text-xs font-mono text-muted-foreground leading-relaxed">
            {categoryError}
          </p>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-4 bg-card/50">
          <div className="inline-flex p-3.5 rounded-2xl bg-muted text-muted-foreground">
            <Sparkles className="h-8 w-8 text-indigo-500" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-foreground">
              No categories found
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Skills must belong to a technical category. Create your first category before adding skills.
            </p>
          </div>
          <div className="flex items-center justify-center pt-3">
            <Link
              href="/admin/categories/new"
              className={buttonVariants({ size: "default" })}
            >
              <Plus className="h-4 w-4" />
              <span>Create Category</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Category Tabs (No "All" tab - query per tab) */}
          <SkillTabs
            categories={categories}
            counts={counts}
            activeCategoryId={activeCategory?._id}
          />

          {/* Suspense Boundary for Tab Data Loading */}
          <Suspense
            key={activeCategory?._id || "none"}
            fallback={<SkillsTableSkeleton />}
          >
            <SkillsTableData
              categoryId={activeCategory?._id}
              categories={categories}
            />
          </Suspense>
        </div>
      )}
    </div>
  )
}

interface SkillsTableDataProps {
  categoryId?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  categories: any[]
}

async function SkillsTableData({ categoryId, categories }: SkillsTableDataProps) {
  if (!categoryId) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        Please select a category above to view its technologies.
      </div>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let skills: any[] = []
  let dbError: string | null = null

  try {
    // Queries ONLY the skills belonging to the selected category
    skills = await skillService.getAll(categoryId)
  } catch (err: unknown) {
    dbError = err instanceof Error ? err.message : "Failed to load skills for this category"
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
      </div>
    )
  }

  return (
    <SkillTable
      skills={skills}
      categories={categories}
      activeCategoryId={categoryId}
    />
  )
}
