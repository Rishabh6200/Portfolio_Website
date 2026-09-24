import Link from "next/link"
import { PlusCircle, ExternalLink, Sparkles, UserCheck } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ProfileData } from "@/features/profile/schema"

interface OverviewHeaderProps {
   profile: ProfileData
}

export const OverviewHeader = ({ profile }: OverviewHeaderProps) => {
   const displayName = profile.name || "Portfolio Admin"
   const displayRole = profile.role || "Full-Stack Engineer"

   return (
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-linear-to-br from-card via-card/90 to-accent/10 p-6 sm:p-8 shadow-xs">
         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
            <div className="space-y-2">
               <div className="flex items-center gap-2.5 flex-wrap">
                  <Badge variant="outline" className="gap-1.5 py-0.5 text-xs font-medium border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                     <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                     {profile.status || "Open to Opportunities"}
                  </Badge>
                  {profile.location && (
                     <span className="text-xs text-muted-foreground font-mono">
                        📍 {profile.location}
                     </span>
                  )}
               </div>

               <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  Welcome back, <span className="text-primary">{displayName}</span>
               </h1>

               <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  {profile.tagline || `${displayRole} • Manage and publish your case studies, verified skills, and academic achievements.`}
               </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
               <Link
                  href="/console/projects/new"
                  className={buttonVariants({ size: "sm", className: "gap-1.5 shadow-sm" })}
               >
                  <PlusCircle className="h-4 w-4" />
                  <span>New Project</span>
               </Link>

               <Link
                  href="/console/skills/new"
                  className={buttonVariants({ variant: "outline", size: "sm", className: "gap-1.5" })}
               >
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Add Skill</span>
               </Link>

               <Link
                  href="/console/profile"
                  className={buttonVariants({ variant: "ghost", size: "sm", className: "gap-1.5 text-muted-foreground hover:text-foreground" })}
               >
                  <UserCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
               </Link>

               <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "ghost", size: "sm", className: "gap-1.5 text-muted-foreground hover:text-foreground" })}
               >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">Live Site</span>
               </Link>
            </div>
         </div>

         {/* Decorative subtle ambient backdrop */}
         <div className="pointer-events-none absolute -right-12 -bottom-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>
   )
}
