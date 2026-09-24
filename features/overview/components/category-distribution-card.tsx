import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import type { OverviewCategory, DashboardOverviewData } from "../db/queries"

interface CategoryDistributionCardProps {
   categories: OverviewCategory[]
   skillsCount: number
   skillsByLevel: DashboardOverviewData["skillsByLevel"]
}

export const CategoryDistributionCard = ({ categories, skillsCount, skillsByLevel }: CategoryDistributionCardProps) => {
   return (
      <Card className="h-full flex flex-col justify-between shadow-xs">
         <div>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
               <div>
                  <CardTitle className="text-base font-semibold">Tech Stack Distribution</CardTitle>
                  <CardDescription>Verified skills across domains</CardDescription>
               </div>
               <Link
                  href="/console/categories"
                  className="text-xs font-mono text-muted-foreground hover:text-foreground"
               >
                  {categories.length} categories
               </Link>
            </CardHeader>

            <CardContent className="space-y-4">
               {/* Categories pill list */}
               <div className="space-y-2.5">
                  {categories.map((category) => {
                     const pct = skillsCount > 0 ? Math.round((category.skillsCount / skillsCount) * 100) : 0

                     return (
                        <div key={category.id} className="space-y-1">
                           <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                 <span
                                    className="h-2.5 w-2.5 rounded-full shrink-0"
                                    style={{ backgroundColor: category.color || "#6366f1" }}
                                 />
                                 <Link
                                    href={`/console/categories/${category.id}`}
                                    className="font-medium text-foreground hover:text-primary transition-colors truncate max-w-44"
                                 >
                                    {category.name}
                                 </Link>
                              </div>
                              <span className="font-mono text-muted-foreground text-[11px]">
                                 {category.skillsCount} skills ({pct}%)
                              </span>
                           </div>
                           <div className="h-1.5 w-full rounded-full bg-muted/60 overflow-hidden">
                              <div
                                 className="h-full rounded-full transition-all duration-500"
                                 style={{
                                    width: `${Math.max(pct, 4)}%`,
                                    backgroundColor: category.color || "#6366f1",
                                 }}
                              />
                           </div>
                        </div>
                     )
                  })}
               </div>

               {/* Proficiency Breakdown */}
               <div className="pt-3 border-t border-border/60">
                  <div className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider mb-2">
                     Proficiency Levels
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                     <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-2">
                        <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                           {skillsByLevel.Expert}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">Expert</div>
                     </div>
                     <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-2">
                        <div className="text-base font-bold font-mono text-blue-600 dark:text-blue-400">
                           {skillsByLevel.Advanced}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">Advanced</div>
                     </div>
                     <div className="rounded-lg bg-muted/40 border border-border p-2">
                        <div className="text-base font-bold font-mono text-foreground">
                           {skillsByLevel.Proficient}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono">Proficient</div>
                     </div>
                  </div>
               </div>
            </CardContent>
         </div>

         <CardFooter className="pt-3 pb-3 px-4 bg-muted/20">
            <Link
               href="/console/skills"
               className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center justify-between w-full transition-colors"
            >
               <span>Manage skills matrix</span>
               <ArrowRight className="h-3.5 w-3.5" />
            </Link>
         </CardFooter>
      </Card>
   )
}
