import { notFound } from "next/navigation"
import AdminPageHeader from "@/components/admin/common/admin-page-header"
import ExperienceForm from "@/features/experience/components/form"
import { experienceQueries } from "@/features/experience/db/queries"
import { skillQueries } from "@/features/skills/db/queries"

interface EditExperiencePageProps {
   params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

const EditExperiencePage = async ({ params }: EditExperiencePageProps) => {
   const { id } = await params

   const [experience, availableSkills] = await Promise.all([
      experienceQueries.getExperienceById(id),
      skillQueries.getSkills(),
   ])

   if (!experience) {
      notFound()
   }

   return (
      <div className="w-full space-y-6">
         <AdminPageHeader
            title={`Edit Experience: ${experience.role}`}
            description={`Update role responsibilities, deliverables, and technologies at ${experience.company}.`}
         />

         <div className="mt-4">
            <ExperienceForm
               initialData={experience}
               isEditing={true}
               availableSkills={availableSkills}
            />
         </div>
      </div>
   )
}

export default EditExperiencePage
