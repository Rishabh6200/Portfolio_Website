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

function hexToRgba(hex?: string, alpha = 0.2): string | undefined {
   if (!hex || !hex.startsWith("#")) return undefined;
   let clean = hex.slice(1);
   if (clean.length === 3) {
      clean = clean
         .split("")
         .map((c) => c + c)
         .join("");
   }
   if (clean.length !== 6) return undefined;
   const r = parseInt(clean.substring(0, 2), 16);
   const g = parseInt(clean.substring(2, 4), 16);
   const b = parseInt(clean.substring(4, 6), 16);
   return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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
                        className="group/tab cursor-pointer gap-2 px-3 text-xs sm:text-sm font-medium select-none"
                     >
                        {cat.color && (
                           <span
                              className={cn(
                                 "size-2 rounded-full shrink-0 transition-all duration-200",
                                 isActive
                                    ? "scale-110 opacity-100"
                                    : "opacity-40 group-hover/tab:opacity-75 group-hover/tab:scale-105"
                              )}
                              style={{
                                 backgroundColor: cat.color,
                                 ...(isActive && {
                                    boxShadow: `0 0 0 2.5px ${hexToRgba(cat.color, 0.25)}, 0 0 8px ${hexToRgba(cat.color, 0.4)}`,
                                 }),
                              }}
                           />
                        )}
                        <span
                           className={cn(
                              "transition-colors duration-150",
                              isActive
                                 ? "text-foreground font-semibold"
                                 : "text-muted-foreground group-hover/tab:text-foreground"
                           )}
                        >
                           {cat.name}
                        </span>
                        <span
                           className={cn(
                              "h-4.5 min-w-4.5 px-1.5 inline-flex items-center justify-center rounded-full text-[11px] font-mono leading-none transition-all duration-150",
                              isActive
                                 ? "font-semibold text-foreground"
                                 : "bg-muted-foreground/10 text-muted-foreground/80 group-hover/tab:text-muted-foreground group-hover/tab:bg-muted-foreground/15"
                           )}
                           style={
                              isActive && cat.color
                                 ? {
                                      backgroundColor: hexToRgba(cat.color, 0.14),
                                      boxShadow: `inset 0 0 0 1px ${hexToRgba(cat.color, 0.28)}`,
                                   }
                                 : undefined
                           }
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
