import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectDetailLoading() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-200 h-125 blur-3xl opacity-20 dark:opacity-20 rounded-full"
        style={{
          background: `radial-gradient(circle, #6366f1, transparent 70%)`,
        }}
      />

      <article className="relative mx-auto max-w-4xl xl:max-w-5xl px-6 sm:px-8 xl:px-12 pt-32 pb-24">
        <div className="mb-10">
          <Skeleton className="h-4 w-28 rounded-md" />
        </div>

        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-6 w-36 rounded-md" />
            <Skeleton className="h-6 w-28 rounded-md" />
          </div>

          <div className="flex items-start gap-5">
            <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl shrink-0" />
            <div className="space-y-3 flex-1">
              <Skeleton className="h-10 sm:h-12 xl:h-14 w-3/4 max-w-lg rounded-xl" />
              <Skeleton className="h-5 sm:h-6 w-5/6 max-w-2xl rounded-lg" />
            </div>
          </div>

          <div className="border-l-2 border-indigo-500/30 pl-4 py-1 space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Skeleton className="h-10 w-36 rounded-full" />
            <Skeleton className="h-10 w-40 rounded-full" />
          </div>
        </header>

        <section className="mt-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-3.5 w-32 rounded-md" />
            </div>
            <Skeleton className="h-3 w-40 rounded-md hidden sm:block" />
          </div>

          <div className="flex flex-col items-center">
            <Skeleton className="w-full max-w-2xl aspect-video rounded-2xl" />
            <div className="mt-4 flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap max-w-2xl w-full px-1">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-14 w-20 sm:h-16 sm:w-24 rounded-xl"
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3.5 w-3.5 rounded-full" />
            <Skeleton className="h-3.5 w-44 rounded-md" />
          </div>
          <div className="flex flex-wrap gap-2.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-9 w-24 sm:w-28 rounded-xl" />
            ))}
          </div>
        </section>

        <footer className="mt-20 pt-8 border-t border-black/8 dark:border-white/8 flex items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-[45%]">
            <Skeleton className="h-3 w-24 rounded-md" />
            <Skeleton className="h-4 w-36 rounded-md" />
          </div>
          <div className="space-y-1.5 flex flex-col items-end max-w-[45%] ml-auto">
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
        </footer>
      </article>
    </main>
  )
}
