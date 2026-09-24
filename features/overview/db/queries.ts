import { db, ProjectStatus, SkillLevel } from "@/prisma/db"
import { profileQueries } from "@/features/profile/db/queries"
import type { ProfileData } from "@/features/profile/schema"

export interface OverviewCategory {
   id: string
   name: string
   slug: string
   icon: string
   color: string
   skillsCount: number
}

export interface OverviewProject {
   id: string
   title: string
   slug: string
   role: string
   status: ProjectStatus
   featured: boolean
   logo: string
   updatedAt: string
   skills: string[]
}

export interface DashboardOverviewData {
   profile: ProfileData
   projectStats: {
      total: number
      published: number
      draft: number
      featured: number
   }
   recentProjects: OverviewProject[]
   categoriesCount: number
   categories: OverviewCategory[]
   skillsCount: number
   highlightedSkillsCount: number
   skillsByLevel: Record<SkillLevel, number>
   experienceCount: number
   latestExperience: {
      company: string
      role: string
      period: string
      locationType: string
   } | null
   educationCount: number
   latestEducation: {
      institution: string
      degree: string
      period: string
   } | null
}

class OverviewQueries {
   async getOverviewData(): Promise<DashboardOverviewData> {
      const [
         profile,
         allProjects,
         allCategories,
         allSkills,
         allExperiences,
         allEducations,
      ] = await Promise.all([
         profileQueries.getProfile(),
         db.orm.public.Project
            .orderBy((p) => p.order.asc())
            .select("id", "title", "slug", "role", "status", "featured", "logo", "updatedAt")
            .include("skills", (projectSkill) =>
               projectSkill.include("skill", (s) => s.select("name"))
            )
            .all(),
         db.orm.public.Category
            .orderBy((c) => c.order.asc())
            .select("id", "name", "slug", "icon", "color")
            .include("skills", (s) => s.select("id"))
            .all(),
         db.orm.public.Skill
            .select("id", "level", "highlight")
            .all(),
         db.orm.public.Experience
            .orderBy((e) => e.order.asc())
            .select("company", "role", "period", "locationType")
            .all(),
         db.orm.public.Education
            .orderBy((e) => e.order.asc())
            .select("institution", "degree", "period")
            .all(),
      ])

      const publishedCount = allProjects.filter((p) => p.status === "PUBLISHED").length
      const draftCount = allProjects.filter((p) => p.status === "DRAFT").length
      const featuredCount = allProjects.filter((p) => p.featured).length

      const skillsByLevel: Record<SkillLevel, number> = {
         Proficient: 0,
         Advanced: 0,
         Expert: 0,
      }

      for (const skill of allSkills) {
         if (skill.level in skillsByLevel) {
            skillsByLevel[skill.level as SkillLevel] += 1
         }
      }

      const recentProjects: OverviewProject[] = allProjects.slice(0, 5).map((p) => ({
         id: p.id,
         title: p.title,
         slug: p.slug,
         role: p.role,
         status: p.status,
         featured: p.featured,
         logo: p.logo,
         updatedAt: p.updatedAt,
         skills: p.skills.flatMap((ps) => (ps.skill ? [ps.skill.name] : [])),
      }))

      const categories: OverviewCategory[] = allCategories.map((c) => ({
         id: c.id,
         name: c.name,
         slug: c.slug,
         icon: c.icon,
         color: c.color,
         skillsCount: c.skills.length,
      }))

      return {
         profile,
         projectStats: {
            total: allProjects.length,
            published: publishedCount,
            draft: draftCount,
            featured: featuredCount,
         },
         recentProjects,
         categoriesCount: allCategories.length,
         categories,
         skillsCount: allSkills.length,
         highlightedSkillsCount: allSkills.filter((s) => s.highlight).length,
         skillsByLevel,
         experienceCount: allExperiences.length,
         latestExperience: allExperiences[0] ?? null,
         educationCount: allEducations.length,
         latestEducation: allEducations[0] ?? null,
      }
   }
}

export const overviewQueries = new OverviewQueries()
