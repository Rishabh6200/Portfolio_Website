import { dbConnect } from "@/lib/db/connect"
import { Project } from "@/lib/db/models"
import { mediaService } from "./media.service"
import { getImageKitProjectFolder } from "@/lib/imagekit"
// Ensure Skill and Category models are registered in Mongoose for population
import "@/lib/db/models/category.model"
import "@/lib/db/models/skill.model"

export interface ProjectInput {
  title: string
  slug?: string
  tagline: string
  description: string
  role?: string
  skills?: string[]
  logo?: string
  images?: string[]
  liveUrl?: string
  githubUrl?: string
  featured?: boolean
  status?: "published" | "draft"
  order?: number
}

export class ProjectService {
  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  async getPublished() {
    try {
      await dbConnect()
      const docs = await Project.find({ status: "published" })
        .populate({
          path: "skills",
          select: "name level categoryId",
          strictPopulate: false,
          populate: { path: "categoryId", select: "name slug color", strictPopulate: false },
        })
        .sort({ order: 1, createdAt: -1 })
        .lean()
      if (docs && docs.length > 0) {
        return JSON.parse(JSON.stringify(docs))
      }
    } catch (err) {
      console.error("Error fetching published projects:", err)
    }

    return []
  }

  async getAllAdmin() {
    await dbConnect()
    const docs = await Project.find()
      .populate({
        path: "skills",
        select: "name level categoryId",
        strictPopulate: false,
        populate: { path: "categoryId", select: "name slug color", strictPopulate: false },
      })
      .sort({ order: 1, createdAt: -1 })
      .lean()
    return JSON.parse(JSON.stringify(docs))
  }

  async getById(id: string) {
    await dbConnect()
    const doc = await Project.findById(id)
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

  async getBySlugWithContext(slug: string) {
    let projectList: any[] = []

    try {
      await dbConnect()
      const docs = await Project.find({ status: "published" })
        .populate({
          path: "skills",
          select: "name level categoryId",
          strictPopulate: false,
          populate: { path: "categoryId", select: "name slug color", strictPopulate: false },
        })
        .sort({ order: 1, createdAt: -1 })
        .lean()
      if (docs && docs.length > 0) {
        projectList = JSON.parse(JSON.stringify(docs))
      }
    } catch (err) {
      console.error("Error finding project by slug:", err)
    }

    if (projectList.length === 0) {
      return null
    }

    const projectIndex = projectList.findIndex((p) => p.slug === slug)
    if (projectIndex === -1) {
      return null
    }

    return {
      project: projectList[projectIndex],
      prevProject: projectIndex > 0 ? projectList[projectIndex - 1] : null,
      nextProject: projectIndex < projectList.length - 1 ? projectList[projectIndex + 1] : null,
    }
  }

  async create(data: ProjectInput) {
    await dbConnect()

    const finalSlug = data.slug?.trim() ? this.slugify(data.slug) : this.slugify(data.title)

    const existing = await Project.findOne({ slug: finalSlug })
    if (existing) {
      throw new Error(`A project with slug "${finalSlug}" already exists. Please choose a different title or slug.`)
    }

    let order = data.order !== undefined ? Number(data.order) : NaN
    if (isNaN(order)) {
      const lastProject = await Project.findOne().sort({ order: -1 }).select("order").lean()
      order = lastProject && typeof lastProject.order === "number" ? lastProject.order + 1 : 0
    }

    const created = await Project.create({
      title: data.title.trim(),
      slug: finalSlug,
      tagline: data.tagline.trim(),
      description: data.description.trim(),
      role: data.role?.trim() || "Full-Stack Developer",
      skills: data.skills || [],
      logo: data.logo || "",
      images: data.images || [],
      liveUrl: data.liveUrl || "",
      githubUrl: data.githubUrl || "",
      featured: Boolean(data.featured),
      status: data.status || "published",
      order,
    })

    return JSON.parse(JSON.stringify(created))
  }

  async update(id: string, data: ProjectInput) {
    await dbConnect()

    const finalSlug = data.slug?.trim() ? this.slugify(data.slug) : this.slugify(data.title)

    const duplicate = await Project.findOne({ slug: finalSlug, _id: { $ne: id } })
    if (duplicate) {
      throw new Error(`Another project with slug "${finalSlug}" already exists.`)
    }

    const updatePayload: Record<string, any> = {
      title: data.title.trim(),
      slug: finalSlug,
      tagline: data.tagline.trim(),
      description: data.description.trim(),
      role: data.role?.trim() || "Full-Stack Developer",
      skills: data.skills || [],
      logo: data.logo || "",
      images: data.images || [],
      liveUrl: data.liveUrl || "",
      githubUrl: data.githubUrl || "",
      featured: Boolean(data.featured),
      status: data.status || "published",
    }
    if (data.order !== undefined) {
      updatePayload.order = Number(data.order)
    }

    const updated = await Project.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true }
    ).lean()

    if (!updated) {
      throw new Error("Project not found.")
    }

    return JSON.parse(JSON.stringify(updated))
  }

  async delete(id: string) {
    await dbConnect()

    const deleted = await Project.findByIdAndDelete(id)
    if (!deleted) {
      throw new Error("Project not found or already deleted.")
    }

    // Collect all media URLs to clean up from ImageKit
    const mediaUrlsToDelete: string[] = []
    if (deleted.logo) {
      mediaUrlsToDelete.push(deleted.logo)
    }
    if (Array.isArray(deleted.images)) {
      deleted.images.forEach((img: string) => {
        if (img) mediaUrlsToDelete.push(img)
      })
    }

    // 1. Delete the entire project folder in ImageKit if slug exists
    if (deleted.slug) {
      try {
        const folderPath = getImageKitProjectFolder(deleted.slug)
        await mediaService.deleteFolder(folderPath)
      } catch (err) {
        console.error(`Error deleting project folder from ImageKit:`, err)
      }
    }

    // 2. Fallback: Also purge any specific media URLs that were outside the slug folder
    if (mediaUrlsToDelete.length > 0) {
      try {
        await mediaService.deleteMultipleByUrls(mediaUrlsToDelete)
      } catch (err) {
        console.error("Error auto-deleting media from ImageKit during project deletion:", err)
      }
    }

    return { success: true }
  }

  async toggleStatus(id: string) {
    await dbConnect()

    const project = await Project.findById(id)
    if (!project) {
      throw new Error("Project not found.")
    }

    project.status = project.status === "published" ? "draft" : "published"
    await project.save()

    return JSON.parse(JSON.stringify(project))
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
      await Project.bulkWrite(bulkOps)
    }
    return { success: true }
  }
}

export const projectService = new ProjectService()
