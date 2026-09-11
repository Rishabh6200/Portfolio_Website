import mongoose from "mongoose"
import { dbConnect } from "@/lib/db/connect"
import { Category, Skill } from "@/lib/db/models"

export interface SkillInput {
  name: string
  categoryId: string
  level?: "Proficient" | "Advanced" | "Expert"
  highlight?: boolean
  order?: number
}

export class SkillService {
  async getAll(filterCategory?: string) {
    await dbConnect()
    let filter: Record<string, unknown> = {}

    if (filterCategory) {
      if (mongoose.isValidObjectId(filterCategory)) {
        filter = { categoryId: filterCategory }
      } else {
        const cat = await Category.findOne({ slug: filterCategory }).select("_id").lean()
        if (cat) {
          filter = { categoryId: cat._id }
        } else {
          filter = { categoryId: filterCategory }
        }
      }
    }

    const docs = await Skill.find(filter)
      .populate("categoryId", "name slug color")
      .sort({ order: 1, createdAt: 1 })
      .lean()
    return JSON.parse(JSON.stringify(docs))
  }

  async getCategoryCounts(): Promise<Record<string, number>> {
    await dbConnect()
    const counts = await Skill.aggregate([
      { $group: { _id: "$categoryId", count: { $sum: 1 } } },
    ])
    const result: Record<string, number> = {}
    counts.forEach((c: { _id: unknown; count: number }) => {
      if (c._id) {
        result[String(c._id)] = c.count
      }
    })
    return result
  }

  async getById(id: string) {
    await dbConnect()
    const doc = await Skill.findById(id).lean()
    if (!doc) return null
    return JSON.parse(JSON.stringify(doc))
  }

  async create(data: SkillInput) {
    await dbConnect()

    const name = data.name.trim()
    const categoryId = data.categoryId

    const categoryExists = await Category.findById(categoryId)
    if (!categoryExists) {
      throw new Error("Selected parent category does not exist.")
    }

    const duplicate = await Skill.findOne({
      categoryId,
      name: { $regex: new RegExp(`^${name}$`, "i") },
    })
    if (duplicate) {
      throw new Error(
        `A skill with name "${name}" already exists in the selected category.`
      )
    }

    let order = data.order !== undefined ? Number(data.order) : NaN
    if (isNaN(order)) {
      const lastSkill = await Skill.findOne({ categoryId }).sort({ order: -1 }).select("order").lean()
      order = lastSkill && typeof lastSkill.order === "number" ? lastSkill.order + 1 : 0
    }

    const newSkill = await Skill.create({
      name,
      categoryId,
      level: data.level || "Advanced",
      highlight: Boolean(data.highlight),
      order,
    })

    return JSON.parse(JSON.stringify(newSkill))
  }

  async update(id: string, data: SkillInput) {
    await dbConnect()

    const skill = await Skill.findById(id)
    if (!skill) {
      throw new Error("Skill not found.")
    }

    const name = data.name.trim()
    const categoryId = data.categoryId

    const categoryExists = await Category.findById(categoryId)
    if (!categoryExists) {
      throw new Error("Selected parent category does not exist.")
    }

    const duplicate = await Skill.findOne({
      categoryId,
      name: { $regex: new RegExp(`^${name}$`, "i") },
      _id: { $ne: id },
    })
    if (duplicate) {
      throw new Error(
        `Another skill with name "${name}" already exists in this category.`
      )
    }

    skill.name = name
    skill.categoryId = categoryId as any
    skill.level = data.level || "Advanced"
    skill.highlight = Boolean(data.highlight)
    if (data.order !== undefined) {
      skill.order = Number(data.order) || 0
    }

    await skill.save()
    return JSON.parse(JSON.stringify(skill))
  }

  async updateLevel(id: string, level: "Proficient" | "Advanced" | "Expert") {
    await dbConnect()
    const skill = await Skill.findByIdAndUpdate(
      id,
      { level },
      { returnDocument: "after" }
    ).lean()
    if (!skill) {
      throw new Error("Skill not found.")
    }
    return JSON.parse(JSON.stringify(skill))
  }

  async delete(id: string) {
    await dbConnect()

    const skill = await Skill.findByIdAndDelete(id)
    if (!skill) {
      throw new Error("Skill not found or already deleted.")
    }

    return { success: true }
  }

  async reorder(items: { id: string; order: number }[]) {
    await dbConnect()
    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } },
      },
    }))
    if (bulkOps.length > 0) {
      await Skill.bulkWrite(bulkOps)
    }
    return { success: true }
  }

  /**
   * High-performance grouped query for the public website.
   * Returns categories with populated skills, falling back gracefully to static portfolioData.
   */
  async getCategoriesWithSkills() {
    try {
      await dbConnect()
      const [categories, skills] = await Promise.all([
        Category.find().sort({ order: 1, createdAt: 1 }).lean(),
        Skill.find().sort({ order: 1, createdAt: 1 }).lean(),
      ])

      if (categories && categories.length > 0) {
        return categories.map((cat: any) => ({
          _id: cat._id.toString(),
          name: cat.name,
          title: cat.name,
          slug: cat.slug,
          description: cat.description,
          icon: cat.icon,
          color: cat.color,
          skills: skills
            .filter((s: any) => s.categoryId.toString() === cat._id.toString())
            .map((s: any) => ({
              _id: s._id.toString(),
              name: s.name,
              level: s.level,
              highlight: s.highlight,
              order: s.order,
            })),
        }))
      }
    } catch (err) {
      console.error("Database connection error fetching skills:", err)
    }

    // If DB empty or unreachable, return empty array
    return []
  }
}

export const skillService = new SkillService()
