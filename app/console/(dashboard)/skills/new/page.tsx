import { categoryQueries } from "@/features/categories/db/queries";
import SkillForm from "@/features/skills/components/form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface NewSkillPageProps {
   searchParams: Promise<{ categoryId?: string }>;
}

export const dynamic = "force-dynamic";

export default async function NewSkillPage({ searchParams }: NewSkillPageProps) {
   const resolvedParams = await searchParams;
   const categoriesPromise = categoryQueries.getCategories();

   return (
      <div className="w-full space-y-6">
         <div className="flex items-center gap-3.5 pb-4 border-b border-border">
            <Link
               href="/console/skills"
               className={buttonVariants({ variant: "outline", size: "icon", className: "size-9 shrink-0" })}
               title="Back to Skills"
            >
               <ArrowLeft className="size-4" />
               <span className="sr-only">Back to Skills</span>
            </Link>
            <div>
               <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  New Skill & Competency
               </h1>
               <p className="text-sm text-muted-foreground mt-1">
                  Add a technology, framework, or development tool bound to a parent category.
               </p>
            </div>
         </div>

         <SkillForm
            categories={categoriesPromise}
            defaultCategoryId={resolvedParams?.categoryId}
         />
      </div>
   );
}
