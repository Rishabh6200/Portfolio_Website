"use server"

import { revalidatePath } from "next/cache"
import { experienceService, type ExperienceInput } from "@/services"
import { experienceSchema } from "./schema"

export async function createExperienceAction(data: ExperienceInput) {
  try {
    const parsed = experienceSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Validation failed",
      }
    }

    const created = await experienceService.create(parsed.data)

    revalidatePath("/admin/experience")
    revalidatePath("/admin", "layout")
    revalidatePath("/")

    return { success: true, experience: created }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create experience"
    return { success: false, error: message }
  }
}

export async function updateExperienceAction(id: string, data: ExperienceInput) {
  try {
    const parsed = experienceSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Validation failed",
      }
    }

    const updated = await experienceService.update(id, parsed.data)

    revalidatePath("/admin/experience")
    revalidatePath("/admin", "layout")
    revalidatePath("/")

    return { success: true, experience: updated }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update experience"
    return { success: false, error: message }
  }
}

export async function deleteExperienceAction(id: string) {
  try {
    await experienceService.delete(id)

    revalidatePath("/admin/experience")
    revalidatePath("/admin", "layout")
    revalidatePath("/")

    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete experience"
    return { success: false, error: message }
  }
}

export async function reorderExperiencesAction(items: { id: string; order: number }[]) {
  try {
    await experienceService.reorder(items)

    revalidatePath("/admin/experience")
    revalidatePath("/")

    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to reorder experiences"
    return { success: false, error: message }
  }
}
