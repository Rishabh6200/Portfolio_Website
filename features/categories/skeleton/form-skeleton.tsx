import { Skeleton } from "@/components/ui/skeleton"

const CategoryFormSkeleton = () => {
   return (
      <div className="w-full space-y-6">
         {/* Name + Slug */}
         <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
               <Skeleton className="h-4 w-28" />
               <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
               <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-20" />
               </div>
               <Skeleton className="h-10 w-full" />
            </div>
         </div>

         {/* Icon + Color */}
         <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
               <Skeleton className="h-4 w-28" />
               <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
               <Skeleton className="h-4 w-24" />
               <Skeleton className="h-10 w-full" />
            </div>
         </div>

         {/* Description */}
         <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-32 w-full" />
         </div>

         {/* Actions */}
         <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-36" />
         </div>
      </div>
   )
}

export default CategoryFormSkeleton