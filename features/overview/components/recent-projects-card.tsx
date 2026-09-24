import Link from "next/link"
import Image from "next/image"
import { FolderGit2, ArrowRight, PlusCircle, Sparkles } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { getMediaUrl } from "@/lib/utils"
import type { OverviewProject } from "../db/queries"

interface RecentProjectsCardProps {
   projects: OverviewProject[]
}

export const RecentProjectsCard = ({ projects }: RecentProjectsCardProps) => {
   return (
      <Card className="h-full flex flex-col justify-between shadow-xs">
         <div>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
               <div>
                  <CardTitle className="text-base font-semibold">Recent Projects</CardTitle>
                  <CardDescription>Latest systems and case studies</CardDescription>
               </div>
               <Link
                  href="/console/projects/new"
                  className={buttonVariants({ variant: "outline", size: "sm", className: "h-8 text-xs gap-1.5" })}
               >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Add</span>
               </Link>
            </CardHeader>

            <CardContent className="p-0">
               {projects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                     <FolderGit2 className="h-8 w-8 mb-2 opacity-40" />
                     <p className="text-sm font-medium text-foreground">No projects yet</p>
                     <p className="text-xs text-muted-foreground mt-0.5 mb-4">
                        Add your first project to showcase on your portfolio.
                     </p>
                     <Link
                        href="/console/projects/new"
                        className={buttonVariants({ size: "sm", className: "gap-1.5 text-xs" })}
                     >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Create Project</span>
                     </Link>
                  </div>
               ) : (
                  <div className="divide-y divide-border/60">
                     {projects.map((project) => {
                        const isPublished = project.status === "PUBLISHED"
                        const logoUrl = project.logo ? getMediaUrl(project.logo) : ""

                        return (
                           <div
                              key={project.id}
                              className="flex items-center justify-between p-4 hover:bg-muted/40 transition-colors group"
                           >
                              <div className="flex items-center gap-3.5 min-w-0 pr-3">
                                 <div className="h-10 w-10 rounded-lg border border-border bg-muted/60 shrink-0 overflow-hidden flex items-center justify-center p-1">
                                    {logoUrl ? (
                                       <Image
                                          src={logoUrl}
                                          alt={project.title}
                                          width={40}
                                          height={40}
                                          className="h-full w-full object-contain"
                                       />
                                    ) : (
                                       <FolderGit2 className="h-4 w-4 text-muted-foreground" />
                                    )}
                                 </div>

                                 <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                       <Link
                                          href={`/console/projects/${project.id}`}
                                          className="text-sm font-semibold text-foreground truncate hover:text-primary transition-colors"
                                       >
                                          {project.title}
                                       </Link>
                                       {project.featured && (
                                          <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
                                       )}
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">
                                       {project.role}
                                    </p>
                                 </div>
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                 <Badge
                                    variant="outline"
                                    className={`text-[10px] font-mono px-2 py-0 h-5 ${
                                       isPublished
                                          ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                                          : "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5"
                                    }`}
                                 >
                                    {project.status.toLowerCase()}
                                 </Badge>

                                 <Link
                                    href={`/console/projects/${project.id}`}
                                    className="text-xs text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity font-medium hidden sm:inline"
                                 >
                                    Edit
                                 </Link>
                              </div>
                           </div>
                        )
                     })}
                  </div>
               )}
            </CardContent>
         </div>

         {projects.length > 0 && (
            <CardFooter className="pt-3 pb-3 px-4 bg-muted/20">
               <Link
                  href="/console/projects"
                  className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center justify-between w-full transition-colors"
               >
                  <span>View all projects ({projects.length})</span>
                  <ArrowRight className="h-3.5 w-3.5" />
               </Link>
            </CardFooter>
         )}
      </Card>
   )
}
