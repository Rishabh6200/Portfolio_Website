export interface Project {
  slug: string
  title: string
  tagline: string
  description: string
  category: "Full-Stack" | "Backend APIs" | "Web Apps"
  featured: boolean
  timeline: string
  role: string
  impact: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  accentColor: string
  architectureOverview: string
  challenge: string
  solution: string
  highlights: string[]
  metrics: {
    label: string
    value: string
  }[]
}

export interface Experience {
  company: string
  role: string
  period: string
  location: string
  type: string
  description: string
  achievements: string[]
  technologies: string[]
}

export interface SkillCategory {
  title: string
  skills: {
    name: string
    level: "Advanced" | "Expert" | "Proficient"
    highlight?: boolean
  }[]
}

export interface PortfolioData {
  personal: {
    name: string
    role: string
    tagline: string
    bio: string
    status: string
    location: string
    timezone: string
    email: string
    socials: {
      github: string
      linkedin: string
      twitter: string
      cal?: string
    }
    stats: {
      label: string
      value: string
      subtext: string
    }[]
  }
  skills: SkillCategory[]
  projects: Project[]
  experience: Experience[]
  principles: {
    title: string
    description: string
  }[]
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "Rishabh",
    role: "Full-Stack Developer (JavaScript)",
    tagline: "I build robust, high-throughput backend APIs in NestJS & Laravel, paired with polished React web applications.",
    bio: "I’m a full-stack developer specializing in scalable backend architectures and dynamic web applications. Over the last 6+ years, I’ve architected modular microservice APIs with NestJS, production web platforms with Laravel, and interactive frontend dashboards using React and Next.js.",
    status: "Open for Work",
    location: "Mohali, India (IST)",
    timezone: "Asia/Kolkata",
    email: "rc4556c@gmail.com",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://x.com",
      cal: "https://cal.com",
    },
    stats: [
      { label: "Years Experience", value: "6+", subtext: "Full-stack & distributed APIs" },
      { label: "Production Apps", value: "20+", subtext: "Deployed across enterprise SaaS" },
      { label: "API Reliability", value: "99.99%", subtext: "Uptime across microservices" },
      { label: "GitHub Stars", value: "2.8k", subtext: "Across developer libraries" },
    ],
  },
  skills: [],
  projects: [],
  experience: [],
  principles: [
    {
      title: "Clean Architecture & Modularity",
      description: "Whether structuring NestJS modules or Laravel service layers, clean separation of concerns and type-safe contracts ensure systems scale gracefully.",
    },
    {
      title: "Resilient APIs by Default",
      description: "Atomic database transactions, Redis rate-limiting, and idempotent webhook handlers build bulletproof backend services that survive real-world traffic spikes.",
    },
    {
      title: "Polished, Intuitive Interfaces",
      description: "Instant optimistic state updates, smooth micro-animations, and accessible keyboard navigation elevate web applications from functional to delightful.",
    },
  ],
}
