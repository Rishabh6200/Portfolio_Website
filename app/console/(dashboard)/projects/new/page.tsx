import AdminPageHeader from '@/components/admin/common/admin-page-header';
import ProjectForm from '@/features/project/components/form';
import { skillQueries } from '@/features/skills/db/queries';

const Page = async () => {
   const availableSkills = await skillQueries.getSkills();

   return (
      <>
         <AdminPageHeader
            title="New Project"
            description="Create a new project"
         />

         <div className="mt-4">
            <ProjectForm availableSkills={availableSkills} />
         </div>
      </>
   )
}

export default Page;