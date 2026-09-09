import { z } from "zod"

export const skillSchema = z.object({
  name: z
    .string()
    .min(1, "Skill name is required")
    .max(60, "Skill name must be 60 characters or less"),
  categoryId: z
    .string()
    .min(1, "Please select a category"),
  level: z.enum(["Proficient", "Advanced", "Expert"], {
    message: "Select a valid proficiency level",
  }),
  highlight: z.boolean(),
  order: z.number().min(0, "Order must be 0 or greater"),
})

export type SkillFormValues = z.infer<typeof skillSchema>
