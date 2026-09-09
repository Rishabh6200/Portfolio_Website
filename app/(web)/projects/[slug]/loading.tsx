import { Skeleton } from "@/components/ui/skeleton"

export default function ProjectDetailLoading() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      {/* Background radial glow placeholder */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-120 sm:w-200 h-96 blur-3xl opacity-10 rounded-full bg-indigo-500" />

      <article className="relative mx-auto max-w-4xl xl:max-w-5xl px-6 sm:px-8 xl:px-12 pt-32 pb-24 space-y-10">
        {/* Back Link */}
        <Skeleton className="h-4 w-32 rounded-md" />

        {/* Header section */}
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-28 rounded-full" />
            <Skeleton className="h-6 w-36 rounded-full" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-10 sm:h-14 w-3/4 rounded-xl" />
            <Skeleton className="h-5 sm:h-6 w-5/6 rounded-lg" />
          </div>

          <div className="border-l-2 border-indigo-500/30 pl-4 py-1 space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="h-10 w-36 rounded-full" />
            <Skeleton className="h-10 w-40 rounded-full" />
          </div>
        </header>

        {/* Cover Image Placeholder */}
        <Skeleton className="aspect-video w-full rounded-3xl" />

        {/* System Architecture Section */}
        <section className="mt-16 space-y-4">
          <Skeleton className="h-4 w-52 rounded-md" />

          <div className="rounded-3xl border border-black/8 dark:border-white/10 bg-black/1 dark:bg-white/2 p-6 sm:p-8 space-y-6">
            {/* Architecture Blueprint callout */}
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/10 p-5 space-y-3">
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-3 w-full rounded-md" />
              <Skeleton className="h-3 w-5/6 rounded-md" />
              <Skeleton className="h-3 w-4/6 rounded-md" />
            </div>

            {/* Architecture Diagram */}
            <Skeleton className="aspect-video w-full rounded-2xl" />

            {/* Implementation Details */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-11/12 rounded-md" />
              <Skeleton className="h-3.5 w-4/5 rounded-md" />
            </div>

            {/* Engineering Challenge */}
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-3.5 w-full rounded-md" />
              <Skeleton className="h-3.5 w-3/4 rounded-md" />
            </div>

            {/* Highlights */}
            <div className="space-y-3 pt-2">
              <Skeleton className="h-4 w-36 rounded-md" />
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                    <Skeleton className="h-3.5 w-5/6 rounded-md" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Technologies */}
        <section className="space-y-4 pt-4">
          <Skeleton className="h-4 w-48 rounded-md" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-xl" />
            ))}
          </div>
        </section>

        {/* Footer Navigation */}
        <footer className="pt-8 border-t border-black/8 dark:border-white/8 flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24 rounded-md" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
          <div className="space-y-2 flex flex-col items-end">
            <Skeleton className="h-3 w-24 rounded-md" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
        </footer>
      </article>
    </main>
  )
}
