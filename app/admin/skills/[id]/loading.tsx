import { Skeleton } from "@/components/ui/skeleton"

export default function EditSkillLoading() {
  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-border space-y-2">
        <Skeleton className="h-8 w-52 rounded-lg" />
        <Skeleton className="h-4 w-96 max-w-full rounded-md" />
      </div>

      <div className="w-full space-y-10 pb-20">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2 border-b border-border">
          <Skeleton className="h-10 w-36 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

        {/* Form Details Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-64 rounded-md" />
            <Skeleton className="h-4 w-120 max-w-full rounded-md" />
          </div>

          <div className="space-y-6">
            {/* Category Binding & Skill Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28 rounded-md" />
                  <Skeleton className="h-3.5 w-24 rounded-md" />
                </div>
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-md" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>

            {/* Proficiency Level Cards */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-32 rounded-md" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-border bg-card/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20 rounded-md" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-full rounded-md" />
                    <Skeleton className="h-3 w-3/4 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            {/* Ordering & Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-border p-4 bg-card/60">
                <Skeleton className="h-5 w-5 rounded-md shrink-0 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-36 rounded-md" />
                  <Skeleton className="h-3 w-48 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
