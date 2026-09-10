import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { CategoriesTableSkeleton } from "./_components/categories-skeleton"

export default function AdminCategoriesLoading() {
  return (
    <div className="w-full space-y-6">
      {/* Static Page Header - Loaded Instantly */}
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

      {/* Table Skeleton */}
      <CategoriesTableSkeleton />
    </div>
  )
}
