import { dbConnect } from "@/lib/db/connect"
import { Education } from "@/lib/db/models"
import "@/lib/db/models/category.model"
import "@/lib/db/models/skill.model"

export interface EducationInput {
  institution: string
  degree: string
  fieldOfStudy?: string
  period: string
  location: string
  type?: string
  grade?: string
  description: string
  highlights?: string[]
  skills?: string[]
  status?: "published" | "draft"
  order?: number
}

export class EducationService {
  async getAll() {
    await dbConnect()

    const docs = await Education.find()
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

  async getPublished() {
    try {
      await dbConnect()
      const docs = await Education.find({ status: { $ne: "draft" } })
        .populate({
          path: "skills",
          select: "name level categoryId",
          strictPopulate: false,
          populate: { path: "categoryId", select: "name slug color", strictPopulate: false },
        })
        .sort({ order: 1, createdAt: -1 })
        .lean()
      return JSON.parse(JSON.stringify(docs || []))
    } catch (err) {
      console.error("Error fetching published education records:", err)
      return []
    }
  }

  async getById(id: string) {
    await dbConnect()
    const doc = await Education.findById(id)
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

  async create(data: EducationInput) {
    await dbConnect()

    let order = data.order !== undefined ? Number(data.order) : NaN
    if (isNaN(order)) {
      const lastEdu = await Education.findOne().sort({ order: -1 }).select("order").lean()
      order = lastEdu && typeof lastEdu.order === "number" ? lastEdu.order + 1 : 0
    }

    const created = await Education.create({
      institution: data.institution.trim(),
      degree: data.degree.trim(),
      fieldOfStudy: data.fieldOfStudy?.trim() || "",
      period: data.period.trim(),
      location: data.location.trim(),
      type: data.type?.trim() || "Degree",
      grade: data.grade?.trim() || "",
      description: data.description.trim(),
      highlights: (data.highlights || []).map((h) => h.trim()).filter(Boolean),
      skills: data.skills || [],
      status: data.status || "published",
      order,
    })

    return JSON.parse(JSON.stringify(created))
  }

  async update(id: string, data: EducationInput) {
    await dbConnect()

    const updatePayload: Record<string, any> = {
      institution: data.institution.trim(),
      degree: data.degree.trim(),
      fieldOfStudy: data.fieldOfStudy?.trim() || "",
      period: data.period.trim(),
      location: data.location.trim(),
      type: data.type?.trim() || "Degree",
      grade: data.grade?.trim() || "",
      description: data.description.trim(),
      highlights: (data.highlights || []).map((h) => h.trim()).filter(Boolean),
      skills: data.skills || [],
    }

    if (data.status !== undefined) {
      updatePayload.status = data.status
    }

    if (data.order !== undefined) {
      updatePayload.order = Number(data.order)
    }

    const updated = await Education.findByIdAndUpdate(id, updatePayload, {
      returnDocument: "after",
      runValidators: true,
    }).lean()

    if (!updated) {
      throw new Error(`Education record with ID ${id} not found`)
    }

    return JSON.parse(JSON.stringify(updated))
  }

  async delete(id: string) {
    await dbConnect()
    const deleted = await Education.findByIdAndDelete(id).lean()
    if (!deleted) {
      throw new Error(`Education record with ID ${id} not found`)
    }
    return JSON.parse(JSON.stringify(deleted))
  }

  async toggleStatus(id: string) {
    await dbConnect()
    const doc = await Education.findById(id)
    if (!doc) {
      throw new Error(`Education record with ID ${id} not found`)
    }
    doc.status = doc.status === "draft" ? "published" : "draft"
    await doc.save()
    return JSON.parse(JSON.stringify(doc))
  }

  async reorder(items: { id: string; order: number }[]) {
    await dbConnect()

    const ops = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } },
      },
    }))

    await Education.bulkWrite(ops)
    return { success: true }
  }
}

export const educationService = new EducationService()
