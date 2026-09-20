"use server";

import { revalidatePath } from "next/cache"
import { isAdminAuthenticated } from "@/lib/auth/session"
import { db } from "@/prisma/db"

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
