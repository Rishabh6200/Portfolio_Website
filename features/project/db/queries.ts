import { db, ProjectStatus } from "@/prisma/db";
import { IStats } from "../types/stats.type";
import { ProjectItem } from "../components/table";

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
         .include("skills")
         .all();

      return data;
   }
}

export const projectQueries = new ProjectQueries();
