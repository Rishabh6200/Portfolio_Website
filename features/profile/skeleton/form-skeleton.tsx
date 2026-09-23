import { Card, CardContent, CardHeader } from "@/components/ui/card"


export function ProfileFormSkeleton() {
   return (
      <div className="space-y-6 pb-16">
         {/* Availability Skeleton */}
         <Card className="border-border bg-card">
            <CardHeader className="pb-4">
               <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                     <div className="h-5 w-40 animate-pulse rounded bg-muted" />
                     <div className="h-3 w-64 animate-pulse rounded bg-muted/60" />
                  </div>
                  <div className="h-7 w-28 animate-pulse rounded-full bg-muted" />
               </div>
            </CardHeader>
            <CardContent className="space-y-3">
               <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((i) => (
                     <div key={i} className="h-7 w-32 animate-pulse rounded-full bg-muted/50" />
                  ))}
               </div>
               <div className="h-9 w-72 animate-pulse rounded-md bg-muted" />
            </CardContent>
         </Card>

         {/* Personal Identity Skeleton */}
         <Card className="border-border bg-card">
            <CardHeader>
               <div className="space-y-1.5">
                  <div className="h-5 w-44 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-72 animate-pulse rounded bg-muted/60" />
               </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <div className="h-3.5 w-24 animate-pulse rounded bg-muted/60" />
                     <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
                  </div>
                  <div className="space-y-2">
                     <div className="h-3.5 w-20 animate-pulse rounded bg-muted/60" />
                     <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                     <div key={i} className="space-y-2">
                        <div className="h-3.5 w-24 animate-pulse rounded bg-muted/60" />
                        <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
                     </div>
                  ))}
               </div>

               <div className="space-y-2">
                  <div className="h-3.5 w-28 animate-pulse rounded bg-muted/60" />
                  <div className="h-9 w-full animate-pulse rounded-md bg-muted" />
               </div>

               <div className="space-y-2">
                  <div className="h-3.5 w-20 animate-pulse rounded bg-muted/60" />
                  <div className="h-20 w-full animate-pulse rounded-md bg-muted" />
               </div>
            </CardContent>
         </Card>

         {/* Social Links Skeleton */}
         <Card className="border-border bg-card">
            <CardHeader>
               <div className="space-y-1.5">
                  <div className="h-5 w-52 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-80 animate-pulse rounded bg-muted/60" />
               </div>
            </CardHeader>
            <CardContent className="space-y-3">
               {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-14 w-full animate-pulse rounded-xl bg-muted/40" />
               ))}
            </CardContent>
         </Card>

         {/* Metric Cards Skeleton */}
         <Card className="border-border bg-card">
            <CardHeader>
               <div className="flex items-center justify-between">
                  <div className="space-y-1.5">
                     <div className="h-5 w-44 animate-pulse rounded bg-muted" />
                     <div className="h-3 w-72 animate-pulse rounded bg-muted/60" />
                  </div>
                  <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
               </div>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[1, 2, 3, 4].map((i) => (
                     <div key={i} className="h-28 w-full animate-pulse rounded-xl bg-muted/40" />
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>
   )
}

export default ProfileFormSkeleton
