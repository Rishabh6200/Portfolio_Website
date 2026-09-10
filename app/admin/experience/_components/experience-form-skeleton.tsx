import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export function ExperienceFormSkeleton() {
  return (
    <div className="w-full space-y-10 pb-20 animate-pulse">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <Skeleton className="h-10 w-44 rounded-lg" />
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {/* Section 1: Basic Role Information */}
      <section className="space-y-6">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-48 rounded-md" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>

        <div className="space-y-6">
          {/* Company & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>

          {/* Period, Location & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>
      </section>

      <Separator />

      {/* Section 2: Key Achievements */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-56 rounded-md" />
            <Skeleton className="h-4 w-96 rounded-md" />
          </div>
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </section>

      <Separator />

      {/* Section 3: Technologies */}
      <section className="space-y-6">
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-44 rounded-md" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>

        <Skeleton className="h-48 w-full rounded-xl" />
      </section>
    </div>
  )
}
