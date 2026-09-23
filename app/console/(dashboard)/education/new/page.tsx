import AdminPageHeader from "@/components/admin/common/admin-page-header"
import EducationForm from "@/features/education/components/form"
import { skillQueries } from "@/features/skills/db/queries"

export const dynamic = "force-dynamic"

const Page = async () => {
   const availableSkills = await skillQueries.getSkills()

   return (
      <div className="w-full space-y-6">
         <AdminPageHeader
            title="New Qualification"
            description="Add a degree, professional certification, or course specialization."
         />

         <div className="mt-4">
            <EducationForm availableSkills={availableSkills} />
         </div>
      </div>
   )
}

export default Page
