import { notFound } from "next/navigation"
import { categoryService } from "@/services"
import { CategoryForm } from "../_components/category-form"

interface PageProps {
  params: Promise<{ id: string }>
}

export const dynamic = "force-dynamic"

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let category: any = null

  try {
    category = await categoryService.getById(id)
  } catch (err) {
    console.error("Error finding category by id:", err)
  }

  if (!category) {
    notFound()
  }

  return (
    <div className="w-full space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Edit: {category.name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Modify technical classification details, display ordering, and theme accents.
        </p>
      </div>

      <CategoryForm initialData={category} isEditing={true} />
    </div>
  )
}
