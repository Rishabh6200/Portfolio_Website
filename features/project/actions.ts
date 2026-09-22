"use server";

import { revalidatePath } from "next/cache"
import { isAdminAuthenticated } from "@/lib/auth/session"
import { db } from "@/prisma/db"
import { projectSchema, type ProjectFormValues } from "./schema"

export async function createProjectAction(data: ProjectFormValues) {
    try {
        if (!(await isAdminAuthenticated())) {
            return { success: false, error: "Unauthorized. Please log in to perform this action." }
        }

        const parsed = projectSchema.safeParse(data)
        if (!parsed.success) {
            return {
                success: false,
                error: parsed.error.issues[0]?.message || "Invalid project data",
            }
        }

        const cleanSlug = data.slug.trim().toLowerCase()

        // Check if slug already exists
        const existingSlug = await db.orm.public.Project
            .where({ slug: cleanSlug })
            .select("id")
            .first()

        if (existingSlug) {
            return {
                success: false,
                error: `A project with the URL slug "/projects/${cleanSlug}" already exists. Please choose a different slug.`,
            }
        }

        // Get next order
        const lastProject = await db.orm.public.Project
            .orderBy((p) => p.order.desc())
            .select("order")
            .first()

        const nextOrder = (lastProject?.order ?? -1) + 1

        const project = await db.orm.public.Project.create({
            title: data.title.trim(),
            slug: cleanSlug,
            tagline: data.tagline.trim(),
            description: data.description.trim(),
            role: data.role.trim(),
            logo: data.logo || "",
            images: data.images || [],
            liveUrl: data.liveUrl || "",
            githubUrl: data.githubUrl || "",
            featured: Boolean(data.featured),
            status: data.status === "published" ? "PUBLISHED" : "DRAFT",
            order: nextOrder,
        })

        // Insert selected skills
        if (data.skillIds && data.skillIds.length > 0) {
            for (const skillId of data.skillIds) {
                await db.orm.public.ProjectSkill.create({
                    projectId: project.id,
                    skillId: skillId,
                })
            }
        }

        revalidatePath("/console/projects")
        revalidatePath("/projects")
        revalidatePath("/")

        return { success: true, project }
    } catch (err: unknown) {
        console.error("Error in createProjectAction:", err)
        const message = err instanceof Error ? err.message : "Failed to create project"
        return { success: false, error: message }
    }
}

export async function updateProjectAction(id: string, data: ProjectFormValues) {
    try {
        if (!(await isAdminAuthenticated())) {
            return { success: false, error: "Unauthorized. Please log in to perform this action." }
        }

        const parsed = projectSchema.safeParse(data)
        if (!parsed.success) {
            return {
                success: false,
                error: parsed.error.issues[0]?.message || "Invalid project data",
            }
        }

        const existingProject = await db.orm.public.Project
            .where({ id })
            .first()

        if (!existingProject) {
            return { success: false, error: "Project not found." }
        }

        const cleanSlug = data.slug.trim().toLowerCase()

        // Check if slug already exists for another project
        const slugMatch = await db.orm.public.Project
            .where({ slug: cleanSlug })
            .select("id")
            .first()

        if (slugMatch && slugMatch.id !== id) {
            return {
                success: false,
                error: `A project with the URL slug "/projects/${cleanSlug}" already exists. Please choose a different slug.`,
            }
        }

        const updated = await db.orm.public.Project
            .where({ id })
            .update({
                title: data.title.trim(),
                slug: cleanSlug,
                tagline: data.tagline.trim(),
                description: data.description.trim(),
                role: data.role.trim(),
                logo: data.logo || "",
                images: data.images || [],
                liveUrl: data.liveUrl || "",
                githubUrl: data.githubUrl || "",
                featured: Boolean(data.featured),
                status: data.status === "published" ? "PUBLISHED" : "DRAFT",
            })

        // Sync skills
        await db.orm.public.ProjectSkill
            .where({ projectId: id })
            .delete()

        if (data.skillIds && data.skillIds.length > 0) {
            for (const skillId of data.skillIds) {
                await db.orm.public.ProjectSkill.create({
                    projectId: id,
                    skillId: skillId,
                })
            }
        }

        revalidatePath("/console/projects")
        revalidatePath("/projects")
        revalidatePath("/")

        return { success: true, project: updated }
    } catch (err: unknown) {
        console.error("Error in updateProjectAction:", err)
        const message = err instanceof Error ? err.message : "Failed to update project"
        return { success: false, error: message }
    }
}

export async function toggleProjectStatusAction(id: string, _currentStatus?: "published" | "draft") {
    try {
        if (!(await isAdminAuthenticated())) {
            return { success: false, error: "Unauthorized. Please log in to perform this action." }
        }

        const currentStatus = (await db.orm.public.Project
            .where({ id: id })
            .select('status')
            .first())
            ?.status;

        if (currentStatus == null) {
            return { success: false, error: "Project not found." }
        }

        const updated = await db.orm.public.Project
            .where({ id: id })
            .update({
                status: currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
            });

        if (updated == null) {
            return { success: false, error: "Failed to update project." }
        }

        revalidatePath("/console/projects")
        revalidatePath("/projects")
        revalidatePath("/")

        return { success: true, status: updated.status }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to toggle project status"
        return { success: false, error: message }
    }
}

export async function reorderProjectsAction(projectIds: string[]) {
    try {
        if (!(await isAdminAuthenticated())) {
            return { success: false, error: "Unauthorized. Please log in to perform this action." }
        }

        if (!projectIds || projectIds.length === 0) {
            return { success: true }
        }

        await db.transaction(async (tx) => {
            for (let i = 0; i < projectIds.length; i++) {
                await tx.orm.public.Project.where({ id: projectIds[i] }).update({
                    order: i + 1,
                })
            }
        })

        revalidatePath("/console/projects")
        revalidatePath("/projects")
        revalidatePath("/")
        return { success: true }
    } catch (error: unknown) {
        console.error("Error in reorderProjectsAction:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to reorder projects",
        }
    }
}
