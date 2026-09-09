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
  async getAll(filterCategoryId?: string) {
    await dbConnect()
    const filter = filterCategoryId ? { categoryId: filterCategoryId } : {}
    const docs = await Skill.find(filter)
      .populate("categoryId", "name slug color")
      .sort({ order: 1, createdAt: 1 })
      .lean()
    return JSON.parse(JSON.stringify(docs))
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

    const newSkill = await Skill.create({
      name,
      categoryId,
      level: data.level || "Advanced",
      highlight: Boolean(data.highlight),
      order: Number(data.order) || 0,
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
    skill.order = Number(data.order) || 0

    await skill.save()
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
