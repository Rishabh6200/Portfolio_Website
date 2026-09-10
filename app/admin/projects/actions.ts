"use server"

import { revalidatePath } from "next/cache"
import { projectService, type ProjectInput } from "@/services"
import { uploadToImageKit, isImageKitConfigured } from "@/lib/imagekit"
import { isAdminAuthenticated } from "@/lib/auth/session"
import { projectSchema, type ProjectFormValues } from "./schema"

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

export async function uploadProjectMediaAction(formData: FormData) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    if (!isImageKitConfigured()) {
      return {
        success: false,
        error:
          "ImageKit is not configured. Please add NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT to .env.local, or use the 'Paste URL' tab.",
      }
    }

    const file = formData.get("file") as File | null
    if (!file) {
      return { success: false, error: "No file provided" }
    }

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Only image files (PNG, JPG, WebP, SVG) are allowed." }
    }

    if (file.size > 10 * 1024 * 1024) {
      return { success: false, error: "File size exceeds 10MB limit." }
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const result = await uploadToImageKit(buffer, sanitizedName, "/portfolio/projects")

    return { success: true, url: result.url }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload image"
    return { success: false, error: message }
  }
}
