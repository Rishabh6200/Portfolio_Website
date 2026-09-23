import { db } from "@/prisma/db"
import { IExperienceStats } from "../types/stats.type"

export interface ExperienceSkillItem {
   id: string
   name: string
}

export interface ExperienceItem {
   id: string
   company: string
   role: string
   period: string
   location: string
   locationType: string
   type: string
   description: string
   achievements: readonly string[]
   order: number
   skills: ExperienceSkillItem[]
}

class ExperienceQueries {
   async getStat(): Promise<IExperienceStats> {
      const allExperiences = await db.orm.public.Experience
         .select("locationType", "type", "period")
         .all()

      const total = allExperiences.length
      let current = 0
      let remote = 0
      let fullTime = 0

      for (const item of allExperiences) {
         if (item.period && item.period.toLowerCase().includes("present")) {
            current++
         }
         if (item.locationType === "Remote") {
            remote++
         }
         if (item.type === "Full-Time") {
            fullTime++
         }
      }

      return {
         total,
         current,
         remote,
         fullTime,
      }
   }

   async getExperiences(): Promise<ExperienceItem[]> {
      const data = await db.orm.public.Experience
         .orderBy((e) => e.order.asc())
         .select(
            "id",
            "company",
            "role",
            "period",
            "location",
            "locationType",
            "type",
            "description",
            "achievements",
            "order"
         )
         .include("skills", (es) =>
            es.include("skill", (s) => s.select("id", "name"))
         )
         .all()

      return data.map((exp) => ({
         ...exp,
         skills: exp.skills.flatMap((es) =>
            es.skill ? [{ id: es.skill.id, name: es.skill.name }] : []
         ),
      }))
   }

   async getExperienceById(id: string) {
      const experience = await db.orm.public.Experience
         .where({ id })
         .include("skills", (es) =>
            es.include("skill", (s) => s.select("id", "name"))
         )
         .first()

      if (!experience) return null

      return {
         ...experience,
         skillIds: experience.skills.map((es) => es.skillId),
      }
   }
}

export const experienceQueries = new ExperienceQueries()
