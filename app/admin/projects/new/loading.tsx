import { Skeleton } from "@/components/ui/skeleton"

export default function NewProjectLoading() {
  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-border space-y-2">
        <Skeleton className="h-8 w-44 rounded-lg" />
        <Skeleton className="h-4 w-120 max-w-full rounded-md" />
      </div>

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2 border-b border-border">
        <Skeleton className="h-10 w-40 rounded-lg" />
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {/* Project Form Sections */}
      <div className="space-y-8 max-w-4xl pb-20">
        {/* Section 1: Basic Info */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <div className="space-y-1">
            <Skeleton className="h-5 w-40 rounded-md" />
            <Skeleton className="h-3.5 w-64 rounded-md" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-20 rounded-md" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        </div>

        {/* Section 2: Media */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <div className="space-y-1">
            <Skeleton className="h-5 w-48 rounded-md" />
            <Skeleton className="h-3.5 w-72 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="aspect-video w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="aspect-video w-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* Section 3: Architecture & Engineering */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <div className="space-y-1">
            <Skeleton className="h-5 w-52 rounded-md" />
            <Skeleton className="h-3.5 w-80 rounded-md" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
