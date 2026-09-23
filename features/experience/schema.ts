import { z } from "zod"

export const experienceSchema = z.object({
   company: z
      .string()
      .trim()
      .min(1, "Company name is required")
      .max(120, "Company name must be 120 characters or less"),
   role: z
      .string()
      .trim()
      .min(1, "Role is required")
      .max(120, "Role must be 120 characters or less"),
   period: z
      .string()
      .trim()
      .min(1, "Period is required (e.g. 2023 — Present)")
      .max(80, "Period must be 80 characters or less"),
   location: z
      .string()
      .trim()
      .min(1, "Location is required")
      .max(80, "Location must be 80 characters or less"),
   locationType: z.enum(["Remote", "On-Site", "Hybrid"]),
   type: z
      .string()
      .trim()
      .min(1, "Employment type is required"),
   description: z
      .string()
      .trim()
      .min(1, "Role summary is required")
      .max(1000, "Description must be 1000 characters or less"),
   achievements: z.array(z.string()),
   skillIds: z.array(z.string()),
   order: z.number().int().min(0).optional(),
})

export type ExperienceFormValues = z.infer<typeof experienceSchema>
export type ExperienceFormData = ExperienceFormValues
