import { z } from "zod"

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(60, "Category name must be 60 characters or less"),
  slug: z
    .string()
    .min(1, "Category slug is required")
    .max(60, "Category slug must be 60 characters or less")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens (e.g. backend-apis)"
    ),
  description: z
    .string()
    .max(300, "Description must be 300 characters or less"),
  icon: z.string().min(1, "Icon is required"),
  order: z.number().min(0, "Order must be 0 or greater").optional(),
  color: z
    .string()
    .regex(
      /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
      "Must be a valid hex color (e.g. #6366f1)"
    ),
})

export type CategoryFormValues = z.infer<typeof categorySchema>
export type CategoryFormData = CategoryFormValues
