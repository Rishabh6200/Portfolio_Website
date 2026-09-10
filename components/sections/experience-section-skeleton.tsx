import { Skeleton } from "@/components/ui/skeleton"

export function ExperienceSectionSkeleton() {
  return (
    <section
      id="experience"
      className="relative py-24 sm:py-28 px-6 sm:px-8 xl:px-12 border-t border-black/6 dark:border-white/6 scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="mx-auto max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
        <div className="mb-14 sm:mb-16 space-y-3">
          <Skeleton className="h-4 w-36 rounded-full" />
          <Skeleton className="h-10 sm:h-12 w-80 max-w-full rounded-xl" />
          <Skeleton className="h-4 w-96 max-w-full rounded-md" />
        </div>

        <div className="border-t border-black/8 dark:border-white/8 divide-y divide-black/8 dark:divide-white/8">
          {[1, 2].map((i) => (
            <div key={i} className="py-10 sm:py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
              <div className="lg:col-span-4 space-y-2.5">
                <Skeleton className="h-4 w-32 rounded" />
                <Skeleton className="h-7 w-48 rounded-lg" />
                <Skeleton className="h-4 w-28 rounded" />
              </div>
              <div className="lg:col-span-8 space-y-4">
                <Skeleton className="h-6 w-64 rounded-lg" />
                <Skeleton className="h-4 w-full rounded" />
                <div className="space-y-2 pt-1">
                  <Skeleton className="h-4 w-5/6 rounded" />
                  <Skeleton className="h-4 w-4/6 rounded" />
                </div>
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-5 w-16 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
