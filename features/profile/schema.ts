import { z } from "zod"

export const profileStatSchema = z.object({
   label: z.string().trim().min(1, "Label is required"),
   value: z.string().trim().min(1, "Value is required"),
   subtext: z.string().trim(),
})

export const profileSocialsSchema = z.object({
   github: z.string().trim(),
   linkedin: z.string().trim(),
   twitter: z.string().trim(),
   cal: z.string().trim(),
   email: z.string().trim(),
})

export const profileSchema = z.object({
   name: z
      .string()
      .trim()
      .min(1, "Display name is required")
      .max(80, "Name must be 80 characters or less"),
   role: z
      .string()
      .trim()
      .min(1, "Role title is required")
      .max(120, "Role must be 120 characters or less"),
   tagline: z
      .string()
      .trim()
      .max(255, "Tagline must be 255 characters or less"),
   bio: z
      .string()
      .trim()
      .max(1500, "Bio must be 1500 characters or less"),
   status: z
      .string()
      .trim()
      .min(1, "Status is required")
      .max(100, "Status must be 100 characters or less"),
   location: z
      .string()
      .trim()
      .max(100, "Location must be 100 characters or less"),
   timezone: z
      .string()
      .trim()
      .max(80, "Timezone must be 80 characters or less"),
   email: z
      .string()
      .trim()
      .email("Please provide a valid email address"),
   socials: profileSocialsSchema,
   stats: z.array(profileStatSchema).min(1, "At least one stat card is required"),
})

export type ProfileStatItem = z.infer<typeof profileStatSchema>
export type ProfileSocials = z.infer<typeof profileSocialsSchema>
export type ProfileFormValues = z.infer<typeof profileSchema>

export interface ProfileData extends ProfileFormValues {
   id?: string
   createdAt?: string
   updatedAt?: string
}

export const DEFAULT_PROFILE: ProfileData = {
   name: "Rishabh",
   role: "Full-Stack & Systems Developer",
   tagline: "Architecting high-throughput systems & fluid web products.",
   bio: "I’m a full-stack developer specializing in scalable backend architectures and dynamic web applications. I’ve architected modular APIs with NestJS, production web platforms with Laravel, and interactive frontend dashboards using React and Next.js.",
   status: "Open for Work",
   location: "Mohali, India (IST)",
   timezone: "Asia/Kolkata",
   email: "rc4556c@gmail.com",
   socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://x.com",
      cal: "https://cal.com",
      email: "rc4556c@gmail.com",
   },
   stats: [
      { label: "Years Experience", value: "6+", subtext: "Full-stack & distributed APIs" },
      { label: "Production Apps", value: "20+", subtext: "Deployed across enterprise SaaS" },
      { label: "API Reliability", value: "99.99%", subtext: "Uptime across microservices" },
      { label: "GitHub Stars", value: "2.8k", subtext: "Across developer libraries" },
   ],
}
