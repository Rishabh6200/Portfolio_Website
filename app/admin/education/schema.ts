import { z } from "zod"

export const educationSchema = z.object({
  institution: z
    .string()
    .min(1, "Institution name is required")
    .max(120, "Institution name must be 120 characters or less"),
  degree: z
    .string()
    .min(1, "Degree or Certification title is required")
    .max(120, "Degree title must be 120 characters or less"),
  fieldOfStudy: z
    .string()
    .max(120, "Field of study must be 120 characters or less")
    .optional(),
  period: z
    .string()
    .min(1, "Period is required (e.g. 2018 — 2022)")
    .max(80, "Period must be 80 characters or less"),
  location: z
    .string()
    .trim()
    .min(1, "Location is required")
    .max(80, "Location must be 80 characters or less"),
  type: z
    .string()
    .min(1, "Type is required (e.g. Degree, Certification, Diploma)"),
  grade: z
    .string()
    .max(80, "Grade / Distinction must be 80 characters or less")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be 1000 characters or less"),
  highlights: z.array(z.string()),
  skills: z.array(z.string()),
  order: z.number().int().min(0, "Order must be 0 or higher").optional(),
})

export type EducationFormValues = z.infer<typeof educationSchema>
export type EducationFormData = EducationFormValues
