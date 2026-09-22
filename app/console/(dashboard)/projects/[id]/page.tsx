import { notFound } from 'next/navigation'
import AdminPageHeader from '@/components/admin/common/admin-page-header'
import ProjectForm from '@/features/project/components/form'
import { projectQueries } from '@/features/project/db/queries'
import { skillQueries } from '@/features/skills/db/queries'

interface EditProjectPageProps {
   params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

const EditProjectPage = async ({ params }: EditProjectPageProps) => {
   const { id } = await params

   const [project, availableSkills] = await Promise.all([
      projectQueries.getProjectById(id),
      skillQueries.getSkills(),
   ])

   if (!project) {
      notFound()
   }

   return (
      <>
         <AdminPageHeader
            title={`Edit Project: ${project.title}`}
            description="Update project details, showcase gallery, skills, and links."
         />

         <div className="mt-4">
            <ProjectForm
               initialData={project}
               isEditing={true}
               availableSkills={availableSkills}
            />
         </div>
      </>
   )
}

export default EditProjectPage
