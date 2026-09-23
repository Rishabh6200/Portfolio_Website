"use server"

import { revalidatePath } from "next/cache"
import { isAdminAuthenticated } from "@/lib/auth/session"
import { db } from "@/prisma/db"
import { profileSchema, type ProfileFormValues } from "./schema"

export async function updateProfileAction(data: ProfileFormValues) {
   try {
      if (!(await isAdminAuthenticated())) {
         return { success: false, error: "Unauthorized. Please log in to perform this action." }
      }

      const parsed = profileSchema.safeParse(data)
      if (!parsed.success) {
         return {
            success: false,
            error: parsed.error.issues[0]?.message || "Invalid profile data",
         }
      }

      const validated = parsed.data
      const existing = await db.orm.public.Profile.first()

      const payload = {
         name: validated.name.trim(),
         role: validated.role.trim(),
         tagline: validated.tagline.trim(),
         bio: validated.bio.trim(),
         status: validated.status.trim(),
         location: validated.location.trim(),
         timezone: validated.timezone.trim(),
         email: validated.email.trim(),
         socials: validated.socials,
         stats: validated.stats,
      }

      if (existing) {
         await db.orm.public.Profile
            .where({ id: existing.id })
            .update(payload)
      } else {
         await db.orm.public.Profile.create(payload)
      }

      revalidatePath("/")
      revalidatePath("/console/profile")
      revalidatePath("/console")

      return { success: true }
   } catch (err: unknown) {
      console.error("updateProfileAction error:", err)
      const message = err instanceof Error ? err.message : "Failed to update profile"
      return { success: false, error: message }
   }
}
