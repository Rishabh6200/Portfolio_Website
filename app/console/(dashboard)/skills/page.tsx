import AdminPageHeader from "@/components/admin/common/admin-page-header";
import { categoryQueries } from "@/features/categories/db/queries";
import { skillQueries } from "@/features/skills/db/queries";
import SkillTable from "@/features/skills/components/table";
import { SkillTabs } from "@/features/skills/components/tabs";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface PageProps {
   searchParams: Promise<{ c?: string; category?: string }>;
}

export const dynamic = "force-dynamic";

const Page = async ({ searchParams }: PageProps) => {
   const resolvedParams = await searchParams;
   const categoryQuery = resolvedParams?.c || resolvedParams?.category;

   const [categories, counts] = await Promise.all([
      categoryQueries.getCategories(),
      skillQueries.getCategoryCounts(),
   ]);

   if (categories.length === 0) {
      return (
         <div className="w-full space-y-6">
            <AdminPageHeader
               title="Skills & Competencies"
               description="Manage production technologies, frameworks, and tools bound to technical categories."
            />
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 px-4 text-center">
               <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <Sparkles className="h-6 w-6" />
               </div>
               <div className="space-y-1 max-w-sm">
                  <h3 className="text-base font-semibold text-foreground">
                     No categories found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                     Skills must belong to a technical category. Create your first category before adding skills.
                  </p>
               </div>
               <Link
                  href="/console/categories/new"
                  className={buttonVariants({ size: "default", className: "mt-2" })}
               >
                  Create Category
               </Link>
            </div>
         </div>
      );
   }

   const activeCategory = categories.find((c) => c.id === categoryQuery || c.slug === categoryQuery) || categories[0];

   const skillsPromise = skillQueries.getSkills(activeCategory?.id);

   return (
      <div className="w-full space-y-6">
         <AdminPageHeader
            title="Skills & Competencies"
            description="Manage production technologies, frameworks, and tools bound to technical categories."
            actionLabel="Add Skill"
            actionHref={
               activeCategory
                  ? `/console/skills/new?categoryId=${activeCategory.id}`
                  : "/console/skills/new"
            }
         />
         <div className="space-y-4">
            <SkillTabs
               categories={categories}
               counts={counts}
               activeCategoryId={activeCategory?.id || ""}
            />
            <SkillTable
               key={activeCategory?.id || "default"}
               skills={skillsPromise}
               activeCategoryId={activeCategory?.id}
            />
         </div>
      </div>
   );
};

export default Page;