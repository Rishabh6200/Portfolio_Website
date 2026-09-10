import { dbConnect } from "@/lib/db/connect"
import { Experience } from "@/lib/db/models"
// Ensure Skill and Category models are registered in Mongoose for population
import "@/lib/db/models/category.model"
import "@/lib/db/models/skill.model"

export interface ExperienceInput {
  company: string
  role: string
  period: string
  location: string
  locationType?: string
  type?: string
  description: string
  achievements?: string[]
  skills?: string[]
  order?: number
}

export class ExperienceService {
  async getAll() {
    await dbConnect()

    const docs = await Experience.find()
      .populate({
        path: "skills",
        select: "name level categoryId",
        strictPopulate: false,
        populate: { path: "categoryId", select: "name slug color", strictPopulate: false },
      })
      .sort({ order: 1, createdAt: -1 })
      .lean()

    return JSON.parse(JSON.stringify(docs || []))
  }

  async getById(id: string) {
    await dbConnect()
    const doc = await Experience.findById(id)
      .populate({
        path: "skills",
        select: "name level categoryId",
        strictPopulate: false,
        populate: { path: "categoryId", select: "name slug color", strictPopulate: false },
      })
      .lean()
    if (!doc) return null
    return JSON.parse(JSON.stringify(doc))
  }

  async create(data: ExperienceInput) {
    await dbConnect()

    let order = data.order !== undefined ? Number(data.order) : NaN
    if (isNaN(order)) {
      const lastExp = await Experience.findOne().sort({ order: -1 }).select("order").lean()
      order = lastExp && typeof lastExp.order === "number" ? lastExp.order + 1 : 0
    }

    const created = await Experience.create({
      company: data.company.trim(),
      role: data.role.trim(),
      period: data.period.trim(),
      location: data.location.trim(),
      locationType: data.locationType?.trim() || "Remote",
      type: data.type?.trim() || "Full-Time",
      description: data.description.trim(),
      achievements: (data.achievements || []).map((a) => a.trim()).filter(Boolean),
      skills: data.skills || [],
      order,
    })

    return JSON.parse(JSON.stringify(created))
  }

  async update(id: string, data: ExperienceInput) {
    await dbConnect()

    const updatePayload: Record<string, any> = {
      company: data.company.trim(),
      role: data.role.trim(),
      period: data.period.trim(),
      location: data.location.trim(),
      locationType: data.locationType?.trim() || "Remote",
      type: data.type?.trim() || "Full-Time",
      description: data.description.trim(),
      achievements: (data.achievements || []).map((a) => a.trim()).filter(Boolean),
      skills: data.skills || [],
    }

    if (data.order !== undefined) {
      updatePayload.order = Number(data.order)
    }

    const updated = await Experience.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    }).lean()

    if (!updated) {
      throw new Error("Experience entry not found.")
    }

    return JSON.parse(JSON.stringify(updated))
  }

  async delete(id: string) {
    await dbConnect()
    const deleted = await Experience.findByIdAndDelete(id).lean()
    if (!deleted) {
      throw new Error("Experience entry not found.")
    }
    return JSON.parse(JSON.stringify(deleted))
  }

  async reorder(items: { id: string; order: number }[]) {
    await dbConnect()

    const ops = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } },
      },
    }))

    await Experience.bulkWrite(ops)
    return { success: true }
  }
}

export const experienceService = new ExperienceService()
