import fs from "node:fs"
import path from "node:path"
import mongoose from "mongoose"
import { dbConnect } from "../lib/db/connect"
import { Category } from "../lib/db/models/category.model"
import { Skill } from "../lib/db/models/skill.model"
import { Profile } from "../lib/db/models/profile.model"
import { Project } from "../lib/db/models/project.model"
import { Experience } from "../lib/db/models/experience.model"
import { Education } from "../lib/db/models/education.model"
import { DEFAULT_PROFILE } from "../lib/constants/profile"

export interface SkillSeedItem {
  name: string
  level: "Proficient" | "Advanced" | "Expert"
  highlight: boolean
  order: number
}

export interface CategorySeedGroup {
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  order: number
  skills: SkillSeedItem[]
}

export const skillSeedData: CategorySeedGroup[] = [
  {
    name: "Backend",
    slug: "backend",
    description: "Distributed architectures, microservices, high-throughput RESTful APIs, and background workers.",
    icon: "Server",
    color: "#6366f1",
    order: 0,
    skills: [
      { name: "NestJS", level: "Expert", highlight: true, order: 0 },
      { name: "Node.js", level: "Expert", highlight: true, order: 1 },
      { name: "Laravel", level: "Expert", highlight: true, order: 2 },
      { name: "RESTful APIs & OpenAPI", level: "Expert", highlight: true, order: 3 },
      { name: "BullMQ & Queues", level: "Advanced", highlight: false, order: 4 },
      { name: "GraphQL", level: "Proficient", highlight: false, order: 6 },
      { name: "Express.js", level: "Advanced", highlight: false, order: 7 },
    ],
  },
  {
    name: "Frontend",
    slug: "frontend",
    description: "Modern web applications, reactive dashboards, state management, and high-performance UI.",
    icon: "Layout",
    color: "#06b6d4",
    order: 1,
    skills: [
      { name: "React 19", level: "Expert", highlight: true, order: 0 },
      { name: "Next.js (App Router)", level: "Expert", highlight: true, order: 1 },
      { name: "TypeScript", level: "Expert", highlight: true, order: 2 },
      { name: "Tailwind CSS", level: "Expert", highlight: true, order: 3 },
      { name: "Framer Motion", level: "Advanced", highlight: true, order: 4 },
      { name: "State Management (Zustand)", level: "Advanced", highlight: false, order: 5 },
      { name: "Responsive & Accessible UI", level: "Expert", highlight: false, order: 6 },
    ],
  },
  {
    name: "Database & Cache",
    slug: "database-cache",
    description: "Relational, document, and in-memory key-value data stores with optimized indexing and locking.",
    icon: "Database",
    color: "#10b981",
    order: 2,
    skills: [
      { name: "PostgreSQL", level: "Expert", highlight: true, order: 0 },
      { name: "Redis", level: "Expert", highlight: true, order: 1 },
      { name: "MongoDB & Mongoose", level: "Advanced", highlight: true, order: 2 },
      { name: "MySQL", level: "Advanced", highlight: false, order: 3 },
      { name: "Prisma ORM", level: "Advanced", highlight: false, order: 4 },
      { name: "Database Indexing & Locks", level: "Advanced", highlight: false, order: 5 },
    ],
  },
  {
    name: "DevOps & Cloud",
    slug: "devops-cloud",
    description: "Containerization, cloud infrastructure, CI/CD deployment pipelines, and server provisioning.",
    icon: "Cloud",
    color: "#f59e0b",
    order: 3,
    skills: [
      { name: "Docker & Containers", level: "Advanced", highlight: true, order: 0 },
      { name: "AWS (EC2, S3, ECS)", level: "Advanced", highlight: false, order: 1 },
      { name: "CI/CD & GitHub Actions", level: "Advanced", highlight: false, order: 2 },
      { name: "Linux & Nginx", level: "Advanced", highlight: false, order: 3 },
      { name: "Vercel & Cloudflare", level: "Expert", highlight: true, order: 4 },
    ],
  },
  {
    name: "Core & Languages",
    slug: "core-languages",
    description: "Core programming languages, paradigms, design patterns, and development fundamentals.",
    icon: "Code2",
    color: "#8b5cf6",
    order: 4,
    skills: [
      { name: "TypeScript", level: "Expert", highlight: true, order: 0 },
      { name: "JavaScript (ESNext)", level: "Expert", highlight: true, order: 1 },
      { name: "PHP 8+", level: "Advanced", highlight: false, order: 2 },
      { name: "SQL", level: "Expert", highlight: true, order: 3 },
      { name: "Git & Version Control", level: "Expert", highlight: false, order: 4 },
      { name: "Clean Architecture & OOP", level: "Expert", highlight: true, order: 5 },
    ],
  },
]

