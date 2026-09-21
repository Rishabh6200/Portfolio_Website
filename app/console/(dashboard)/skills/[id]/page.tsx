import { skillQueries } from "@/features/skills/db/queries";
import { categoryQueries } from "@/features/categories/db/queries";
import SkillForm from "@/features/skills/components/form";
import { Suspense } from "react";
import Loading from "./loading";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

interface PageProps {
   params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

const Page = async ({ params }: PageProps) => {
   const { id } = await params;

   const skillPromise = skillQueries.getSkillByID(id);
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
                  Edit Skill & Competency
               </h1>
               <p className="text-sm text-muted-foreground mt-1">
                  Update skill technology details, proficiency level, parent category, or highlight status.
               </p>
            </div>
         </div>
         <Suspense fallback={<Loading />}>
            <SkillForm
               initialData={skillPromise}
               categories={categoriesPromise}
               isEditing={true}
            />
         </Suspense>
      </div>
   );
};

export default Page;
