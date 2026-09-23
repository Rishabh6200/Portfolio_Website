import AdminPageHeader from "@/components/admin/common/admin-page-header"
import Stats from "@/features/experience/components/stats"
import ExperienceTable from "@/features/experience/components/table"
import { experienceQueries } from "@/features/experience/db/queries"

export const dynamic = "force-dynamic"

const Page = () => {
   const experiencesPromise = experienceQueries.getExperiences()
   const statsPromise = experienceQueries.getStat()

   return (
      <div className="w-full space-y-6">
         <AdminPageHeader
            title="Work Experience"
            description="Manage your career milestones, employment roles, and technical achievements."
            actionLabel="Add Experience"
            actionHref="/console/experience/new"
            actionSize="sm"
         />
         <div className="my-4">
            <Stats promise={statsPromise} />
         </div>
         <ExperienceTable experiences={experiencesPromise} />
      </div>
   )
}

export default Page
