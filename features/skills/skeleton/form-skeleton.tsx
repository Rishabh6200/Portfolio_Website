import { Skeleton } from "@/components/ui/skeleton";

const SkillFormSkeleton = () => {
   return (
      <div className="w-full space-y-6">
         {/* Category + Name */}
         <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
               <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
               </div>
               <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
               <Skeleton className="h-4 w-32" />
               <Skeleton className="h-10 w-full" />
            </div>
         </div>

         <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-10 w-full" />
         </div>

         <div className="rounded-xl border border-border p-4 bg-card/50 flex items-start gap-3.5">
            <Skeleton className="size-5 rounded-full mt-0.5 shrink-0" />
            <div className="space-y-2 flex-1">
               <Skeleton className="h-4 w-52" />
               <Skeleton className="h-3 w-4/5" />
            </div>
         </div>

         {/* Actions */}
         <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-32" />
         </div>
      </div>
   );
};

export default SkillFormSkeleton;
