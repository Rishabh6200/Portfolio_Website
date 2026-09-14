"use server"

import { revalidatePath } from "next/cache"
import { educationService, type EducationInput } from "@/services"
import { isAdminAuthenticated } from "@/lib/auth/session"
import { educationSchema } from "./schema"

export async function createEducationAction(data: EducationInput) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    const parsed = educationSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Validation failed",
      }
    }

    const created = await educationService.create(parsed.data)

    revalidatePath("/admin/education")
    revalidatePath("/admin", "layout")
    revalidatePath("/")

    return { success: true, education: created }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create education"
    return { success: false, error: message }
  }
}

export async function updateEducationAction(id: string, data: EducationInput) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    const parsed = educationSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Validation failed",
      }
    }

    const updated = await educationService.update(id, parsed.data)

    revalidatePath("/admin/education")
    revalidatePath("/admin", "layout")
    revalidatePath("/")

    return { success: true, education: updated }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update education"
    return { success: false, error: message }
  }
}

export async function deleteEducationAction(id: string) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    await educationService.delete(id)

    revalidatePath("/admin/education")
    revalidatePath("/admin", "layout")
    revalidatePath("/")

    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete education"
    return { success: false, error: message }
  }
}

export async function toggleEducationStatusAction(id: string, _currentStatus?: "published" | "draft") {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    const updated = await educationService.toggleStatus(id)

    revalidatePath("/admin/education")
    revalidatePath("/admin", "layout")
    revalidatePath("/")

    return { success: true, status: updated.status }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle education status"
    return { success: false, error: message }
  }
}

export async function reorderEducationAction(items: { id: string; order: number }[]) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    await educationService.reorder(items)

    revalidatePath("/admin/education")
    revalidatePath("/")

    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to reorder education records"
    return { success: false, error: message }
  }
}
