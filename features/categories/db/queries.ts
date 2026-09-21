import { db } from "@/prisma/db";
import { CategoryItem } from "../components/table";
import { FieldOutputTypes } from "@/prisma/contract";

class CategoryQueries {
   async getCategories(): Promise<CategoryItem[]> {
      return await db.orm.public.Category
         .orderBy((p) => p.order.asc())
         .select("id", "name", "slug", "icon", "description", "order", "color")
         .all();
   }

   async getCategoryByID(id: string) {
      return await db.orm.public.Category
         .where((p) => p.id.eq(id))
         .first();
   }

}

export const categoryQueries = new CategoryQueries();
export type ICategory = FieldOutputTypes['public']['Category'];
