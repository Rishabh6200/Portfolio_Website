import { db } from "@/prisma/db"
import { DEFAULT_PROFILE, type ProfileData, type ProfileSocials, type ProfileStatItem } from "../schema"

class ProfileQueries {
   async getProfile(): Promise<ProfileData> {
      try {
         const record = await db.orm.public.Profile.first()

         if (!record) {
            return { ...DEFAULT_PROFILE }
         }

         let socials: ProfileSocials = DEFAULT_PROFILE.socials
         if (record.socials) {
            socials = typeof record.socials === "string" 
               ? JSON.parse(record.socials) 
               : (record.socials as unknown as ProfileSocials)
         }

         let stats: ProfileStatItem[] = DEFAULT_PROFILE.stats
         if (record.stats) {
            stats = typeof record.stats === "string"
               ? JSON.parse(record.stats)
               : (record.stats as unknown as ProfileStatItem[])
         }

         return {
            id: record.id,
            name: record.name || DEFAULT_PROFILE.name,
            role: record.role || DEFAULT_PROFILE.role,
            tagline: record.tagline ?? DEFAULT_PROFILE.tagline,
            bio: record.bio ?? DEFAULT_PROFILE.bio,
            status: record.status || DEFAULT_PROFILE.status,
            location: record.location ?? DEFAULT_PROFILE.location,
            timezone: record.timezone ?? DEFAULT_PROFILE.timezone,
            email: record.email || DEFAULT_PROFILE.email,
            socials,
            stats,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
         }
      } catch (error) {
         console.error("ProfileQueries.getProfile error, returning default data:", error)
         return { ...DEFAULT_PROFILE }
      }
   }
}

export const profileQueries = new ProfileQueries()
