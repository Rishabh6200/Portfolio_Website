import { dbConnect } from "@/lib/db/connect"
import { Profile, type IProfile } from "@/lib/db/models"
import { revalidatePath } from "next/cache"

import { DEFAULT_PROFILE, type ProfileData } from "@/lib/constants/profile"

export { DEFAULT_PROFILE, type ProfileData } from "@/lib/constants/profile"
export type { ProfileStat, ProfileSocials } from "@/lib/constants/profile"


export class ProfileService {
  async getProfile(): Promise<ProfileData> {
    try {
      await dbConnect()
      let doc = await Profile.findOne().lean<IProfile>()

      if (!doc) {
        // Auto-seed with default portfolio personal data on first read
        const initial = await Profile.create({
          ...DEFAULT_PROFILE,
        })
        doc = initial.toObject()
      }

      if (doc) {
        return JSON.parse(JSON.stringify(doc))
      }
    } catch (error) {
      console.error("ProfileService.getProfile error, returning default data:", error)
    }

    // Safe fallback to default profile constants
    return { ...DEFAULT_PROFILE }
  }

  async updateProfile(data: Partial<ProfileData>): Promise<ProfileData> {
    await dbConnect()

    const updated = await Profile.findOneAndUpdate(
      {},
      { $set: data },
      { returnDocument: "after", upsert: true, runValidators: true }
    ).lean<IProfile>()

    revalidatePath("/")
    revalidatePath("/admin/profile")

    return JSON.parse(JSON.stringify(updated))
  }
}

export const profileService = new ProfileService()
