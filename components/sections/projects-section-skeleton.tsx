import { Skeleton } from "@/components/ui/skeleton"

export function ProjectsSectionSkeleton() {
  return (
    <section className="relative py-24 px-6 sm:px-8 xl:px-12 border-t border-black/6 dark:border-white/6">
      <div className="mx-auto max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 xl:mb-14">
          <div className="space-y-3">
            <Skeleton className="h-4 w-32 rounded-full" />
            <Skeleton className="h-10 sm:h-12 w-80 max-w-full rounded-xl" />
            <Skeleton className="h-4 w-96 max-w-full rounded-md" />
          </div>
          <Skeleton className="h-10 w-72 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-black/8 dark:border-white/8 bg-white/50 dark:bg-[#0d111a]/50 p-5 sm:p-5.5 space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header with Logo + Meta */}
                <div className="flex items-start gap-3.5">
                  <Skeleton className="h-12 w-12 sm:h-13 sm:w-13 rounded-xl sm:rounded-2xl shrink-0" />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-24 rounded" />
                      <div className="flex items-center gap-1">
                        <Skeleton className="h-5 w-5 rounded-md" />
                        <Skeleton className="h-5 w-5 rounded-md" />
                      </div>
                    </div>
                    <Skeleton className="h-4 sm:h-5 w-3/4 rounded" />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Skeleton className="h-3 w-full rounded" />
                  <Skeleton className="h-3 w-4/5 rounded" />
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-5 w-14 rounded-md" />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-black/6 dark:border-white/6">
                <Skeleton className="h-3.5 w-28 rounded" />
                <Skeleton className="h-3.5 w-16 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
