import { categoryQueries } from "@/features/categories/db/queries"
import CategoryForm from "@/features/categories/components/form"
import { Suspense } from "react"
import Loading from "./loading"

interface PageProps {
   params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

const Page = async ({ params }: PageProps) => {
   const { id } = await params

   const categoryPromise = categoryQueries.getCategoryByID(id)

   return (
      <div className="w-full space-y-6">
         <div className="pb-4 border-b border-border">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
               Edit Category
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
               Update category details, icon, and accent color.
            </p>
         </div>
         <Suspense fallback={<Loading />}>
            <CategoryForm initialData={categoryPromise} isEditing={true} />
         </Suspense>
      </div>
   )
}

export default Page