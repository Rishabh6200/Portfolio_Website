"use server"

import { revalidatePath } from "next/cache"
import { profileService, type ProfileData } from "@/services"
import { isAdminAuthenticated } from "@/lib/auth/session"

export async function updateProfileAction(data: Partial<ProfileData>) {
  try {
    if (!(await isAdminAuthenticated())) {
      return { success: false, error: "Unauthorized. Please log in to perform this action." }
    }

    if (!data.name?.trim()) {
      return { success: false, error: "Name is required." }
    }

    if (!data.role?.trim()) {
      return { success: false, error: "Role title is required." }
    }

    const updated = await profileService.updateProfile({
      name: data.name.trim(),
      role: data.role.trim(),
      tagline: data.tagline?.trim() || "",
      bio: data.bio?.trim() || "",
      status: data.status?.trim() || "Open for Work",
      location: data.location?.trim() || "",
      timezone: data.timezone?.trim() || "Asia/Kolkata",
      email: data.email?.trim() || "",
      socials: {
        github: data.socials?.github?.trim() || "",
        linkedin: data.socials?.linkedin?.trim() || "",
        twitter: data.socials?.twitter?.trim() || "",
        cal: data.socials?.cal?.trim() || "",
        email: data.socials?.email?.trim() || data.email?.trim() || "",
      },
      stats: (data.stats || []).map((s) => ({
        label: s.label.trim(),
        value: s.value.trim(),
        subtext: s.subtext?.trim() || "",
      })),
    })

    revalidatePath("/")
    revalidatePath("/admin/profile")
    revalidatePath("/admin", "layout")

    return { success: true, profile: updated }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update profile"
    return { success: false, error: message }
  }
}
