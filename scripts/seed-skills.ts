import fs from "node:fs"
import path from "node:path"
import mongoose from "mongoose"
import { Category } from "@/lib/db/models/category.model"
import { Skill } from "@/lib/db/models/skill.model"
import { dbConnect } from "@/lib/db/connect"

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

/**
 * Seed dataset structured as per the Skill & Category form fields:
 * - Parent Category (Linked via Category model)
 * - Skill / Technology Name
 * - Proficiency Level ("Expert" | "Advanced" | "Proficient")
 * - Display Sort Order (number)
 * - Highlight ("Highlight this skill on public website")
 */
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

/**
 * Bulk seed function to insert or update skills linked to their respective categories.
 *
 * Safe to run multiple times: uses upsert operations to prevent duplicate key errors
 * on the { categoryId, name } unique index.
 */
export async function seedSkills(dataset: CategorySeedGroup[] = skillSeedData) {
  console.log("🌱 Starting bulk skill seeding process...")

  try {
    await dbConnect()
    console.log("✅ Database connection established.")

    let totalCategoriesSeeded = 0
    let totalSkillsSeeded = 0

    for (const catData of dataset) {
      // 1. Find or create category
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

      totalCategoriesSeeded++
      console.log(`📁 Linked Category: "${categoryDoc.name}" (ID: ${categoryDoc._id})`)

      // 2. Prepare bulk operations for skills under this category
      if (catData.skills && catData.skills.length > 0) {
        const bulkOps = catData.skills.map((skill) => ({
          updateOne: {
            filter: {
              categoryId: categoryDoc._id,
              name: skill.name.trim(),
            },
            update: {
              $set: {
                name: skill.name.trim(),
                categoryId: categoryDoc._id,
                level: skill.level,
                highlight: Boolean(skill.highlight),
                order: Number(skill.order) || 0,
              },
            },
            upsert: true,
          },
        }))

        const result = await Skill.bulkWrite(bulkOps)
        const count =
          (result.upsertedCount || 0) +
          (result.modifiedCount || 0) +
          (result.matchedCount || 0)

        totalSkillsSeeded += catData.skills.length
        console.log(
          `   ↳ Synced ${catData.skills.length} skills (Upserted: ${result.upsertedCount}, Modified: ${result.modifiedCount})`
        )
      }
    }

    console.log("\n🎉 Skill seeding completed successfully!")
    console.log(`   - Categories Synced: ${totalCategoriesSeeded}`)
    console.log(`   - Skills Synced:     ${totalSkillsSeeded}`)

    return {
      success: true,
      categoriesCount: totalCategoriesSeeded,
      skillsCount: totalSkillsSeeded,
    }
  } catch (error) {
    console.error("❌ Error during skill seeding:", error)
    throw error
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
      console.log("🔌 Database disconnected.")
    }
  }
}

// Allow direct execution via CLI (e.g. `npx tsx scripts/seed-skills.ts`)
const isMainModule =
  typeof process !== "undefined" &&
  process.argv[1] &&
  (process.argv[1].endsWith("seed-skills.ts") || process.argv[1].endsWith("seed-skills.js"))

if (isMainModule) {
  seedSkills()
    .then(() => {
      process.exit(0)
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
