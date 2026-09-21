"use server";

import { isAdminAuthenticated } from "@/lib/auth/session";
import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { CategoryFormValues } from "./schema";

export const createCategoryAction = async (data: CategoryFormValues) => {
   try {
      if (!(await isAdminAuthenticated())) {
         return { success: false, error: "Unauthorized. Please log in to perform this action." }
      }

      const lastCategory = await db.orm.public.Category
         .orderBy((p) => p.order.desc())
         .select("order")
         .first();

      const nextOrder = (lastCategory?.order ?? 0) + 1;

      const category = await db.orm.public.Category
         .create({
            name: data.name,
            slug: data.slug,
            description: data.description,
            icon: data.icon,
            color: data.color,
            order: nextOrder,
         });

      revalidatePath("/console/categories")
      revalidatePath("/console", "layout")
      revalidatePath("/")

      return { success: true, category }
   } catch (error: unknown) {
      console.error("Error in createCategoryAction:", error);
      const message = error instanceof Error ? error.message : "";

      if (message.includes("category_name_key")) {
         return { success: false, error: `A category named "${data.name}" already exists.` };
      }
      if (message.includes("category_slug_key")) {
         return { success: false, error: `A category with slug "${data.slug}" already exists.` };
      }

      return {
         success: false,
         error: message || "Failed to create category",
      };
   }
}

export const updateCategoryAction = async (id: string, data: CategoryFormValues) => {
   try {
      if (!(await isAdminAuthenticated())) {
         return { success: false, error: "Unauthorized. Please log in to perform this action." }
      }

      const existing = await db.orm.public.Category
         .where({ id })
         .first();

      if (!existing) {
         return { success: false, error: "Category not found." }
      }

      const category = await db.orm.public.Category
         .where({ id })
         .update({
            name: data.name,
            slug: data.slug,
            description: data.description,
            icon: data.icon,
            color: data.color,
            order: data.order ?? existing.order,
         });

      revalidatePath("/console/categories")
      revalidatePath("/console", "layout")
      revalidatePath("/")

      return { success: true, category }
   } catch (error: unknown) {
      console.error("Error in updateCategoryAction:", error);
      const message = error instanceof Error ? error.message : "";

      if (message.includes("category_name_key")) {
         return { success: false, error: `A category named "${data.name}" already exists.` };
      }
      if (message.includes("category_slug_key")) {
         return { success: false, error: `A category with slug "${data.slug}" already exists.` };
      }

      return {
         success: false,
         error: message || "Failed to update category",
      };
   }
}

export const deleteCategoryAction = async (id: string) => {
   try {
      if (!(await isAdminAuthenticated())) {
         return { success: false, error: "Unauthorized. Please log in to perform this action." }
      }

      const existing = await db.orm.public.Category
         .where({ id })
         .first();

      if (!existing) {
         return { success: false, error: "Category not found." }
      }

      await db.orm.public.Category
         .where({ id })
         .delete();

      revalidatePath("/console/categories")
      revalidatePath("/console", "layout")
      revalidatePath("/")

      return { success: true }
   } catch (error: unknown) {
      console.error("Error in deleteCategoryAction:", error);
      return {
         success: false,
         error: error instanceof Error ? error.message : "Failed to delete category",
      }
   }
}

export const reorderCategoriesAction = async (categoryIds: string[]) => {
   try {
      if (!(await isAdminAuthenticated())) {
         return { success: false, error: "Unauthorized. Please log in to perform this action." }
      }

      if (!categoryIds || categoryIds.length === 0) {
         return { success: true }
      }

      await db.transaction(async (tx) => {
         for (let i = 0; i < categoryIds.length; i++) {
            await tx.orm.public.Category.where({ id: categoryIds[i] }).update({
               order: i + 1,
            })
         }
      })

      revalidatePath("/console/categories")
      revalidatePath("/console", "layout")
      revalidatePath("/")

      return { success: true }
   } catch (error: unknown) {
      console.error("Error in reorderCategoriesAction:", error);
      return {
         success: false,
         error: error instanceof Error ? error.message : "Failed to reorder categories",
      }
   }
}