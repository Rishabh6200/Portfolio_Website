import Link from "next/link"
import { categoryService } from "@/services"
import { CategoryTable } from "./_components/category-table"
import { buttonVariants } from "@/components/ui/button"
import { Plus, AlertCircle } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminCategoriesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let categories: any[] = []
  let dbError: string | null = null

  try {
    categories = await categoryService.getAll()
  } catch (err: unknown) {
    dbError = err instanceof Error ? err.message : "Failed to connect to database"
  }

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Categories
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage domains and classifications for portfolio systems and competencies.
          </p>
        </div>

        <div>
          <Link
            href="/admin/categories/new"
            className={buttonVariants({ size: "default" })}
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
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
          <CategoryTable categories={categories} />
        </div>
      )}
    </div>
  )
}
