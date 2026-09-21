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
   order: z.number().optional(),
})

export type SkillFormValues = z.infer<typeof skillSchema>
export type SkillLevel = "Proficient" | "Advanced" | "Expert"
