import { dbConnect } from "@/lib/db/connect"
import { Project } from "@/lib/db/models"

export interface ProjectInput {
  title: string
  slug?: string
  tagline: string
  description: string
  category: string
  role: string
  timeline?: string
  accentColor?: string
  coverImage?: string
  architectureDiagram?: string
  technologies: string[]
  highlights: string[]
  architectureOverview?: string
  challenge?: string
  solution?: string
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
    const docs = await Project.find().sort({ order: 1, createdAt: -1 }).lean()
    return JSON.parse(JSON.stringify(docs))
  }

  async getById(id: string) {
    await dbConnect()
    const doc = await Project.findById(id).lean()
    if (!doc) return null
    return JSON.parse(JSON.stringify(doc))
  }

  async getBySlugWithContext(slug: string) {
    let projectList: any[] = []

    try {
      await dbConnect()
      const docs = await Project.find({ status: "published" })
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

    const created = await Project.create({
      ...data,
      slug: finalSlug,
      featured: Boolean(data.featured),
      status: data.status || "published",
      order: Number(data.order) || 0,
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

    const updated = await Project.findByIdAndUpdate(
      id,
      {
        ...data,
        slug: finalSlug,
        featured: Boolean(data.featured),
        status: data.status || "published",
        order: Number(data.order) || 0,
      },
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
}

export const projectService = new ProjectService()
