import { Suspense } from "react"
import { categoryService } from "@/services"
import { CategoryTable } from "./_components/category-table"
import { CategoriesTableSkeleton } from "./_components/categories-skeleton"
import { AdminPageHeader } from "../_components/admin-page-header"
import { DbConnectionAlert } from "../_components/db-connection-alert"

export const dynamic = "force-dynamic"

export default function AdminCategoriesPage() {
  return (
    <div className="w-full space-y-6">
      <AdminPageHeader
        title="Categories"
        description="Manage domains and classifications for portfolio systems and competencies."
        actionLabel="Add Category"
        actionHref="/admin/categories/new"
      />

      {/* Partial Streaming with Suspense for Table Data */}
      <Suspense fallback={<CategoriesTableSkeleton />}>
        <CategoriesTableData />
      </Suspense>
    </div>
  )
}

async function CategoriesTableData() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let categories: any[] = []
  let dbError: string | null = null

  try {
    categories = await categoryService.getAll()
  } catch (err: unknown) {
    dbError = err instanceof Error ? err.message : "Failed to connect to database"
  }

  if (dbError) {
    return <DbConnectionAlert error={dbError} />
  }

  return (
    <div className="space-y-4">
      <CategoryTable categories={categories} />
    </div>
  )
}
