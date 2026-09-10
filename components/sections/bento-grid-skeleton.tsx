import { Skeleton } from "@/components/ui/skeleton"

export function BentoGridSkeleton() {
  return (
    <section id="about" className="relative py-24 sm:py-28 px-6 sm:px-8 xl:px-12 border-t border-black/6 dark:border-white/6 scroll-mt-24 sm:scroll-mt-28">
      <div className="mx-auto max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
        <div className="mb-14 sm:mb-16 space-y-3">
          <Skeleton className="h-4 w-44 rounded-full" />
          <Skeleton className="h-10 sm:h-12 w-80 max-w-full rounded-xl" />
          <Skeleton className="h-4 w-96 max-w-full rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-black/8 dark:border-white/8 bg-white/50 dark:bg-card/50 p-6 sm:p-7 space-y-6"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-3 w-16 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-lg" />
              <div className="flex flex-wrap gap-2 pt-2">
                {[1, 2, 3, 4, 5].map((j) => (
                  <Skeleton key={j} className="h-7 w-20 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
