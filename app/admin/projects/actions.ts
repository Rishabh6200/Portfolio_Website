"use server"

import { revalidatePath } from "next/cache"
import { projectService, type ProjectInput } from "@/services"
import { isAdminAuthenticated } from "@/lib/auth/session"
import { projectSchema, type ProjectFormValues } from "./schema"
import { uploadMediaAction } from "@/app/admin/_actions/media.actions"

export { uploadMediaAction as uploadProjectMediaAction }

export async function createProjectAction(data: ProjectInput) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    const parsed = projectSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Validation failed",
      }
    }

    const created = await projectService.create(parsed.data)

    revalidatePath("/admin")
    revalidatePath("/")

    return { success: true, project: created }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create project"
    return { success: false, error: message }
  }
}

export async function updateProjectAction(id: string, data: ProjectInput) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    const parsed = projectSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Validation failed",
      }
    }

    const updated = await projectService.update(id, parsed.data)

    revalidatePath("/admin")
    revalidatePath("/")
    if (updated.slug) {
      revalidatePath(`/projects/${updated.slug}`)
    }

    return { success: true, project: updated }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update project"
    return { success: false, error: message }
  }
}

export async function deleteProjectAction(id: string) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    await projectService.delete(id)

    revalidatePath("/admin")
    revalidatePath("/")

    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete project"
    return { success: false, error: message }
  }
}

export async function toggleProjectStatusAction(id: string, _currentStatus?: "published" | "draft") {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    const updated = await projectService.toggleStatus(id)

    revalidatePath("/admin")
    revalidatePath("/")

    return { success: true, status: updated.status }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle project status"
    return { success: false, error: message }
  }
}

export async function reorderProjectsAction(items: { id: string; order: number }[]) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    await projectService.reorder(items)
    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true }
  } catch (error: unknown) {
    console.error("Error in reorderProjectsAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reorder projects",
    }
  }
}
