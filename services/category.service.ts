import { dbConnect } from "@/lib/db/connect"
import { Category, Skill, Project } from "@/lib/db/models"

export interface CategoryInput {
  name: string
  slug?: string
  description?: string
  icon?: string
  color?: string
  order?: number
}

export class CategoryService {
  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  async getAll() {
    await dbConnect()
    const docs = await Category.find().sort({ order: 1, createdAt: 1 }).lean()
    return JSON.parse(JSON.stringify(docs))
  }

  async getById(id: string) {
    await dbConnect()
    const doc = await Category.findById(id).lean()
    if (!doc) return null
    return JSON.parse(JSON.stringify(doc))
  }

  async getBySlug(slug: string) {
    await dbConnect()
    const doc = await Category.findOne({ slug }).lean()
    if (!doc) return null
    return JSON.parse(JSON.stringify(doc))
  }

  async create(data: CategoryInput) {
    await dbConnect()

    const name = data.name.trim()
    const slug = data.slug?.trim() ? this.slugify(data.slug) : this.slugify(name)

    const existingName = await Category.findOne({ name })
    if (existingName) {
      throw new Error(`A category with name "${name}" already exists.`)
    }

    const existingSlug = await Category.findOne({ slug })
    if (existingSlug) {
      throw new Error(`A category with slug "${slug}" already exists.`)
    }

    const newCategory = await Category.create({
      name,
      slug,
      description: data.description?.trim() || "",
      icon: data.icon || "Layers",
      color: data.color || "#6366f1",
      order: Number(data.order) || 0,
    })

    return JSON.parse(JSON.stringify(newCategory))
  }

  async update(id: string, data: CategoryInput) {
    await dbConnect()

    const currentCategory = await Category.findById(id)
    if (!currentCategory) {
      throw new Error("Category not found")
    }

    const name = data.name.trim()
    const slug = data.slug?.trim() ? this.slugify(data.slug) : this.slugify(name)

    if (name !== currentCategory.name) {
      const duplicateName = await Category.findOne({ name, _id: { $ne: id } })
      if (duplicateName) {
        throw new Error(`Another category with name "${name}" already exists.`)
      }
    }

    if (slug !== currentCategory.slug) {
      const duplicateSlug = await Category.findOne({ slug, _id: { $ne: id } })
      if (duplicateSlug) {
        throw new Error(`Another category with slug "${slug}" already exists.`)
      }
    }

    const oldName = currentCategory.name
    currentCategory.name = name
    currentCategory.slug = slug
    currentCategory.description = data.description?.trim() || ""
    currentCategory.icon = data.icon || "Layers"
    currentCategory.color = data.color || "#6366f1"
    currentCategory.order = Number(data.order) || 0

    await currentCategory.save()

    // Cascade name updates to associated projects if category name changed
    if (oldName !== name) {
      await Project.updateMany({ category: oldName }, { category: name })
    }

    return JSON.parse(JSON.stringify(currentCategory))
  }

  async delete(id: string, options?: { cascade?: boolean }) {
    await dbConnect()

    const category = await Category.findById(id)
    if (!category) {
      throw new Error("Category not found")
    }

    // Check project reference
    const projectCount = await Project.countDocuments({ category: category.name })
    if (projectCount > 0) {
      throw new Error(
        `Cannot delete "${category.name}" because it is currently assigned to ${projectCount} project(s). Reassign or delete those projects first.`
      )
    }

    // Check skill reference
    const skillCount = await Skill.countDocuments({ categoryId: id })
    if (skillCount > 0) {
      if (options?.cascade) {
        await Skill.deleteMany({ categoryId: id })
      } else {
        throw new Error(
          `Cannot delete "${category.name}" because it currently contains ${skillCount} skill(s). Please reassign or delete these skills first, or enable cascade deletion.`
        )
      }
    }

    await Category.findByIdAndDelete(id)
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
      await Category.bulkWrite(bulkOps)
    }
    return { success: true }
  }
}

export const categoryService = new CategoryService()
