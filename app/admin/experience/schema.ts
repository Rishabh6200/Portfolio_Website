import { z } from "zod"

export const experienceSchema = z.object({
  company: z
    .string()
    .min(1, "Company name is required")
    .max(120, "Company name must be 120 characters or less"),
  role: z
    .string()
    .min(1, "Role is required")
    .max(120, "Role must be 120 characters or less"),
  period: z
    .string()
    .min(1, "Period is required (e.g. 2023 — Present)")
    .max(80, "Period must be 80 characters or less"),
  location: z
    .string()
    .trim()
    .min(1, "Location name is required")
    .max(80, "Location name must be 80 characters or less"),
  locationType: z
    .string()
    .optional(),
  type: z
    .string()
    .min(1, "Employment type is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be 1000 characters or less"),
  achievements: z.array(z.string()),
  skills: z.array(z.string()),
  order: z.number().int().min(0, "Order must be 0 or higher").optional(),
})

export type ExperienceFormValues = z.infer<typeof experienceSchema>
export type ExperienceFormData = ExperienceFormValues
