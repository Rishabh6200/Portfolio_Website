"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/toast"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { slugify } from "@/lib/utils"
import { categorySchema, type CategoryFormValues } from "../schema"
import IconPicker from "@/components/common/icon-picker"
import ColorPicker from "@/components/common/color-picker"
import type { IconName } from "lucide-react/dynamic"
import { createCategoryAction, updateCategoryAction } from "../actions"
import { useRouter } from "@bprogress/next/app"
import { ICategory } from "../db/queries"

import { notFound } from "next/navigation"

interface CategoryFormProps {
   initialData?: ICategory | Promise<ICategory | null> | null
   isEditing?: boolean
}

const CategoryForm = ({ initialData, isEditing = false }: CategoryFormProps) => {
   const [isAutoSlug, setIsAutoSlug] = useState(!isEditing)
   const router = useRouter()

   const data =
      initialData && typeof (initialData as { then?: unknown }).then === "function"
         ? use(initialData as Promise<ICategory | null>)
         : ((initialData as ICategory | null | undefined) ?? null)

   if (isEditing && !data) {
      notFound()
   }

   const form = useForm<CategoryFormValues>({
      resolver: zodResolver(categorySchema),
      defaultValues: {
         name: data?.name || "",
         slug: data?.slug || "",
         description: data?.description || "",
         icon: (data?.icon ? data.icon.toLowerCase() : "server") as IconName,
         order: data?.order ?? 0,
         color: data?.color || "#6366f1",
      },
   })

   const onSubmit = async (values: CategoryFormValues) => {
      const result = isEditing && data?.id
         ? await updateCategoryAction(data.id, values)
         : await createCategoryAction(values)

      toast.add({
         type: result.success ? "success" : "error",
         title: result.success
            ? (isEditing ? "Category updated" : "Category created")
            : (isEditing ? "Category update failed" : "Category creation failed"),
         description: result.success
            ? `Category "${values.name}" ${isEditing ? "updated" : "created"} successfully.`
            : result.error,
      })
      if (result.success) {
         router.push("/console/categories")
      }
   }

   const { isSubmitting } = form.formState

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="w-full space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>
                           Category Name <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                           <Input
                              type="text"
                              placeholder="e.g. Backend APIs & Services"
                              className="h-10"
                              {...field}
                              onChange={(e) => {
                                 field.onChange(e)
                                 if (isAutoSlug) {
                                    form.setValue("slug", slugify(e.target.value), { shouldValidate: true })
                                 }
                              }}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                     <FormItem>
                        <div className="flex items-center justify-between">
                           <FormLabel>
                              URL Slug <span className="text-destructive">*</span>
                           </FormLabel>
                           <button
                              type="button"
                              onClick={() => setIsAutoSlug(!isAutoSlug)}
                              className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
                           >
                              {isAutoSlug ? "Custom Slug" : "Auto Slug"}
                           </button>
                        </div>
                        <FormControl>
                           <Input
                              type="text"
                              placeholder="e.g. backend-apis"
                              className="font-mono text-sm h-10"
                              {...field}
                              onChange={(e) => {
                                 field.onChange(e)
                                 setIsAutoSlug(false)
                              }}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Category Icon</FormLabel>
                        <FormControl>
                           <IconPicker
                              value={field.value as IconName}
                              onChange={field.onChange}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Accent Color */}
               <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Accent Color</FormLabel>
                        <FormControl>
                           <ColorPicker
                              value={field.value}
                              onChange={field.onChange}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            {/* Summary Description */}
            <FormField
               control={form.control}
               name="description"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel>Summary Description</FormLabel>
                     <FormControl>
                        <Textarea
                           rows={6}
                           placeholder="e.g. High-throughput microservices, distributed queues, relational modeling & low latency."
                           className="min-h-32"
                           {...field}
                           value={field.value ?? ""}
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
               <Link
                  href="/console/categories"
                  className={buttonVariants({ variant: "outline", size: "default" })}
               >
                  Cancel
               </Link>

               <Button
                  type="submit"
                  size="default"
                  disabled={isSubmitting}
                  className="gap-2 min-w-36"
               >
                  {isSubmitting ? (
                     <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                     </>
                  ) : (
                     <>
                        <Save className="h-4 w-4" />
                        <span>{isEditing ? "Save Changes" : "Create Category"}</span>
                     </>
                  )}
               </Button>
            </div>
         </form>
      </Form>
   )
}

export default CategoryForm