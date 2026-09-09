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
    name: "Alex Rivera",
    role: "Full-Stack Engineer (NestJS • React • Laravel)",
    tagline: "I build robust, high-throughput backend APIs in NestJS & Laravel, paired with polished React web applications.",
    bio: "I’m a full-stack engineer specializing in scalable backend architectures and dynamic web applications. Over the last 6+ years, I’ve architected modular microservice APIs with NestJS, production web platforms with Laravel, and interactive frontend dashboards using React and Next.js.",
    status: "Open for Work",
    location: "Mohali, India (IST)",
    timezone: "Asia/Kolkata",
    email: "[EMAIL_ADDRESS]",
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
  experience: [
    {
      company: "Vanguard Systems",
      role: "Staff Backend & Full-Stack Engineer",
      period: "2023 — Present",
      location: "Remote",
      type: "Full-Time",
      description: "Leading backend API design and frontend architecture for enterprise developer tools and subscription systems.",
      achievements: [
        "Architected modular NestJS microservices handling 15,000+ requests/sec with Redis caching and BullMQ queues.",
        "Spearheaded React 19 web application re-architecture, improving Lighthouse performance score to 99.",
        "Designed Laravel billing and webhook processing infrastructure with Stripe Cashier.",
      ],
      technologies: ["NestJS", "React", "Laravel", "TypeScript", "PostgreSQL", "Redis", "Docker"],
    },
    {
      company: "Synthetix Cloud",
      role: "Senior Full-Stack Engineer",
      period: "2021 — 2023",
      location: "Remote",
      type: "Full-Time",
      description: "Built high-concurrency Laravel REST APIs, real-time React dashboards, and high-frequency webhook ingestors.",
      achievements: [
        "Delivered headless e-commerce backend in Laravel 11 with sub-200ms checkout and zero-oversell concurrency locks.",
        "Created real-time node canvas editor in React with WebSockets and optimistic state synchronization.",
        "Implemented automated OpenAPI documentation and CI/CD testing pipelines.",
      ],
      technologies: ["Laravel", "React", "TypeScript", "Node.js", "MySQL", "Redis", "Docker"],
    },
    {
      company: "Nebula Interactive",
      role: "Full-Stack Developer",
      period: "2019 — 2021",
      location: "Austin, TX",
      type: "Full-Time",
      description: "Developed customer-facing React portals and Node.js / PHP backend APIs for high-growth SaaS clients.",
      achievements: [
        "Built modular component libraries and RESTful API endpoints for multi-tenant customer applications.",
        "Optimized client-side bundle size by 35% through dynamic code splitting and modern assets caching.",
      ],
      technologies: ["React", "JavaScript", "PHP", "Node.js", "MySQL", "Tailwind CSS"],
    },
  ],
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
