import { z } from "zod"

export const categorySchema = z.object({
   name: z.string().min(1, "Category name is required").max(60),
   slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
   description: z.string().max(300).optional(),
   icon: z.string().min(1, "Icon is required"),
   color: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Must be a valid hex color"),
   order: z.number().optional(),
})

export type CategoryFormValues = z.infer<typeof categorySchema>