import { db } from "@/prisma/db"
import { profileQueries } from "@/features/profile/db/queries"
import type { CategoryWithSkills } from "@/components/sections/bento-grid"
import type { ProjectCardData } from "@/components/sections/project-card"
import type { ExperienceItem } from "@/features/experience/db/queries"
import type { EducationItem } from "@/features/education/db/queries"
import { experienceQueries } from "@/features/experience/db/queries"
import { educationQueries } from "@/features/education/db/queries"

class WebQueries {
   async getProfile() {
      return await profileQueries.getProfile()
   }

   async getCategoriesWithSkills(): Promise<CategoryWithSkills[]> {
      try {
         const [categories, skills] = await Promise.all([
            db.orm.public.Category
               .orderBy((c) => c.order.asc())
               .select("id", "name", "slug", "description", "icon", "color")
               .all(),
            db.orm.public.Skill
               .orderBy((s) => s.order.asc())
               .select("id", "name", "level", "highlight", "order", "categoryId")
               .all(),
         ])

         return categories.map((cat) => ({
            _id: cat.id,
            title: cat.name,
            slug: cat.slug,
            description: cat.description,
            icon: cat.icon,
            color: cat.color,
            skills: skills
               .filter((s) => s.categoryId === cat.id)
               .map((s) => ({
                  name: s.name,
                  level: s.level,
                  highlight: s.highlight,
               })),
         }))
      } catch (error) {
         console.error("WebQueries.getCategoriesWithSkills error:", error)
         return []
      }
   }

   async getPublishedProjects(): Promise<ProjectCardData[]> {
      try {
         const projects = await db.orm.public.Project
            .where((p) => p.status.eq("PUBLISHED"))
            .orderBy((p) => p.order.asc())
            .select(
               "id",
               "title",
               "slug",
               "tagline",
               "description",
               "role",
               "status",
               "featured",
               "order",
               "logo",
               "images",
               "liveUrl",
               "githubUrl"
            )
            .include("skills", (projectSkill) =>
               projectSkill.include("skill", (s) =>
                  s.select("id", "name", "level").include("category", (c) => c.select("id", "name", "slug", "color"))
               )
            )
            .all()

         return projects.map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            role: p.role,
            tagline: p.tagline,
            description: p.description,
            logo: p.logo,
            images: p.images,
            featured: p.featured,
            githubUrl: p.githubUrl,
            liveUrl: p.liveUrl,
            skills: p.skills.flatMap((ps) => {
               if (!ps.skill) return []
               return [
                  {
                     id: ps.skill.id,
                     name: ps.skill.name,
                     categoryId: ps.skill.category
                        ? {
                             name: ps.skill.category.name,
                             slug: ps.skill.category.slug,
                             color: ps.skill.category.color,
                          }
                        : undefined,
                  },
               ]
            }),
         }))
      } catch (error) {
         console.error("WebQueries.getPublishedProjects error:", error)
         return []
      }
   }

   async getExperiencesAndEducations(): Promise<{
      experiences: ExperienceItem[]
      educations: EducationItem[]
   }> {
      try {
         const [experiences, allEducations] = await Promise.all([
            experienceQueries.getExperiences(),
            educationQueries.getEducations(),
         ])

         const publishedEducations = allEducations.filter(
            (edu) => (edu.status || "").toLowerCase() === "published"
         )

         return {
            experiences,
            educations: publishedEducations.length > 0 ? publishedEducations : allEducations,
         }
      } catch (error) {
         console.error("WebQueries.getExperiencesAndEducations error:", error)
         return { experiences: [], educations: [] }
      }
   }

   async getProjectBySlugWithContext(slug: string) {
      try {
         const projects = await db.orm.public.Project
            .where((p) => p.status.eq("PUBLISHED"))
            .orderBy((p) => p.order.asc())
            .select(
               "id",
               "title",
               "slug",
               "tagline",
               "description",
               "role",
               "status",
               "featured",
               "order",
               "logo",
               "images",
               "liveUrl",
               "githubUrl"
            )
            .include("skills", (projectSkill) =>
               projectSkill.include("skill", (s) =>
                  s.select("id", "name", "level").include("category", (c) => c.select("id", "name", "slug", "color"))
               )
            )
            .all()

         if (!projects || projects.length === 0) return null

         const projectIndex = projects.findIndex((p) => p.slug === slug)
         if (projectIndex === -1) return null

         const formatProject = (p: typeof projects[number]) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            role: p.role,
            tagline: p.tagline,
            description: p.description,
            logo: p.logo,
            images: p.images as string[],
            featured: p.featured,
            githubUrl: p.githubUrl,
            liveUrl: p.liveUrl,
            skills: p.skills.flatMap((ps) => {
               if (!ps.skill) return []
               return [
                  {
                     id: ps.skill.id,
                     name: ps.skill.name,
                     categoryId: ps.skill.category
                        ? {
                             name: ps.skill.category.name,
                             slug: ps.skill.category.slug,
                             color: ps.skill.category.color,
                          }
                        : undefined,
                  },
               ]
            }),
         })

         return {
            project: formatProject(projects[projectIndex]),
            prevProject: projectIndex > 0 ? formatProject(projects[projectIndex - 1]) : null,
            nextProject: projectIndex < projects.length - 1 ? formatProject(projects[projectIndex + 1]) : null,
         }
      } catch (error) {
         console.error("WebQueries.getProjectBySlugWithContext error:", error)
         return null
      }
   }
}

export const webQueries = new WebQueries()
