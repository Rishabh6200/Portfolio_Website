import AdminPageHeader from "@/components/admin/common/admin-page-header"
import ExperienceForm from "@/features/experience/components/form"
import { skillQueries } from "@/features/skills/db/queries"

export const dynamic = "force-dynamic"

const Page = async () => {
   const availableSkills = await skillQueries.getSkills()

   return (
      <div className="w-full space-y-6">
         <AdminPageHeader
            title="New Work Experience"
            description="Add a career milestone, company, job responsibilities, and achievements."
         />

         <div className="mt-4">
            <ExperienceForm availableSkills={availableSkills} />
         </div>
      </div>
   )
}

export default Page
