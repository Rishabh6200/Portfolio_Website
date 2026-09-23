import { Skeleton } from "@/components/ui/skeleton";

const ExperienceFormSkeleton = () => {
   return (
      <div className="w-full space-y-10 pb-16">
         {/* Top Action Bar */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
               <Skeleton className="h-9 w-36" />
               <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-9 w-32" />
         </div>

         {/* Section 1 */}
         <div className="space-y-6">
            <div className="space-y-2">
               <Skeleton className="h-6 w-44" />
               <Skeleton className="h-4 w-72" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
               </div>
               <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
               <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
               </div>
               <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
               </div>
               <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
               </div>
            </div>

            <div className="space-y-2">
               <Skeleton className="h-4 w-28" />
               <Skeleton className="h-24 w-full" />
            </div>
         </div>

         {/* Section 2 */}
         <div className="space-y-6">
            <div className="space-y-2">
               <Skeleton className="h-6 w-52" />
               <Skeleton className="h-4 w-80" />
            </div>
            <div className="space-y-2">
               <Skeleton className="h-10 w-full" />
               <Skeleton className="h-10 w-full" />
            </div>
         </div>

         {/* Section 3 */}
         <div className="space-y-6">
            <div className="space-y-2">
               <Skeleton className="h-6 w-44" />
               <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-32 w-full" />
         </div>

         {/* Bottom Action Bar */}
         <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-32" />
         </div>
      </div>
   );
};

export default ExperienceFormSkeleton;
