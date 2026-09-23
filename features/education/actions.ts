"use server"

import { revalidatePath } from "next/cache"
import { isAdminAuthenticated } from "@/lib/auth/session"
import { db } from "@/prisma/db"
import { educationSchema, type EducationFormValues } from "./schema"

export async function createEducationAction(data: EducationFormValues) {
   try {
      if (!(await isAdminAuthenticated())) {
         return { success: false, error: "Unauthorized. Please log in to perform this action." }
      }

      const parsed = educationSchema.safeParse(data)
      if (!parsed.success) {
         return {
            success: false,
            error: parsed.error.issues[0]?.message || "Invalid education data",
         }
      }

      // Calculate next order
      const lastEdu = await db.orm.public.Education
         .orderBy((e) => e.order.desc())
         .select("order")
         .first()

      const nextOrder = (lastEdu?.order ?? -1) + 1

      const education = await db.orm.public.Education.create({
         institution: data.institution.trim(),
         degree: data.degree.trim(),
         fieldOfStudy: data.fieldOfStudy?.trim() || "",
         period: data.period.trim(),
         location: data.location.trim(),
         type: data.type.trim() || "Degree",
         grade: data.grade?.trim() || "",
         description: data.description.trim(),
         highlights: (data.highlights || []).map((h) => h.trim()).filter(Boolean),
         status: data.status || "published",
         order: data.order ?? nextOrder,
      })

      // Insert linked skills
      if (data.skillIds && data.skillIds.length > 0) {
         const uniqueSkillIds = Array.from(new Set(data.skillIds))
         for (const skillId of uniqueSkillIds) {
            await db.orm.public.EducationSkill.create({
               educationId: education.id,
               skillId,
            })
         }
      }

      revalidatePath("/console/education")
      revalidatePath("/")

      return { success: true, education }
   } catch (err: unknown) {
      console.error("Error in createEducationAction:", err)
      const message = err instanceof Error ? err.message : "Failed to create education entry"
      return { success: false, error: message }
   }
}

export async function updateEducationAction(id: string, data: EducationFormValues) {
   try {
      if (!(await isAdminAuthenticated())) {
         return { success: false, error: "Unauthorized. Please log in to perform this action." }
      }

      const parsed = educationSchema.safeParse(data)
      if (!parsed.success) {
         return {
            success: false,
            error: parsed.error.issues[0]?.message || "Invalid education data",
         }
      }

      const existing = await db.orm.public.Education
         .where({ id })
         .first()

      if (!existing) {
         return { success: false, error: "Education record not found." }
      }

      const updated = await db.orm.public.Education
         .where({ id })
         .update({
            institution: data.institution.trim(),
            degree: data.degree.trim(),
            fieldOfStudy: data.fieldOfStudy?.trim() || "",
            period: data.period.trim(),
            location: data.location.trim(),
            type: data.type.trim() || "Degree",
            grade: data.grade?.trim() || "",
            description: data.description.trim(),
            highlights: (data.highlights || []).map((h) => h.trim()).filter(Boolean),
            status: data.status || "published",
         })

      // Sync skills
      await db.orm.public.EducationSkill
         .where({ educationId: id })
         .deleteAll()

      if (data.skillIds && data.skillIds.length > 0) {
         const uniqueSkillIds = Array.from(new Set(data.skillIds))
         for (const skillId of uniqueSkillIds) {
            await db.orm.public.EducationSkill.create({
               educationId: id,
               skillId,
            })
         }
      }

      revalidatePath("/console/education")
      revalidatePath("/")

      return { success: true, education: updated }
   } catch (err: unknown) {
      console.error("Error in updateEducationAction:", err)
      const message = err instanceof Error ? err.message : "Failed to update education entry"
      return { success: false, error: message }
   }
}

export async function deleteEducationAction(id: string) {
   try {
      if (!(await isAdminAuthenticated())) {
         return { success: false, error: "Unauthorized. Please log in to perform this action." }
      }

      const existing = await db.orm.public.Education
         .where({ id })
         .first()

      if (!existing) {
         return { success: false, error: "Education record not found." }
      }

      // Clean up join records
      await db.orm.public.EducationSkill
         .where({ educationId: id })
         .deleteAll()

      await db.orm.public.Education
         .where({ id })
         .delete()

      revalidatePath("/console/education")
      revalidatePath("/")

      return { success: true }
   } catch (err: unknown) {
      console.error("Error in deleteEducationAction:", err)
      const message = err instanceof Error ? err.message : "Failed to delete education entry"
      return { success: false, error: message }
   }
}

export async function toggleEducationStatusAction(id: string) {
   try {
      if (!(await isAdminAuthenticated())) {
         return { success: false, error: "Unauthorized. Please log in to perform this action." }
      }

      const existing = await db.orm.public.Education
         .where({ id })
         .select("status")
         .first()

      if (!existing) {
         return { success: false, error: "Education record not found." }
      }

      const nextStatus = existing.status === "published" ? "draft" : "published"

      const updated = await db.orm.public.Education
         .where({ id })
         .update({ status: nextStatus })

      revalidatePath("/console/education")
      revalidatePath("/")

      return { success: true, status: updated?.status ?? nextStatus }
   } catch (err: unknown) {
      console.error("Error in toggleEducationStatusAction:", err)
      const message = err instanceof Error ? err.message : "Failed to toggle status"
      return { success: false, error: message }
   }
}

export async function reorderEducationsAction(ids: string[]) {
   try {
      if (!(await isAdminAuthenticated())) {
         return { success: false, error: "Unauthorized. Please log in to perform this action." }
      }

      if (!ids || ids.length === 0) {
         return { success: true }
      }

      await db.transaction(async (tx) => {
         for (let i = 0; i < ids.length; i++) {
            await tx.orm.public.Education.where({ id: ids[i] }).update({
               order: i + 1,
            })
         }
      })

      revalidatePath("/console/education")
      revalidatePath("/")

      return { success: true }
   } catch (err: unknown) {
      console.error("Error in reorderEducationsAction:", err)
      const message = err instanceof Error ? err.message : "Failed to reorder education records"
      return { success: false, error: message }
   }
}
