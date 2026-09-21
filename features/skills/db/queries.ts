import { db } from "@/prisma/db";
import { FieldOutputTypes } from "@/prisma/contract";

export interface SkillItem {
   id: string;
   name: string;
   level: "Proficient" | "Advanced" | "Expert";
   highlight: boolean;
   order: number;
   categoryId: string;
   category?: {
      id: string;
      name: string;
      slug: string;
      color: string;
   } | null;
}

class SkillQueries {
   async getSkills(filterCategory?: string): Promise<SkillItem[]> {
      let resolvedCategoryId = filterCategory;

      if (filterCategory) {
         const cat = await db.orm.public.Category
            .where((c) => c.slug.eq(filterCategory))
            .select("id")
            .first();
         if (cat) {
            resolvedCategoryId = cat.id;
         }
      }

      let query = db.orm.public.Skill
         .orderBy((p) => p.order.asc());

      if (resolvedCategoryId) {
         const categoryId = resolvedCategoryId;
         query = query.where((p) => p.categoryId.eq(categoryId));
      }

      const skills = await query
         .select("id", "name", "level", "highlight", "order", "categoryId")
         .include("category", (c) => c.select("id", "name", "slug", "color"))
         .all();

      return skills as unknown as SkillItem[];
   }

   async getCategoryCounts(): Promise<Record<string, number>> {
      try {
         const counts = await db.orm.public.Skill
            .groupBy("categoryId")
            .aggregate((a) => ({
               count: a.count(),
            }));

         const result: Record<string, number> = {};
         for (const item of counts) {
            if (item.categoryId) {
               result[item.categoryId] = item.count;
            }
         }
         return result;
      } catch (error) {
         console.error("Error fetching category counts:", error);
         return {};
      }
   }

   async getSkillByID(id: string) {
      return await db.orm.public.Skill
         .where((p) => p.id.eq(id))
         .include("category", (c) => c.select("id", "name", "slug", "color"))
         .first();
   }
}

export const skillQueries = new SkillQueries();
export type ISkill = FieldOutputTypes['public']['Skill'] & {
   category?: {
      id: string;
      name: string;
      slug: string;
      color: string;
   } | null;
};
