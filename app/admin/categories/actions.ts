"use server"

import { revalidatePath } from "next/cache"
import { categoryService, type CategoryInput } from "@/services"
import { categorySchema, type CategoryFormValues } from "./schema"

export type { CategoryFormValues as CategoryFormData }

export async function createCategoryAction(data: CategoryInput) {
  try {
    const parsed = categorySchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid category data" }
    }

    const category = await categoryService.create(parsed.data)

    revalidatePath("/admin", "layout")
    revalidatePath("/")

    return { success: true, category }
  } catch (error: unknown) {
    console.error("Error in createCategoryAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create category",
    }
  }
}

export async function updateCategoryAction(id: string, data: CategoryInput) {
  try {
    const parsed = categorySchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid category data" }
    }

    const category = await categoryService.update(id, parsed.data)

    revalidatePath("/admin", "layout")
    revalidatePath("/")

    return { success: true, category }
  } catch (error: unknown) {
    console.error("Error in updateCategoryAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update category",
    }
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await categoryService.delete(id)

    revalidatePath("/admin", "layout")
    revalidatePath("/")

    return { success: true }
  } catch (error: unknown) {
    console.error("Error in deleteCategoryAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete category",
    }
  }
}

export async function getCategoriesAction() {
  try {
    const categories = await categoryService.getAll()
    return { success: true, categories }
  } catch (error: unknown) {
    console.error("Error in getCategoriesAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch categories",
      categories: [],
    }
  }
}
