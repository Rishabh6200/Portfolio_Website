import { z } from "zod"

export const projectSchema = z.object({
   title: z
      .string()
      .trim()
      .min(1, "Project title is required")
      .max(100, "Title must be 100 characters or less"),
   slug: z
      .string()
      .trim()
      .min(1, "URL slug is required")
      .regex(
         /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
         "Slug must only contain lowercase alphanumeric characters and hyphens"
      ),
   role: z
      .string()
      .trim()
      .min(1, "Your role is required")
      .max(80, "Role must be 80 characters or less"),
   tagline: z
      .string()
      .trim()
      .min(1, "Tagline is required")
      .max(200, "Tagline must be 200 characters or less"),
   description: z
      .string()
      .trim()
      .min(1, "Project description is required"),
   status: z.enum(["published", "draft"]),
   featured: z.boolean(),
   logo: z.string(),
   images: z.array(z.string()),
   skillIds: z.array(z.string()),
   liveUrl: z
      .string()
      .trim()
      .url("Please enter a valid URL (e.g. https://example.com)")
      .or(z.literal("")),
   githubUrl: z
      .string()
      .trim()
      .url("Please enter a valid URL (e.g. https://github.com/username/project)")
      .or(z.literal("")),
})

export type ProjectFormValues = z.infer<typeof projectSchema>
