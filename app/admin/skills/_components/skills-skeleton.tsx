import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"

export function SkillsTableSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        {/* Static Table Header - Always Visible */}
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10 px-2 text-center">
              <span className="sr-only">Drag</span>
            </TableHead>
            <TableHead className="w-75">Skill / Technology</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Proficiency</TableHead>
            <TableHead className="w-28 text-center">Sort Order</TableHead>
            <TableHead className="text-right w-28">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <TableRow key={i} className="hover:bg-transparent">
              {/* Drag Handle */}
              <TableCell className="w-10 px-2 text-center">
                <Skeleton className="h-4 w-4 rounded-sm mx-auto" />
              </TableCell>

              {/* Skill / Technology info */}
              <TableCell className="w-75">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-4 w-28 sm:w-36 rounded-md" />
                  {i % 2 === 0 && (
                    <Skeleton className="h-5 w-20 rounded-full" />
                  )}
                </div>
              </TableCell>

              {/* Category */}
              <TableCell>
                <Skeleton className="h-6 w-24 rounded-md" />
              </TableCell>

              {/* Proficiency */}
              <TableCell>
                <Skeleton className="h-5 w-16 rounded-md" />
              </TableCell>

              {/* Sort Order */}
              <TableCell className="text-center">
                <Skeleton className="h-5 w-8 rounded-md mx-auto" />
              </TableCell>

              {/* Action Buttons */}
              <TableCell className="text-right">
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

export function SkillsTabsSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-2 pb-1">
      <Skeleton className="h-8 w-24 rounded-lg" />
      <Skeleton className="h-8 w-28 rounded-lg" />
      <Skeleton className="h-8 w-36 rounded-lg" />
      <Skeleton className="h-8 w-32 rounded-lg" />
      <Skeleton className="h-8 w-32 rounded-lg" />
    </div>
  )
}
