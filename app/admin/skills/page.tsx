import { Suspense } from "react"
import { skillService, categoryService } from "@/services"
import { SkillTable } from "./_components/skill-table"
import { SkillTabs } from "./_components/skill-tabs"
import { SkillsTableSkeleton } from "./_components/skills-skeleton"
import { AdminPageHeader } from "../_components/admin-page-header"
import { DbConnectionAlert } from "../_components/db-connection-alert"
import { EmptyState } from "@/components/custom-ui/empty-state"
import { Sparkles } from "lucide-react"

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
      <AdminPageHeader
        title="Skills & Competencies"
        description="Manage production technologies, frameworks, and tools bound to technical categories."
        actionLabel="Add Skill"
        actionHref={
          activeCategory
            ? `/admin/skills/new?categoryId=${activeCategory._id}`
            : "/admin/skills/new"
        }
      />

      {categoryError ? (
        <DbConnectionAlert error={categoryError} />
      ) : categories.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No categories found"
          description="Skills must belong to a technical category. Create your first category before adding skills."
          actionLabel="Create Category"
          actionHref="/admin/categories/new"
        />
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
    return <DbConnectionAlert error={dbError} />
  }

  return (
    <SkillTable
      skills={skills}
      categories={categories}
      activeCategoryId={categoryId}
    />
  )
}
