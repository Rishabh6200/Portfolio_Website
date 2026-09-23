"use server"

import { revalidatePath } from "next/cache"
import { isAdminAuthenticated } from "@/lib/auth/session"
import { db } from "@/prisma/db"
import { experienceSchema, type ExperienceFormValues } from "./schema"

export async function createExperienceAction(data: ExperienceFormValues) {
   try {
      if (!(await isAdminAuthenticated())) {
         return { success: false, error: "Unauthorized. Please log in to perform this action." }
      }

      const parsed = experienceSchema.safeParse(data)
      if (!parsed.success) {
         return {
            success: false,
            error: parsed.error.issues[0]?.message || "Invalid experience data",
         }
      }

      // Calculate next order
      const lastExp = await db.orm.public.Experience
         .orderBy((e) => e.order.desc())
         .select("order")
         .first()

      const nextOrder = (lastExp?.order ?? -1) + 1

      const experience = await db.orm.public.Experience.create({
         company: data.company.trim(),
         role: data.role.trim(),
         period: data.period.trim(),
         location: data.location.trim(),
         locationType: data.locationType || "Remote",
         type: data.type.trim() || "Full-Time",
         description: data.description.trim(),
         achievements: (data.achievements || []).map((a) => a.trim()).filter(Boolean),
         order: data.order ?? nextOrder,
      })

      // Insert linked skills
      if (data.skillIds && data.skillIds.length > 0) {
         const uniqueSkillIds = Array.from(new Set(data.skillIds))
         for (const skillId of uniqueSkillIds) {
            await db.orm.public.ExperienceSkill.create({
               experienceId: experience.id,
               skillId,
            })
         }
      }

      revalidatePath("/console/experience")
      revalidatePath("/")

      return { success: true, experience }
   } catch (err: unknown) {
      console.error("Error in createExperienceAction:", err)
      const message = err instanceof Error ? err.message : "Failed to create experience entry"
      return { success: false, error: message }
   }
}

export async function updateExperienceAction(id: string, data: ExperienceFormValues) {
   try {
      if (!(await isAdminAuthenticated())) {
         return { success: false, error: "Unauthorized. Please log in to perform this action." }
      }

      const parsed = experienceSchema.safeParse(data)
      if (!parsed.success) {
         return {
            success: false,
            error: parsed.error.issues[0]?.message || "Invalid experience data",
         }
      }

      const existing = await db.orm.public.Experience
         .where({ id })
         .first()

      if (!existing) {
         return { success: false, error: "Experience record not found." }
      }

      const updated = await db.orm.public.Experience
         .where({ id })
         .update({
            company: data.company.trim(),
            role: data.role.trim(),
            period: data.period.trim(),
            location: data.location.trim(),
            locationType: data.locationType || "Remote",
            type: data.type.trim() || "Full-Time",
            description: data.description.trim(),
            achievements: (data.achievements || []).map((a) => a.trim()).filter(Boolean),
         })

      // Sync skills
      await db.orm.public.ExperienceSkill
         .where({ experienceId: id })
         .deleteAll()

      if (data.skillIds && data.skillIds.length > 0) {
         const uniqueSkillIds = Array.from(new Set(data.skillIds))
         for (const skillId of uniqueSkillIds) {
            await db.orm.public.ExperienceSkill.create({
               experienceId: id,
               skillId,
            })
         }
      }

      revalidatePath("/console/experience")
      revalidatePath("/")

      return { success: true, experience: updated }
   } catch (err: unknown) {
      console.error("Error in updateExperienceAction:", err)
      const message = err instanceof Error ? err.message : "Failed to update experience entry"
      return { success: false, error: message }
   }
}

export async function deleteExperienceAction(id: string) {
   try {
      if (!(await isAdminAuthenticated())) {
         return { success: false, error: "Unauthorized. Please log in to perform this action." }
      }

      const existing = await db.orm.public.Experience
         .where({ id })
         .first()

      if (!existing) {
         return { success: false, error: "Experience record not found." }
      }

      // Clean up join records
      await db.orm.public.ExperienceSkill
         .where({ experienceId: id })
         .deleteAll()

      await db.orm.public.Experience
         .where({ id })
         .delete()

      revalidatePath("/console/experience")
      revalidatePath("/")

      return { success: true }
   } catch (err: unknown) {
      console.error("Error in deleteExperienceAction:", err)
      const message = err instanceof Error ? err.message : "Failed to delete experience entry"
      return { success: false, error: message }
   }
}

export async function reorderExperiencesAction(ids: string[]) {
   try {
      if (!(await isAdminAuthenticated())) {
         return { success: false, error: "Unauthorized. Please log in to perform this action." }
      }

      if (!ids || ids.length === 0) {
         return { success: true }
      }

      await db.transaction(async (tx) => {
         for (let i = 0; i < ids.length; i++) {
            await tx.orm.public.Experience.where({ id: ids[i] }).update({
               order: i + 1,
            })
         }
      })

      revalidatePath("/console/experience")
      revalidatePath("/")

      return { success: true }
   } catch (err: unknown) {
      console.error("Error in reorderExperiencesAction:", err)
      const message = err instanceof Error ? err.message : "Failed to reorder experiences"
      return { success: false, error: message }
   }
}
