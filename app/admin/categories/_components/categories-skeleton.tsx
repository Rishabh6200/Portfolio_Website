import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"

export function CategoriesTableSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        {/* Static Table Header - Always Visible */}
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-10 px-2 text-center">
              <span className="sr-only">Drag</span>
            </TableHead>
            <TableHead className="py-3 px-4">Category</TableHead>
            <TableHead className="py-3 px-4">Icon</TableHead>
            <TableHead className="py-3 px-4">Description</TableHead>
            <TableHead className="py-3 px-4 text-center w-28">Order</TableHead>
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

              {/* Category Info */}
              <TableCell className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-3 w-3 rounded-full shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-28 rounded-md" />
                    <Skeleton className="h-3 w-20 rounded-md" />
                  </div>
                </div>
              </TableCell>

              {/* Icon */}
              <TableCell className="py-3.5 px-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-7 w-7 rounded-lg" />
                  <Skeleton className="h-3 w-14 rounded-md" />
                </div>
              </TableCell>

              {/* Description */}
              <TableCell className="py-3.5 px-4 max-w-md">
                <Skeleton className="h-4 w-48 rounded-md" />
              </TableCell>

              {/* Order */}
              <TableCell className="py-3.5 px-4 text-center">
                <Skeleton className="h-5 w-8 rounded-md mx-auto" />
              </TableCell>

              {/* Actions */}
              <TableCell className="py-3.5 px-4 text-right">
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
  )
}
