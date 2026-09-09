"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowLeft,
  Save,
  Loader2,
  Server,
  Layout,
  Cloud,
  Database,
  Cpu,
  Code2,
  Terminal,
} from "lucide-react"
import { toast } from "sonner"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createCategoryAction,
  updateCategoryAction,
  CategoryFormData,
} from "@/app/admin/categories/actions"
import { categorySchema, CategoryFormValues } from "@/app/admin/categories/schema"

interface CategoryFormProps {
  initialData?: CategoryFormData & { _id?: string }
  isEditing?: boolean
}

const ICON_OPTIONS = [
  { value: "Server", label: "Server (Backend)", icon: Server },
  { value: "Layout", label: "Layout (Frontend)", icon: Layout },
  { value: "Cloud", label: "Cloud (DevOps)", icon: Cloud },
  { value: "Database", label: "Database", icon: Database },
  { value: "Cpu", label: "CPU / Systems", icon: Cpu },
  { value: "Code2", label: "Code / Languages", icon: Code2 },
  { value: "Terminal", label: "Terminal / CLI", icon: Terminal },
]

const COLOR_PRESETS = [
  "#6366f1", // Indigo
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#8b5cf6", // Violet
  "#3b82f6", // Blue
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function CategoryForm({ initialData, isEditing = false }: CategoryFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isAutoSlug, setIsAutoSlug] = useState(!isEditing)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      icon: initialData?.icon || "Server",
      order: initialData?.order ?? 0,
      color: initialData?.color || "#6366f1",
    },
  })

  const onSubmit = async (data: CategoryFormValues) => {
    const payload: CategoryFormData = {
      name: data.name.trim(),
      slug: data.slug.trim(),
      description: (data.description || "").trim(),
      icon: data.icon,
      order: Number(data.order) || 0,
      color: data.color,
    }

    startTransition(async () => {
      try {
        if (isEditing && initialData?._id) {
          const res = await updateCategoryAction(initialData._id, payload)
          if (res.success) {
            toast.success("Category updated successfully!")
            router.push("/admin/categories")
            router.refresh()
          } else {
            toast.error(res.error || "Failed to update category")
          }
        } else {
          const res = await createCategoryAction(payload)
          if (res.success) {
            toast.success("Category created successfully!")
            router.push("/admin/categories")
            router.refresh()
          } else {
            toast.error(res.error || "Failed to create category")
          }
        }
      } catch (err) {
        console.error("Error submitting category:", err)
        toast.error("An unexpected error occurred")
      }
    })
  }

  const isLoading = isSubmitting || isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full space-y-10 pb-20">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2 border-b border-border">
        <Link
          href="/admin/categories"
          className={buttonVariants({ variant: "outline", size: "default" })}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Categories</span>
        </Link>

        <Button type="submit" size="default" disabled={isLoading} className="gap-2">
          {isLoading ? (
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

      {/* Category Details Section */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Category Details
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Define the technical domain name, URL slug, icon, and display sort order.
          </p>
        </div>

        <div className="space-y-6">
          {/* Name & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Category Name <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                placeholder="e.g. Backend APIs & Services"
                {...register("name", {
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (isAutoSlug) {
                      setValue("slug", slugify(e.target.value), { shouldValidate: true })
                    }
                  },
                })}
                className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  URL Slug <span className="text-destructive">*</span>
                </Label>
                <button
                  type="button"
                  onClick={() => setIsAutoSlug(!isAutoSlug)}
                  className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
                >
                  {isAutoSlug ? "Custom Slug" : "Auto Slug"}
                </button>
              </div>
              <Input
                type="text"
                placeholder="e.g. backend-apis"
                {...register("slug", {
                  onChange: () => {
                    setIsAutoSlug(false)
                  },
                })}
                className={`font-mono text-sm ${
                  errors.slug ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              />
              {errors.slug && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.slug.message}
                </p>
              )}
            </div>
          </div>

          {/* Icon & Display Order & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Category Icon</Label>
              <Controller
                name="icon"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    items={ICON_OPTIONS.map((item) => ({
                      value: item.value,
                      label: item.label,
                    }))}
                  >
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Select icon">
                        {(val) => {
                          const item = ICON_OPTIONS.find((opt) => opt.value === val)
                          if (!item) return "Select icon"
                          const IconComp = item.icon
                          return (
                            <span className="flex items-center gap-2">
                              <IconComp className="h-4 w-4 text-indigo-500" />
                              <span>{item.label}</span>
                            </span>
                          )
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((item) => {
                        const IconComp = item.icon
                        return (
                          <SelectItem key={item.value} value={item.value} label={item.label}>
                            <div className="flex items-center gap-2">
                              <IconComp className="h-4 w-4 text-indigo-500" />
                              <span>{item.label}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.icon && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.icon.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Accent Color</Label>
              <Controller
                name="color"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-10 w-12 rounded-lg border border-input shrink-0"
                        style={{ backgroundColor: field.value }}
                      />
                      <Input
                        type="text"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="e.g. #6366f1"
                        className={`font-mono ${
                          errors.color ? "border-destructive focus-visible:ring-destructive" : ""
                        }`}
                      />
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => field.onChange(preset)}
                          className={`h-5 w-5 rounded-full border transition-all cursor-pointer ${
                            (field.value || "").toLowerCase() === preset.toLowerCase()
                              ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                              : "border-border hover:scale-105"
                          }`}
                          style={{ backgroundColor: preset }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              />
              {errors.color && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.color.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Display Sort Order</Label>
              <Input
                type="number"
                placeholder="e.g. 1"
                {...register("order", { valueAsNumber: true })}
                className={errors.order ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.order ? (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.order.message}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Lower numbers appear first on the site.
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Summary Description</Label>
            <Textarea
              rows={3}
              placeholder="e.g. High-throughput microservices, distributed queues, relational modeling & low latency."
              {...register("description")}
              className={
                errors.description ? "border-destructive focus-visible:ring-destructive" : ""
              }
            />
            {errors.description && (
              <p className="text-xs text-destructive font-medium mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Bottom Sticky Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
        <Link
          href="/admin/categories"
          className={buttonVariants({ variant: "outline", size: "default" })}
        >
          Cancel
        </Link>

        <Button type="submit" size="default" disabled={isLoading} className="gap-2 min-w-36">
          {isLoading ? (
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
  )
}
