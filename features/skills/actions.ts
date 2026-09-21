"use server";

import { isAdminAuthenticated } from "@/lib/auth/session";
import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { SkillFormValues, SkillLevel, skillSchema } from "./schema";

export const createSkillAction = async (data: SkillFormValues) => {
   try {
      if (!(await isAdminAuthenticated())) {
         return { success: false, error: "Unauthorized. Please log in to perform this action." };
      }

      const parsed = skillSchema.safeParse(data);
      if (!parsed.success) {
         return {
            success: false,
            error: parsed.error.issues[0]?.message || "Invalid skill data",
         };
      }

      const categoryExists = await db.orm.public.Category
         .where({ id: data.categoryId })
         .first();

      if (!categoryExists) {
         return { success: false, error: "Selected category does not exist." };
      }

      const lastSkill = await db.orm.public.Skill
         .where((s) => s.categoryId.eq(data.categoryId))
         .orderBy((s) => s.order.desc())
         .select("order")
         .first();

      const nextOrder = (lastSkill?.order ?? -1) + 1;

      const skill = await db.orm.public.Skill.create({
         name: data.name.trim(),
         categoryId: data.categoryId,
         level: data.level,
         highlight: Boolean(data.highlight),
         order: data.order ?? nextOrder,
      });

      revalidatePath("/console/skills");
      revalidatePath("/console", "layout");
      revalidatePath("/");

      return { success: true, skill };
   } catch (error: unknown) {
      console.error("Error in createSkillAction:", error);
      const message = error instanceof Error ? error.message : "";

      if (
         message.includes("skill_categoryId_name_key") ||
         message.includes("unique constraint") ||
         message.includes("duplicate key")
      ) {
         return {
            success: false,
            error: `A skill named "${data.name}" already exists in this category.`,
         };
      }

      return {
         success: false,
         error: message || "Failed to create skill",
      };
   }
};

export const updateSkillAction = async (id: string, data: SkillFormValues) => {
   try {
      if (!(await isAdminAuthenticated())) {
         return { success: false, error: "Unauthorized. Please log in to perform this action." };
      }

      const parsed = skillSchema.safeParse(data);
      if (!parsed.success) {
         return {
            success: false,
            error: parsed.error.issues[0]?.message || "Invalid skill data",
         };
      }

      const existing = await db.orm.public.Skill
         .where({ id })
         .first();

      if (!existing) {
         return { success: false, error: "Skill not found." };
      }

      const categoryExists = await db.orm.public.Category
         .where({ id: data.categoryId })
         .first();

      if (!categoryExists) {
         return { success: false, error: "Selected category does not exist." };
      }

      const skill = await db.orm.public.Skill
         .where({ id })
         .update({
            name: data.name.trim(),
            categoryId: data.categoryId,
            level: data.level,
            highlight: Boolean(data.highlight),
            order: data.order ?? existing.order,
         });

      revalidatePath("/console/skills");
      revalidatePath("/console", "layout");
      revalidatePath("/");

      return { success: true, skill };
   } catch (error: unknown) {
      console.error("Error in updateSkillAction:", error);
      const message = error instanceof Error ? error.message : "";

      if (
         message.includes("skill_categoryId_name_key") ||
         message.includes("unique constraint") ||
         message.includes("duplicate key")
      ) {
         return {
            success: false,
            error: `A skill named "${data.name}" already exists in this category.`,
         };
      }

      return {
         success: false,
         error: message || "Failed to update skill",
      };
   }
};

export const updateSkillLevelAction = async (id: string, level: SkillLevel) => {
   try {
      if (!(await isAdminAuthenticated())) {
         return { success: false, error: "Unauthorized. Please log in to perform this action." };
      }

      if (!["Proficient", "Advanced", "Expert"].includes(level)) {
         return { success: false, error: "Invalid proficiency level" };
      }

      const existing = await db.orm.public.Skill
         .where({ id })
         .first();

      if (!existing) {
         return { success: false, error: "Skill not found." };
      }

      const skill = await db.orm.public.Skill
         .where({ id })
         .update({ level });

      revalidatePath("/console/skills");
      revalidatePath("/console", "layout");
      revalidatePath("/");

      return { success: true, skill };
   } catch (error: unknown) {
      console.error("Error in updateSkillLevelAction:", error);
      return {
         success: false,
         error: error instanceof Error ? error.message : "Failed to update proficiency level",
      };
   }
};

export const deleteSkillAction = async (id: string) => {
   try {
      if (!(await isAdminAuthenticated())) {
         return { success: false, error: "Unauthorized. Please log in to perform this action." };
      }

      const existing = await db.orm.public.Skill
         .where({ id })
         .first();

      if (!existing) {
         return { success: false, error: "Skill not found." };
      }

      await db.orm.public.Skill
         .where({ id })
         .delete();

      revalidatePath("/console/skills");
      revalidatePath("/console", "layout");
      revalidatePath("/");

      return { success: true };
   } catch (error: unknown) {
      console.error("Error in deleteSkillAction:", error);
      return {
         success: false,
         error: error instanceof Error ? error.message : "Failed to delete skill",
      };
   }
};

export const reorderSkillsAction = async (skillIds: string[]) => {
   try {
      if (!(await isAdminAuthenticated())) {
         return { success: false, error: "Unauthorized. Please log in to perform this action." };
      }

      if (!skillIds || skillIds.length === 0) {
         return { success: true };
      }

      await db.transaction(async (tx) => {
         for (let i = 0; i < skillIds.length; i++) {
            await tx.orm.public.Skill.where({ id: skillIds[i] }).update({
               order: i,
            });
         }
      });

      revalidatePath("/console/skills");
      revalidatePath("/console", "layout");
      revalidatePath("/");

      return { success: true };
   } catch (error: unknown) {
      console.error("Error in reorderSkillsAction:", error);
      return {
         success: false,
         error: error instanceof Error ? error.message : "Failed to reorder skills",
      };
   }
};
