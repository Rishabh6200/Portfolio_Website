import { db } from "@/prisma/db"
import { IEducationStats } from "../types/stats.type"

export interface EducationSkillItem {
   id: string
   name: string
}

export interface EducationItem {
   id: string
   institution: string
   degree: string
   fieldOfStudy: string
   period: string
   location: string
   type: string
   grade: string
   description: string
   highlights: readonly string[]
   status: string
   order: number
   skills: EducationSkillItem[]
}

class EducationQueries {
   async getStat(): Promise<IEducationStats> {
      const allEducation = await db.orm.public.Education
         .select("status", "type")
         .all()

      const total = allEducation.length
      let published = 0
      let degrees = 0
      let certifications = 0

      for (const item of allEducation) {
         if (item.status === "published") {
            published++
         }
         const lowerType = (item.type || "").toLowerCase()
         if (lowerType.includes("degree")) {
            degrees++
         } else if (lowerType.includes("cert")) {
            certifications++
         }
      }

      return {
         total,
         published,
         degrees,
         certifications,
      }
   }

   async getEducations(): Promise<EducationItem[]> {
      const data = await db.orm.public.Education
         .orderBy((e) => e.order.asc())
         .select(
            "id",
            "institution",
            "degree",
            "fieldOfStudy",
            "period",
            "location",
            "type",
            "grade",
            "description",
            "highlights",
            "status",
            "order"
         )
         .include("skills", (es) =>
            es.include("skill", (s) => s.select("id", "name"))
         )
         .all()

      return data.map((edu) => ({
         ...edu,
         skills: edu.skills.flatMap((es) =>
            es.skill ? [{ id: es.skill.id, name: es.skill.name }] : []
         ),
      }))
   }

   async getEducationById(id: string) {
      const education = await db.orm.public.Education
         .where({ id })
         .include("skills", (es) =>
            es.include("skill", (s) => s.select("id", "name"))
         )
         .first()

      if (!education) return null

      return {
         ...education,
         skillIds: education.skills.map((es) => es.skillId),
      }
   }
}

export const educationQueries = new EducationQueries()
