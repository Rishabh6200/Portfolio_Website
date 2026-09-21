import AdminPageHeader from '@/components/admin/common/admin-page-header';
import ProjectForm from '@/features/project/components/form';

const Page = () => {
   return (
      <>
         <AdminPageHeader
            title="New Project"
            description="Create a new project"
         />

         <div className="mt-4">
            <ProjectForm />
         </div>
      </>
   )
}

export default Page;