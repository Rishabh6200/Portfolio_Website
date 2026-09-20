import AdminPageHeader from '@/components/admin/common/admin-page-header';
import Stats from '@/features/project/components/stats';
import ProjectTable from '@/features/project/components/table';
import { projectQueries } from '@/features/project/db/queries';

const Page = () => {
   const projectsPromise = projectQueries.getProjects();

   return (
      <>
         <AdminPageHeader
            title="Projects"
            description="Manage your project case studies and media assets."
            actionLabel="Add Project"
            actionHref="/console/projects/new"
            actionSize="sm"
         />
         <div className="my-4">
            <Stats />
         </div>
         <ProjectTable projects={projectsPromise} />
      </>
   )
}

export default Page;