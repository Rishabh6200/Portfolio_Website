import Link from "next/link"
import { FolderGit2, Layers, Sparkles, Briefcase, GraduationCap, UserCircle, Plus } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const actions = [
   {
      label: "Create Project",
      description: "Upload assets & publish case studies",
      href: "/console/projects/new",
      icon: FolderGit2,
      color: "text-primary",
      bg: "bg-primary/10",
   },
   {
      label: "Add Category",
      description: "Create skill & stack taxonomy",
      href: "/console/categories/new",
      icon: Layers,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
   },
   {
      label: "Add Skill",
      description: "Define proficiency & highlights",
      href: "/console/skills/new",
      icon: Sparkles,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
   },
   {
      label: "Add Experience",
      description: "Record career roles & milestones",
      href: "/console/experience/new",
      icon: Briefcase,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
   },
   {
      label: "Add Education",
      description: "Log degrees and academic highlights",
      href: "/console/education/new",
      icon: GraduationCap,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
   },
   {
      label: "Update Profile",
      description: "Bio, socials, and contact metadata",
      href: "/console/profile",
      icon: UserCircle,
      color: "text-sky-500",
      bg: "bg-sky-500/10",
   },
]

export const QuickActionsCard = () => {
   return (
      <Card className="shadow-xs">
         <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
            <CardDescription>Direct shortcuts to create and manage content</CardDescription>
         </CardHeader>
         <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {actions.map((act) => {
               const Icon = act.icon

               return (
                  <Link
                     key={act.href}
                     href={act.href}
                     className="flex items-center gap-3 p-3 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/60 hover:border-primary/30 transition-all group"
                  >
                     <div className={`h-8 w-8 rounded-lg ${act.bg} ${act.color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105`}>
                        <Icon className="h-4 w-4" />
                     </div>
                     <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-foreground flex items-center justify-between">
                           <span className="truncate">{act.label}</span>
                           <Plus className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                           {act.description}
                        </p>
                     </div>
                  </Link>
               )
            })}
         </CardContent>
      </Card>
   )
}
