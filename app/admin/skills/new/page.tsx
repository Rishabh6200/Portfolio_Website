import Link from "next/link"
import { categoryService } from "@/services"
import { SkillForm } from "../_components/skill-form"
import { buttonVariants } from "@/components/ui/button"
import { Layers, Plus } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function NewSkillPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let categories: any[] = []

  try {
    categories = await categoryService.getAll()
  } catch (err) {
    console.error("Error fetching categories for new skill:", err)
  }

  return (
    <div className="w-full space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          New Skill
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add a language, framework, database, or cloud infrastructure competency to your portfolio.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center space-y-4 bg-card/50">
          <div className="inline-flex p-3 rounded-xl bg-muted text-muted-foreground">
            <Layers className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-semibold text-foreground">
              No categories found
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Skills must belong to a parent domain category. Please create a category first before adding skills.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/admin/categories/new"
              className={buttonVariants({ size: "sm" })}
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create First Category</span>
            </Link>
          </div>
        </div>
      ) : (
        <SkillForm categories={categories} isEditing={false} />
      )}
    </div>
  )
}
