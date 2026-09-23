import { z } from "zod"

export const educationSchema = z.object({
   institution: z
      .string()
      .trim()
      .min(1, "Institution name is required")
      .max(120, "Institution name must be 120 characters or less"),
   degree: z
      .string()
      .trim()
      .min(1, "Degree or Certification title is required")
      .max(120, "Degree title must be 120 characters or less"),
   fieldOfStudy: z
      .string()
      .trim()
      .max(120, "Field of study must be 120 characters or less"),
   period: z
      .string()
      .trim()
      .min(1, "Period is required (e.g. 2018 — 2022)")
      .max(80, "Period must be 80 characters or less"),
   location: z
      .string()
      .trim()
      .min(1, "Location is required")
      .max(80, "Location must be 80 characters or less"),
   type: z
      .string()
      .trim()
      .min(1, "Type is required (e.g. Degree, Certification, Diploma)"),
   grade: z
      .string()
      .trim()
      .max(80, "Grade / Distinction must be 80 characters or less"),
   description: z
      .string()
      .trim()
      .min(1, "Overview is required")
      .max(1000, "Description must be 1000 characters or less"),
   highlights: z.array(z.string()),
   skillIds: z.array(z.string()),
   status: z.enum(["published", "draft"]),
   order: z.number().int().min(0).optional(),
})

export type EducationFormValues = z.infer<typeof educationSchema>
export type EducationFormData = EducationFormValues
