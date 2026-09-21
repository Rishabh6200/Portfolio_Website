import AdminPageHeader from '@/components/admin/common/admin-page-header';
import CategoryTable from '@/features/categories/components/table';
import { categoryQueries } from '@/features/categories/db/queries';

const Page = () => {
   const categoriesPromise = categoryQueries.getCategories();

   return (
      <>
         <AdminPageHeader
            title="Categories"
            description="Manage your project categories."
            actionLabel='Add Category'
            actionHref='/console/categories/new'
         />
         <div className="mt-5">
            <CategoryTable categories={categoriesPromise} />
         </div>
      </>
   )
}

export default Page;