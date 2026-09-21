import CategoryForm from "@/features/categories/components/form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NewCategoryPage() {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3.5 pb-4 border-b border-border">
        <Link
          href="/console/categories"
          className={buttonVariants({ variant: "outline", size: "icon", className: "size-9 shrink-0" })}
          title="Back to Categories"
        >
          <ArrowLeft className="size-4" />
          <span className="sr-only">Back to Categories</span>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            New Category
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create a new technical domain or development classification for portfolio systems and skills.
          </p>
        </div>
      </div>

      <CategoryForm />
    </div>
  )
}
