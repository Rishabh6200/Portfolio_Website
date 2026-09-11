export interface ProfileStat {
  label: string
  value: string
  subtext: string
}

export interface ProfileSocials {
  github: string
  linkedin: string
  twitter: string
  cal?: string
  email?: string
}

export interface ProfileData {
  _id?: string
  name: string
  role: string
  tagline: string
  bio: string
  status: string
  location: string
  timezone: string
  email: string
  socials: ProfileSocials
  stats: ProfileStat[]
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
