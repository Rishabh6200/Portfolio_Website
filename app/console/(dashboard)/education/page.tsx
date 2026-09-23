import AdminPageHeader from "@/components/admin/common/admin-page-header"
import Stats from "@/features/education/components/stats"
import EducationTable from "@/features/education/components/table"
import { educationQueries } from "@/features/education/db/queries"

export const dynamic = "force-dynamic"

const Page = () => {
   const educationPromise = educationQueries.getEducations()
   const statsPromise = educationQueries.getStat()

   return (
      <div className="w-full space-y-6">
         <AdminPageHeader
            title="Education & Certifications"
            description="Manage your academic degrees, professional certifications, and learning milestones."
            actionLabel="Add Qualification"
            actionHref="/console/education/new"
            actionSize="sm"
         />
         <div className="my-4">
            <Stats promise={statsPromise} />
         </div>
         <EducationTable educationList={educationPromise} />
      </div>
   )
}

export default Page
