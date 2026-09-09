import { CategoryForm } from "../_components/category-form"

export default function NewCategoryPage() {
  return (
    <div className="w-full space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          New Category
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create a new technical domain or engineering classification for portfolio systems and skills.
        </p>
      </div>

      <CategoryForm isEditing={false} />
    </div>
  )
}
