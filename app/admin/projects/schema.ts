import { z } from "zod"

export const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Project title is required")
    .max(120, "Title cannot exceed 120 characters"),
  slug: z
    .string()
    .max(120, "Slug cannot exceed 120 characters")
    .optional(),
  tagline: z
    .string()
    .min(1, "Tagline is required")
    .max(250, "Tagline cannot exceed 250 characters"),
  description: z
    .string()
    .min(1, "Description is required"),
  category: z
    .string()
    .min(1, "Category is required"),
  role: z
    .string()
    .min(1, "Role is required"),
  timeline: z.string().optional(),
  accentColor: z.string().optional(),
  coverImage: z.string().optional(),
  architectureDiagram: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  highlights: z.array(z.string()).default([]),
  architectureOverview: z.string().optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  featured: z.boolean().default(false),
  status: z.enum(["published", "draft"]).default("published"),
  order: z.number().int().min(0, "Order must be 0 or higher").default(0),
})

export type ProjectFormValues = z.infer<typeof projectSchema>
export type ProjectFormData = ProjectFormValues
