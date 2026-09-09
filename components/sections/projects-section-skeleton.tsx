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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-black/8 dark:border-white/8 bg-white/50 dark:bg-card/50 p-6 sm:p-7 space-y-5"
            >
              <Skeleton className="aspect-video w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-5 w-16 rounded-md" />
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                <Skeleton className="h-4 w-28 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
