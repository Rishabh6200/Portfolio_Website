"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useRouter } from "@bprogress/next/app";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Loader2, Sparkles } from "lucide-react";
import { toast } from "@/components/ui/toast";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { skillSchema, type SkillFormValues, type SkillLevel } from "../schema";
import { createSkillAction, updateSkillAction } from "../actions";
import { ISkill } from "../db/queries";
import { CategoryItem } from "@/features/categories/components/table";
import { cn } from "@/lib/utils";

interface SkillFormProps {
   categories: CategoryItem[] | Promise<CategoryItem[]>;
   initialData?: ISkill | Promise<ISkill | null> | null;
   defaultCategoryId?: string;
   isEditing?: boolean;
}

const PROFICIENCY_LEVELS = [
   {
      value: "Expert",
      label: "Expert",
      description: "Daily production architecture, deep mastery, and performance optimization.",
   },
   {
      value: "Advanced",
      label: "Advanced",
      description: "Strong proficiency building scalable systems with minimal guidance.",
   },
   {
      value: "Proficient",
      label: "Proficient",
      description: "Working knowledge and practical hands-on production experience.",
   },
] as const;

export default function SkillForm({ categories, initialData, defaultCategoryId, isEditing = false, }: SkillFormProps) {
   const router = useRouter();

   const resolvedCategories =
      categories && typeof (categories as { then?: unknown }).then === "function"
         ? use(categories as Promise<CategoryItem[]>)
         : ((categories as CategoryItem[] | undefined) ?? []);

   const data =
      initialData && typeof (initialData as { then?: unknown }).then === "function"
         ? use(initialData as Promise<ISkill | null>)
         : ((initialData as ISkill | null | undefined) ?? null);

   if (isEditing && !data) {
      notFound();
   }

   const initialCatId =
      data?.categoryId ||
      defaultCategoryId ||
      (resolvedCategories.length > 0 ? resolvedCategories[0].id : "");

   const form = useForm<SkillFormValues>({
      resolver: zodResolver(skillSchema),
      defaultValues: {
         name: data?.name || "",
         categoryId: initialCatId,
         level: (data?.level as SkillLevel) || "Advanced",
         highlight: data?.highlight ?? false,
         order: data?.order,
      },
   });

   const onSubmit = async (values: SkillFormValues) => {
      const result =
         isEditing && data?.id
            ? await updateSkillAction(data.id, values)
            : await createSkillAction(values);

      toast.add({
         type: result.success ? "success" : "error",
         title: result.success
            ? isEditing
               ? "Skill updated"
               : "Skill created"
            : isEditing
               ? "Skill update failed"
               : "Skill creation failed",
         description: result.success
            ? `Skill "${values.name}" ${isEditing ? "updated" : "created"} successfully.`
            : result.error,
      });

      if (result.success) {
         const cat = resolvedCategories.find((c) => c.id === values.categoryId);
         const targetQuery = cat ? `?c=${cat.slug}` : "";
         router.push(`/console/skills${targetQuery}`);
      }
   };

   const { isSubmitting } = form.formState;

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="w-full space-y-8 pb-12">
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                     control={form.control}
                     name="categoryId"
                     render={({ field }) => (
                        <FormItem>
                           <div className="flex items-center justify-between">
                              <FormLabel>
                                 Parent Category <span className="text-destructive">*</span>
                              </FormLabel>
                              <Link
                                 href="/console/categories/new"
                                 target="_blank"
                                 className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
                              >
                                 + Add Category
                              </Link>
                           </div>
                           <FormControl>
                              <Select
                                 value={field.value}
                                 onValueChange={field.onChange}
                                 items={resolvedCategories.map((c) => ({
                                    value: c.id,
                                    label: c.name,
                                 }))}
                              >
                                 <SelectTrigger className="h-10 w-full justify-between">
                                    <SelectValue placeholder="Select a parent category">
                                       {(val) => {
                                          const cat = resolvedCategories.find((c) => c.id === val);
                                          if (!cat) return "Select a parent category";
                                          return (
                                             <span className="flex items-center gap-2">
                                                {cat.color && (
                                                   <span
                                                      className="h-2.5 w-2.5 rounded-full shrink-0"
                                                      style={{ backgroundColor: cat.color }}
                                                   />
                                                )}
                                                <span>{cat.name}</span>
                                             </span>
                                          );
                                       }}
                                    </SelectValue>
                                 </SelectTrigger>
                                 <SelectContent>
                                    {resolvedCategories.map((cat) => (
                                       <SelectItem key={cat.id} value={cat.id} label={cat.name}>
                                          <div className="flex items-center justify-between w-full py-0.5">
                                             <div className="flex items-center gap-2.5">
                                                {cat.color ? (
                                                   <span
                                                      className="h-2.5 w-2.5 rounded-full shrink-0 ring-2 ring-background shadow-xs"
                                                      style={{ backgroundColor: cat.color }}
                                                   />
                                                ) : (
                                                   <span className="h-2.5 w-2.5 rounded-full shrink-0 bg-muted-foreground/30" />
                                                )}
                                                <span className="font-medium text-foreground">{cat.name}</span>
                                             </div>
                                             <span className="text-[11px] font-mono text-muted-foreground/70 mr-2">
                                                {cat.slug}
                                             </span>
                                          </div>
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>
                              Skill / Technology Name <span className="text-destructive">*</span>
                           </FormLabel>
                           <FormControl>
                              <Input
                                 type="text"
                                 placeholder="e.g. Next.js, PostgreSQL, Docker"
                                 className="h-10"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>

               {/* Proficiency Level */}
               <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>
                           Proficiency Level <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                           <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              items={PROFICIENCY_LEVELS.map((lvl) => ({
                                 value: lvl.value,
                                 label: lvl.label,
                              }))}
                           >
                              <SelectTrigger className="h-10 w-full justify-between">
                                 <SelectValue placeholder="Select proficiency level">
                                    {(val) => {
                                       const lvl = PROFICIENCY_LEVELS.find((l) => l.value === val);
                                       return lvl ? lvl.label : "Select proficiency level";
                                    }}
                                 </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                 {PROFICIENCY_LEVELS.map((lvl) => (
                                    <SelectItem key={lvl.value} value={lvl.value} label={lvl.label}>
                                       <div className="flex flex-col gap-1 text-left py-1 pr-2">
                                          <div className="flex items-center gap-2">
                                             <span
                                                className={cn(
                                                   "h-2 w-2 rounded-full shrink-0",
                                                   lvl.value === "Expert" && "bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.6)]",
                                                   lvl.value === "Advanced" && "bg-sky-500 shadow-[0_0_6px_rgba(14,165,233,0.6)]",
                                                   lvl.value === "Proficient" && "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]"
                                                )}
                                             />
                                             <span className="font-semibold text-sm text-foreground">{lvl.label}</span>
                                          </div>
                                          <p className="text-xs text-muted-foreground leading-relaxed pl-4">
                                             {lvl.description}
                                          </p>
                                       </div>
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Highlight Feature Card */}
               <FormField
                  control={form.control}
                  name="highlight"
                  render={({ field }) => (
                     <FormItem className="rounded-xl border border-border p-4 bg-card/50 flex items-start gap-3.5 transition-colors hover:bg-card/80">
                        <FormControl>
                           <Checkbox
                              id="highlight"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-0.5 size-5 rounded-full"
                           />
                        </FormControl>
                        <div className="space-y-1 select-none">
                           <label
                              htmlFor="highlight"
                              className="text-sm font-semibold text-foreground cursor-pointer flex items-center gap-2 select-none"
                           >
                              <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
                              <span>Highlight this skill on public website</span>
                           </label>
                           <p className="text-xs text-muted-foreground leading-relaxed">
                              When enabled, this competency receives a distinctive glowing accent dot and highlighted background badge in the skills grid.
                           </p>
                        </div>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
               <Link
                  href="/console/skills"
                  className={buttonVariants({ variant: "outline", size: "default" })}
               >
                  Cancel
               </Link>

               <Button type="submit" size="default" disabled={isSubmitting} className="gap-2 min-w-36">
                  {isSubmitting ? (
                     <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                     </>
                  ) : (
                     <>
                        <Save className="h-4 w-4" />
                        <span>{isEditing ? "Save Changes" : "Create Skill"}</span>
                     </>
                  )}
               </Button>
            </div>
         </form>
      </Form>
   );
}