// Auto-load .env.local / .env if MONGODB_URI is not set in environment
if (!process.env.MONGODB_URI) {
  const envFiles = [".env.local", ".env"]
  for (const file of envFiles) {
    const fullPath = path.resolve(process.cwd(), file)
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf-8")
      for (const line of content.split("\n")) {
        const trimmed = line.trim()
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
          const [key, ...values] = trimmed.split("=")
          const val = values.join("=").replace(/^["']|["']$/g, "")
          if (key && !process.env[key]) {
            process.env[key] = val
          }
        }
      }
      break
    }
  }
}

export async function seedAll() {
  console.log("🚀 Starting comprehensive portfolio database seeding...\n")

  try {
    await dbConnect()
    console.log("✅ Database connection established.\n")

    // ------------------------------------------------------------------------
    // 1. Seed Profile
    // ------------------------------------------------------------------------
    console.log("👤 Seeding Profile...")
    const profileDoc = await Profile.findOneAndUpdate(
      {},
      { $set: DEFAULT_PROFILE },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    )
    console.log(`   ↳ Profile synced: "${profileDoc.name}" (${profileDoc.role})\n`)

    // ------------------------------------------------------------------------
    // 2. Seed Categories & Skills
    // ------------------------------------------------------------------------
    console.log("🛠️  Seeding Categories & Skills...")
    const skillMap = new Map<string, mongoose.Types.ObjectId>()

    for (const catData of skillSeedData) {
      const categoryDoc = await Category.findOneAndUpdate(
        { slug: catData.slug },
        {
          $set: {
            name: catData.name,
            slug: catData.slug,
            description: catData.description || "",
            icon: catData.icon || "Server",
            color: catData.color || "#6366f1",
            order: catData.order ?? 0,
          },
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      )

      if (catData.skills && catData.skills.length > 0) {
        for (const skill of catData.skills) {
          const skillDoc = await Skill.findOneAndUpdate(
            { categoryId: categoryDoc._id, name: skill.name.trim() },
            {
              $set: {
                name: skill.name.trim(),
                categoryId: categoryDoc._id,
                level: skill.level,
                highlight: Boolean(skill.highlight),
                order: Number(skill.order) || 0,
              },
            },
            { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
          )
          skillMap.set(skillDoc.name.toLowerCase(), skillDoc._id)
        }
      }
    }
    console.log(`   ↳ Synced ${skillSeedData.length} categories and ${skillMap.size} skills.\n`)

    // Helper to resolve skill IDs by name
    const resolveSkillIds = (names: string[]): mongoose.Types.ObjectId[] => {
      const ids: mongoose.Types.ObjectId[] = []
      for (const name of names) {
        const found = skillMap.get(name.toLowerCase())
        if (found) ids.push(found)
      }
      return ids
    }

    // ------------------------------------------------------------------------
    // 3. Seed Work Experience
    // ------------------------------------------------------------------------
    console.log("💼 Seeding Work Experience...")
    const experienceData = [
      {
        company: "Vanguard Systems",
        role: "Staff Backend & Full-Stack Engineer",
        period: "2023 — Present",
        location: "Remote",
        locationType: "Remote",
        type: "Full-Time",
        description:
          "Leading backend API design and frontend architecture for enterprise developer tools and subscription systems.",
        achievements: [
          "Architected modular NestJS microservices handling 15,000+ requests/sec with Redis caching and BullMQ queues.",
          "Spearheaded React 19 web application re-architecture, improving Lighthouse performance score to 99.",
          "Designed Laravel billing and webhook processing infrastructure with Stripe Cashier.",
        ],
        skillNames: ["NestJS", "React 19", "Laravel", "TypeScript", "PostgreSQL", "Redis"],
        order: 0,
      },
      {
        company: "Synthetix Cloud",
        role: "Senior Full-Stack Engineer",
        period: "2021 — 2023",
        location: "Remote",
        locationType: "Remote",
        type: "Full-Time",
        description:
          "Built high-concurrency Laravel REST APIs, real-time React dashboards, and high-frequency webhook ingestors.",
        achievements: [
          "Delivered headless e-commerce backend in Laravel 11 with sub-200ms checkout and zero-oversell concurrency locks.",
          "Created real-time node canvas editor in React with WebSockets and optimistic state synchronization.",
          "Implemented automated OpenAPI documentation and CI/CD testing pipelines.",
        ],
        skillNames: ["Laravel", "React 19", "TypeScript", "Node.js", "MySQL", "Redis"],
        order: 1,
      },
      {
        company: "Nebula Interactive",
        role: "Full-Stack Developer",
        period: "2019 — 2021",
        location: "Austin, TX",
        locationType: "Hybrid",
        type: "Full-Time",
        description:
          "Developed customer-facing React portals and Node.js / PHP backend APIs for high-growth SaaS clients.",
        achievements: [
          "Built modular component libraries and RESTful API endpoints for multi-tenant customer applications.",
          "Optimized client-side bundle size by 35% through dynamic code splitting and modern assets caching.",
        ],
        skillNames: ["React 19", "JavaScript (ESNext)", "Node.js", "MySQL", "Tailwind CSS"],
        order: 2,
      },
    ]

    for (const exp of experienceData) {
      await Experience.findOneAndUpdate(
        { company: exp.company, period: exp.period },
        {
          $set: {
            company: exp.company,
            role: exp.role,
            period: exp.period,
            location: exp.location,
            locationType: exp.locationType,
            type: exp.type,
            description: exp.description,
            achievements: exp.achievements,
            skills: resolveSkillIds(exp.skillNames),
            order: exp.order,
          },
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      )
    }
    console.log(`   ↳ Synced ${experienceData.length} work experience records.\n`)

    // ------------------------------------------------------------------------
    // 4. Seed Education & Certifications (Approach 1)
    // ------------------------------------------------------------------------
    console.log("🎓 Seeding Education & Certifications...")
    const educationData = [
      {
        institution: "Punjab Technical University (PTU)",
        degree: "Bachelor of Technology (B.Tech)",
        fieldOfStudy: "Computer Science & Engineering",
        period: "2015 — 2019",
        location: "Punjab, India",
        type: "Degree",
        grade: "First Class with Distinction",
        description:
          "Rigorous academic foundation in distributed systems, computer architecture, algorithms, and software engineering methodologies.",
        highlights: [
          "Graduated in top percentile with specialized focus on Distributed Systems and Relational Database Internals.",
          "Capstone Project: High-throughput distributed task scheduler with fault-tolerant worker nodes.",
          "Active lead of University Open Source & Competitive Programming Club.",
        ],
        skillNames: ["SQL", "Clean Architecture & OOP", "TypeScript", "Node.js"],
        order: 0,
      },
      {
        institution: "Amazon Web Services (AWS)",
        degree: "AWS Certified Solutions Architect",
        fieldOfStudy: "Cloud Architecture & Infrastructure",
        period: "Issued 2023",
        location: "Online / Global",
        type: "Certification",
        grade: "Certified",
        description:
          "Comprehensive architectural validation covering multi-tier cloud deployments, microservices resilience, IAM security, and auto-scaling infrastructure.",
        highlights: [
          "Validated expertise in designing highly available, cost-efficient, and fault-tolerant distributed systems on AWS.",
          "Focus on VPC peering, ECS container orchestration, and multi-region S3/RDS data pipelines.",
        ],
        skillNames: ["Docker & Containers", "AWS (EC2, S3, ECS)", "Linux & Nginx"],
        order: 1,
      },
      {
        institution: "Meta / Coursera",
        degree: "Meta Certified Front-End Developer",
        fieldOfStudy: "Modern Frontend Engineering",
        period: "Issued 2022",
        location: "Online / Global",
        type: "Certification",
        grade: "Certified",
        description:
          "Advanced specialization in React architecture, state management, asynchronous data streams, accessibility, and UI performance engineering.",
        highlights: [
          "In-depth mastery of component lifecycles, custom hooks, context architectures, and Core Web Vitals optimization.",
          "Advanced accessibility (WCAG) and end-to-end user experience engineering.",
        ],
        skillNames: ["React 19", "Next.js (App Router)", "TypeScript", "Tailwind CSS"],
        order: 2,
      },
    ]

    for (const edu of educationData) {
      await Education.findOneAndUpdate(
        { institution: edu.institution, degree: edu.degree },
        {
          $set: {
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            period: edu.period,
            location: edu.location,
            type: edu.type,
            grade: edu.grade,
            description: edu.description,
            highlights: edu.highlights,
            skills: resolveSkillIds(edu.skillNames),
            order: edu.order,
          },
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      )
    }
    console.log(`   ↳ Synced ${educationData.length} education & certification records.\n`)

    // ------------------------------------------------------------------------
    // 5. Seed Projects
    // ------------------------------------------------------------------------
    console.log("🚀 Seeding Projects...")
    const projectData = [
      {
        slug: "cloudpulse-api-gateway",
        title: "CloudPulse API Gateway",
        tagline: "High-throughput distributed API gateway with sub-15ms latency routing",
        description:
          "A high-performance API gateway engineered in NestJS & Node.js, delivering intelligent route dispatching, token-bucket rate limiting via Redis, and centralized JWT authentication for enterprise microservice clusters.",
        role: "Lead Backend Architect",
        featured: true,
        status: "published" as const,
        order: 0,
        liveUrl: "https://cloudpulse-gateway.dev",
        githubUrl: "https://github.com/example/cloudpulse-api-gateway",
        skillNames: ["NestJS", "Node.js", "Redis", "Docker & Containers", "PostgreSQL"],
      },
      {
        slug: "hyperflow-studio",
        title: "Hyperflow Studio",
        tagline: "Interactive node-based visual workflow automation canvas with live execution",
        description:
          "A node-based workflow builder built on React 19 and Next.js, featuring smooth infinite canvas rendering, real-time WebSocket state synchronization, and modular automation blocks with step-through execution breakpoints.",
        role: "Full-Stack Architect",
        featured: true,
        status: "published" as const,
        order: 1,
        liveUrl: "https://hyperflow-studio.app",
        githubUrl: "https://github.com/example/hyperflow-studio",
        skillNames: ["React 19", "Next.js (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion"],
      },
      {
        slug: "nexus-commerce-engine",
        title: "Nexus Commerce Engine",
        tagline: "Headless e-commerce platform & high-concurrency order processing API",
        description:
          "A headless e-commerce backend built with Laravel 11 REST API, integrated with Stripe Webhooks, Redis caching, and a responsive React shopping storefront with pessimistic locking preventing race conditions.",
        role: "Full-Stack Tech Lead",
        featured: true,
        status: "published" as const,
        order: 2,
        liveUrl: "https://nexus-commerce.vercel.app",
        githubUrl: "https://github.com/example/nexus-commerce-engine",
        skillNames: ["Laravel", "React 19", "MySQL", "Redis"],
      },
      {
        slug: "saasflow-billing-api",
        title: "SaaSFlow Billing API",
        tagline: "Multi-tenant subscription management and usage-based metering engine",
        description:
          "An automated multi-tenant billing engine built on Laravel API with custom usage metering, tiered recurring invoicing, webhooks, and an administrative React portal.",
        role: "Backend Systems Engineer",
        featured: false,
        status: "published" as const,
        order: 3,
        githubUrl: "https://github.com/example/saasflow-billing-api",
        skillNames: ["Laravel", "NestJS", "PostgreSQL", "Redis", "Docker & Containers"],
      },
    ]

    for (const proj of projectData) {
      await Project.findOneAndUpdate(
        { slug: proj.slug },
        {
          $set: {
            slug: proj.slug,
            title: proj.title,
            tagline: proj.tagline,
            description: proj.description,
            role: proj.role,
            featured: proj.featured,
            status: proj.status,
            order: proj.order,
            liveUrl: proj.liveUrl,
            githubUrl: proj.githubUrl,
            skills: resolveSkillIds(proj.skillNames),
          },
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      )
    }
    console.log(`   ↳ Synced ${projectData.length} production project records.\n`)

    console.log("🎉 All collections successfully seeded into the database!")
    return { success: true }
  } catch (error) {
    console.error("❌ Error during database seeding:", error)
    throw error
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
      console.log("🔌 Database disconnected.")
    }
  }
}

// Allow direct execution via CLI
const isMainModule =
  typeof process !== "undefined" &&
  process.argv[1] &&
  (process.argv[1].endsWith("seed-all.ts") || process.argv[1].endsWith("seed-all.js"))

if (isMainModule) {
  seedAll()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
