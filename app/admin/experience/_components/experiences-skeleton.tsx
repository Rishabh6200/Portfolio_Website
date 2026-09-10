import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"

export function ExperiencesTableSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10 text-center">
              <span className="sr-only">Reorder</span>
            </TableHead>
            <TableHead className="min-w-55">Role & Company</TableHead>
            <TableHead className="min-w-35">Period</TableHead>
            <TableHead className="min-w-30">Location & Type</TableHead>
            <TableHead className="min-w-50">Technologies</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[0, 1, 2].map((i) => (
            <TableRow key={i} className="hover:bg-transparent">
              {/* Drag Handle */}
              <TableCell className="text-center py-3">
                <Skeleton className="h-4 w-4 rounded-sm mx-auto" />
              </TableCell>

              {/* Role & Company */}
              <TableCell className="py-3">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-44 rounded-md" />
                  <Skeleton className="h-3 w-28 rounded-md" />
                </div>
              </TableCell>

              {/* Period */}
              <TableCell className="py-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 rounded-full shrink-0" />
                  <Skeleton className="h-3.5 w-24 rounded-md" />
                </div>
              </TableCell>

              {/* Location & Type */}
              <TableCell className="py-3">
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-16 rounded-md" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
              </TableCell>

              {/* Technologies */}
              <TableCell className="py-3">
                <div className="flex gap-1.5">
                  <Skeleton className="h-5 w-14 rounded-md" />
                  <Skeleton className="h-5 w-16 rounded-md" />
                  <Skeleton className="h-5 w-12 rounded-md" />
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell className="py-3 text-right">
                <div className="flex items-center justify-end gap-1">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
