import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

interface ProjectFormSkeletonProps {
  isEditing?: boolean
}

export function ProjectFormSkeleton({ isEditing = false }: ProjectFormSkeletonProps) {
  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="pb-4 border-b border-border space-y-2">
        <Skeleton className="h-8 w-48 sm:w-64 rounded-lg" />
        <Skeleton className="h-4 w-96 max-w-full rounded-md" />
      </div>

      {/* Form Content */}
      <div className="space-y-10 max-w-4xl pb-16">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-36 rounded-md" />
            <Separator orientation="vertical" className="h-4" />
            <Skeleton className="h-6 w-32 rounded-md" />
          </div>
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-18 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>

        {/* Section 1: Basic Information */}
        <section className="space-y-6">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-44 rounded-md" />
            <Skeleton className="h-4 w-80 max-w-full rounded-md" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Project Title (full width) */}
            <div className="space-y-2 sm:col-span-2">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* URL Slug */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Tagline (full width) */}
            <div className="space-y-2 sm:col-span-2">
              <Skeleton className="h-4 w-44 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Description (full width) */}
            <div className="space-y-2 sm:col-span-2">
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-28 w-full rounded-lg" />
            </div>

            {/* Publication Status */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>

            {/* Featured Switch Card */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </section>

        <Separator />

        {/* Section 2: Technologies & Skills */}
        <section className="space-y-4">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-48 rounded-md" />
            <Skeleton className="h-4 w-72 max-w-full rounded-md" />
          </div>

          <div className="space-y-4 rounded-xl border border-border bg-card/60 p-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-44 rounded-md" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>
            <Skeleton className="h-9 w-full rounded-lg" />
            <div className="space-y-3 pt-1">
              <Skeleton className="h-3.5 w-24 rounded-md" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-7 w-20 rounded-lg" />
                <Skeleton className="h-7 w-28 rounded-lg" />
                <Skeleton className="h-7 w-24 rounded-lg" />
                <Skeleton className="h-7 w-18 rounded-lg" />
                <Skeleton className="h-7 w-32 rounded-lg" />
                <Skeleton className="h-7 w-22 rounded-lg" />
              </div>
            </div>
            <div className="space-y-3 pt-1">
              <Skeleton className="h-3.5 w-20 rounded-md" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-7 w-24 rounded-lg" />
                <Skeleton className="h-7 w-20 rounded-lg" />
                <Skeleton className="h-7 w-28 rounded-lg" />
                <Skeleton className="h-7 w-16 rounded-lg" />
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Section 3: Project Media */}
        <section className="space-y-6">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-36 rounded-md" />
            <Skeleton className="h-4 w-80 max-w-full rounded-md" />
          </div>

          {/* Logo */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-48 rounded-md" />
            <Skeleton className="h-3.5 w-72 max-w-full rounded-md" />
            <Skeleton className="h-40 w-40 rounded-xl aspect-square" />
          </div>

          {/* Gallery */}
          <div className="space-y-3 pt-4 border-t border-border">
            <Skeleton className="h-4 w-52 rounded-md" />
            <Skeleton className="h-3.5 w-96 max-w-full rounded-md" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <Skeleton className="aspect-video w-full rounded-xl" />
              <Skeleton className="aspect-video w-full rounded-xl border border-dashed border-border" />
            </div>
          </div>
        </section>

        <Separator />

        {/* Section 4: External Links */}
        <section className="space-y-6">
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-36 rounded-md" />
            <Skeleton className="h-4 w-72 max-w-full rounded-md" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-36 rounded-md" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
