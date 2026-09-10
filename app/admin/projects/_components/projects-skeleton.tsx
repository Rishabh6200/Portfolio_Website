import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"

export function ProjectsDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Metric Stat Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-14 rounded-md" />
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
            </div>
            <Skeleton className="h-6 w-10 rounded-md" />
            <Skeleton className="h-3 w-20 rounded-md" />
          </div>
        ))}
      </div>

      {/* Projects Table Skeleton */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          {/* Static Table Header - Always Visible */}
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10 px-2 text-center">
                <span className="sr-only">Drag</span>
              </TableHead>
              <TableHead className="py-3 px-4">Project</TableHead>
              <TableHead className="py-3 px-4">Role</TableHead>
              <TableHead className="py-3 px-4">Skills</TableHead>
              <TableHead className="py-3 px-4">Status</TableHead>
              <TableHead className="py-3 px-4 text-right w-28">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[0, 1, 2, 3, 4].map((i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {/* Drag Handle */}
                <TableCell className="w-10 px-2 text-center">
                  <Skeleton className="h-4 w-4 rounded-sm mx-auto" />
                </TableCell>

                {/* Project Info + Thumbnail */}
                <TableCell className="py-3 px-4">
                  <div className="flex items-center gap-3.5">
                    <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-36 sm:w-48 rounded-md" />
                      <Skeleton className="h-3 w-24 rounded-md" />
                    </div>
                  </div>
                </TableCell>

                {/* Role */}
                <TableCell className="py-3 px-4">
                  <Skeleton className="h-4 w-24 rounded-md" />
                </TableCell>

                {/* Skills */}
                <TableCell className="py-3 px-4">
                  <div className="flex flex-wrap gap-1.5 max-w-85">
                    <Skeleton className="h-5 w-14 rounded-md" />
                    <Skeleton className="h-5 w-16 rounded-md" />
                    <Skeleton className="h-5 w-12 rounded-md hidden sm:block" />
                    <Skeleton className="h-5 w-14 rounded-md" />
                    <Skeleton className="h-5 w-8 rounded-md" />
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="py-3 px-4">
                  <Skeleton className="h-6 w-20 rounded-md" />
                </TableCell>

                {/* Actions */}
                <TableCell className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
