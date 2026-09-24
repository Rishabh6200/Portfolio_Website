import { db, ProjectStatus } from "@/prisma/db";
import { IStats } from "../types/stats.type";
import { ProjectItem } from "../components/table";
import type { WebProjectDetail, ProjectDetailContext } from "../types/detail.type";

class ProjectQueries {
   async getStat(): Promise<IStats> {
      const statusCount = await db.orm.public.Project
         .groupBy("status")
         .aggregate((a) => ({
            count: a.count(),
         }));

      const featuredResult = await db.orm.public.Project
         .where({ featured: true })
         .aggregate((a) => ({
            count: a.count(),
         }));

      const status = Object.fromEntries(
         ProjectStatus.values.map((value) => [
            value.toLowerCase(),
            0,
         ]),
      ) as Pick<IStats, "draft" | "published">;

      for (const item of statusCount) {
         status[item.status.toLowerCase() as keyof typeof status] = item.count;
      }

      const total = statusCount.reduce(
         (sum, item) => sum + item.count,
         0,
      );

      return {
         total,
         ...status,
         featured: featuredResult.count,
      };
   }

   async getProjects(): Promise<ProjectItem[]> {
      const data = await db.orm.public.Project
         .orderBy((p) => p.order.asc())
         .select(
            "id",
            "title",
            "slug",
            "role",
            "status",
            "featured",
            "order",
            "logo"
         )
         .include("skills", (projectSkill) =>
            projectSkill.include("skill", (s) => s.select("name"))
         )
         .all();

      return data.map((project) => ({
         ...project,
         skills: project.skills.flatMap((ps) =>
            ps.skill ? [ps.skill.name] : []
         ),
      }));
   }

   async getProjectById(id: string) {
      const project = await db.orm.public.Project
         .where({ id })
         .include("skills", (projectSkill) =>
            projectSkill.include("skill", (s) => s.select("id", "name"))
         )
         .first();

      if (!project) return null;

      return {
         ...project,
         skills: project.skills.map((ps) => ps.skillId),
      };
   }

   async getPublishedProjects(): Promise<WebProjectDetail[]> {
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
      }))
   }

   async getBySlugWithContext(slug: string): Promise<ProjectDetailContext | null> {
      const projects = await this.getPublishedProjects()
      if (!projects || projects.length === 0) return null

      const projectIndex = projects.findIndex((p) => p.slug === slug)
      if (projectIndex === -1) return null

      return {
         project: projects[projectIndex],
         prevProject: projectIndex > 0 ? projects[projectIndex - 1] : null,
         nextProject: projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null,
      }
   }
}

export const projectQueries = new ProjectQueries()

