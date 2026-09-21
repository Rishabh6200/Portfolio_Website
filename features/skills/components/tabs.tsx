"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsIndicator } from "@/components/ui/tabs";
import { cn } from "cn";

export interface TabCategory {
   id: string;
   name: string;
   slug: string;
   color?: string;
}

interface SkillTabsProps {
   categories: TabCategory[];
   counts: Record<string, number>;
   activeCategoryId: string;
}

export function SkillTabs({
   categories,
   counts,
   activeCategoryId,
}: SkillTabsProps) {
   const router = useRouter();
   const searchParams = useSearchParams();
   const [isPending, startTransition] = useTransition();

   if (categories.length === 0) {
      return null;
   }

   const activeCategory =
      categories.find(
         (c) => c.id === activeCategoryId || c.slug === activeCategoryId
      ) || categories[0];

   const activeValue = activeCategory?.id || "";

   const handleValueChange = (val: string) => {
      const selectedCat = categories.find((c) => c.id === val);
      if (!selectedCat) return;

      const target = selectedCat.slug || selectedCat.id;
      startTransition(() => {
         const params = new URLSearchParams(searchParams.toString());
         params.delete("category");
         params.set("c", target);
         router.replace(`/console/skills?${params.toString()}`, { scroll: false });
      });
   };

   return (
      <div className="flex flex-wrap items-center gap-3">
         <Tabs
            value={activeValue}
            onValueChange={handleValueChange}
            className="w-auto"
         >
            <TabsList className="h-9 group-data-horizontal/tabs:h-9 max-w-full overflow-x-auto overflow-y-hidden scrollbar-none [&::-webkit-scrollbar]:hidden justify-start">
               {categories.map((cat) => {
                  const isActive = cat.id === activeValue;
                  const count = counts[cat.id] ?? 0;

                  return (
                     <TabsTrigger
                        key={cat.id}
                        value={cat.id}
                        className="cursor-pointer gap-2 px-3 text-xs sm:text-sm font-medium"
                     >
                        {cat.color && (
                           <span
                              className="size-2 rounded-full shrink-0"
                              style={{ backgroundColor: cat.color }}
                           />
                        )}
                        <span>{cat.name}</span>
                        <span
                           className={cn(
                              "text-[11px] font-mono px-1.5 py-0.2 rounded-full transition-colors",
                              isActive
                                 ? "bg-foreground/10 text-foreground font-medium"
                                 : "bg-muted-foreground/10 text-muted-foreground"
                           )}
                        >
                           {count}
                        </span>
                     </TabsTrigger>
                  );
               })}
               <TabsIndicator />
            </TabsList>
         </Tabs>

         {isPending && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse pl-1">
               <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
               <span>Switching...</span>
            </span>
         )}
      </div>
   );
}
