import { Skeleton } from "@/components/ui/skeleton"

export default function EditCategoryLoading() {
  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-border space-y-2">
        <Skeleton className="h-8 w-56 rounded-lg" />
        <Skeleton className="h-4 w-120 max-w-full rounded-md" />
      </div>

      <div className="w-full space-y-10 pb-20">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2 border-b border-border">
          <Skeleton className="h-10 w-44 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>

        {/* Section 1: Category Details */}
        <section className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-44 rounded-md" />
            <Skeleton className="h-4 w-96 max-w-full rounded-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-3.5 w-20 rounded-md" />
              </div>
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </section>

        {/* Section 2: Appearance & Classification */}
        <section className="space-y-6 pt-4 border-t border-border">
          <div className="space-y-2">
            <Skeleton className="h-6 w-60 rounded-md" />
            <Skeleton className="h-4 w-80 max-w-full rounded-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <div className="flex items-center gap-2 pt-1">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <Skeleton key={i} className="h-8 w-8 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Display Ordering */}
        <section className="space-y-6 pt-4 border-t border-border">
          <div className="space-y-2">
            <Skeleton className="h-6 w-40 rounded-md" />
            <Skeleton className="h-4 w-72 max-w-full rounded-md" />
          </div>

          <div className="space-y-2 max-w-xs">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        </section>
      </div>
    </div>
  )
}
