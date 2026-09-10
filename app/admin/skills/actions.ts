"use server"

import { revalidatePath } from "next/cache"
import { skillService, type SkillInput } from "@/services"
import { isAdminAuthenticated } from "@/lib/auth/session"
import { skillSchema } from "./schema"

export async function createSkillAction(data: SkillInput) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    const parsed = skillSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid skill data",
      }
    }

    const skill = await skillService.create(parsed.data)

    revalidatePath("/admin", "layout")
    revalidatePath("/")

    return { success: true, skill }
  } catch (error: unknown) {
    console.error("Error in createSkillAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create skill",
    }
  }
}

export async function updateSkillAction(id: string, data: SkillInput) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    const parsed = skillSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid skill data",
      }
    }

    const skill = await skillService.update(id, parsed.data)

    revalidatePath("/admin", "layout")
    revalidatePath("/")

    return { success: true, skill }
  } catch (error: unknown) {
    console.error("Error in updateSkillAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update skill",
    }
  }
}

export async function deleteSkillAction(id: string) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    await skillService.delete(id)

    revalidatePath("/admin", "layout")
    revalidatePath("/")

    return { success: true }
  } catch (error: unknown) {
    console.error("Error in deleteSkillAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete skill",
    }
  }
}

export async function getSkillsAction(filterCategoryId?: string) {
  try {
    const skills = await skillService.getAll(filterCategoryId)
    return { success: true, skills }
  } catch (error: unknown) {
    console.error("Error in getSkillsAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch skills",
      skills: [],
    }
  }
}

export async function reorderSkillsAction(items: { id: string; order: number }[]) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    await skillService.reorder(items)
    revalidatePath("/admin/skills")
    revalidatePath("/")
    return { success: true }
  } catch (error: unknown) {
    console.error("Error in reorderSkillsAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reorder skills",
    }
  }
}

export async function updateSkillLevelAction(
  id: string,
  level: "Proficient" | "Advanced" | "Expert"
) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    if (!["Proficient", "Advanced", "Expert"].includes(level)) {
      return {
        success: false,
        error: "Invalid proficiency level",
      }
    }

    const skill = await skillService.updateLevel(id, level)

    revalidatePath("/admin/skills")
    revalidatePath("/admin", "layout")
    revalidatePath("/")

    return { success: true, skill }
  } catch (error: unknown) {
    console.error("Error in updateSkillLevelAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update proficiency level",
    }
  }
}
