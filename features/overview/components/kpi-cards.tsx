import Link from "next/link"
import { FolderGit2, Sparkles, Briefcase, GraduationCap, ArrowUpRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DashboardOverviewData } from "../db/queries"

interface KpiCardsProps {
   data: DashboardOverviewData
}

export const KpiCards = ({ data }: KpiCardsProps) => {
   const { projectStats, skillsCount, categoriesCount, highlightedSkillsCount, experienceCount, latestExperience, educationCount } = data

   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         {/* Projects Card */}
         <Link href="/console/projects" className="group block focus:outline-none">
            <Card className="h-full transition-all duration-200 hover:border-primary/40 hover:shadow-md">
               <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-mono">
                        Projects
                     </span>
                     <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                        <FolderGit2 className="h-4 w-4" />
                     </div>
                  </div>

                  <div className="flex items-baseline justify-between">
                     <div className="text-3xl font-bold font-mono tracking-tight text-foreground">
                        {projectStats.total}
                     </div>
                     <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                  </div>

                  <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
                     <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 px-1.5 py-0 text-[11px] font-mono">
                        {projectStats.published} live
                     </Badge>
                     {projectStats.draft > 0 && (
                        <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5 px-1.5 py-0 text-[11px] font-mono">
                           {projectStats.draft} draft
                        </Badge>
                     )}
                     {projectStats.featured > 0 && (
                        <span className="text-[11px] text-muted-foreground font-mono">
                           ★ {projectStats.featured} feat
                        </span>
                     )}
                  </div>
               </CardContent>
            </Card>
         </Link>

         {/* Skills Card */}
         <Link href="/console/skills" className="group block focus:outline-none">
            <Card className="h-full transition-all duration-200 hover:border-primary/40 hover:shadow-md">
               <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-mono">
                        Skills & Tech
                     </span>
                     <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 transition-transform group-hover:scale-110">
                        <Sparkles className="h-4 w-4" />
                     </div>
                  </div>

                  <div className="flex items-baseline justify-between">
                     <div className="text-3xl font-bold font-mono tracking-tight text-foreground">
                        {skillsCount}
                     </div>
                     <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo-500" />
                  </div>

                  <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
                     <Badge variant="outline" className="px-1.5 py-0 text-[11px] font-mono bg-muted/50">
                        {categoriesCount} categories
                     </Badge>
                     {highlightedSkillsCount > 0 && (
                        <span className="text-[11px] text-muted-foreground font-mono">
                           ✦ {highlightedSkillsCount} highlighted
                        </span>
                     )}
                  </div>
               </CardContent>
            </Card>
         </Link>

         {/* Experience Card */}
         <Link href="/console/experience" className="group block focus:outline-none">
            <Card className="h-full transition-all duration-200 hover:border-primary/40 hover:shadow-md">
               <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-mono">
                        Experience
                     </span>
                     <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500 transition-transform group-hover:scale-110">
                        <Briefcase className="h-4 w-4" />
                     </div>
                  </div>

                  <div className="flex items-baseline justify-between">
                     <div className="text-3xl font-bold font-mono tracking-tight text-foreground">
                        {experienceCount}
                     </div>
                     <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-violet-500" />
                  </div>

                  <div className="pt-1 text-xs text-muted-foreground truncate">
                     {latestExperience ? (
                        <span className="font-mono text-[11px]">
                           {latestExperience.role} @ {latestExperience.company}
                        </span>
                     ) : (
                        <span className="text-[11px] text-muted-foreground font-mono">
                           No positions added
                        </span>
                     )}
                  </div>
               </CardContent>
            </Card>
         </Link>

         {/* Education Card */}
         <Link href="/console/education" className="group block focus:outline-none">
            <Card className="h-full transition-all duration-200 hover:border-primary/40 hover:shadow-md">
               <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider font-mono">
                        Education
                     </span>
                     <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 transition-transform group-hover:scale-110">
                        <GraduationCap className="h-4 w-4" />
                     </div>
                  </div>

                  <div className="flex items-baseline justify-between">
                     <div className="text-3xl font-bold font-mono tracking-tight text-foreground">
                        {educationCount}
                     </div>
                     <ArrowUpRight className="h-4 w-4 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-500" />
                  </div>

                  <div className="pt-1 text-xs text-muted-foreground truncate">
                     {data.latestEducation ? (
                        <span className="font-mono text-[11px]">
                           {data.latestEducation.degree}
                        </span>
                     ) : (
                        <span className="text-[11px] text-muted-foreground font-mono">
                           No credentials added
                        </span>
                     )}
                  </div>
               </CardContent>
            </Card>
         </Link>
      </div>
   )
}
