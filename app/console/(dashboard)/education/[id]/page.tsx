import { notFound } from "next/navigation"
import AdminPageHeader from "@/components/admin/common/admin-page-header"
import EducationForm from "@/features/education/components/form"
import { educationQueries } from "@/features/education/db/queries"
import { skillQueries } from "@/features/skills/db/queries"

interface EditEducationPageProps {
   params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

const EditEducationPage = async ({ params }: EditEducationPageProps) => {
   const { id } = await params

   const [education, availableSkills] = await Promise.all([
      educationQueries.getEducationById(id),
      skillQueries.getSkills(),
   ])

   if (!education) {
      notFound()
   }

   return (
      <div className="w-full space-y-6">
         <AdminPageHeader
            title={`Edit Qualification: ${education.degree}`}
            description={`Update institution, major, highlights, and competencies for ${education.institution}.`}
         />

         <div className="mt-4">
            <EducationForm
               initialData={education}
               isEditing={true}
               availableSkills={availableSkills}
            />
         </div>
      </div>
   )
}

export default EditEducationPage
