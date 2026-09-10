"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Save, Loader2, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createSkillAction,
  updateSkillAction,
} from "@/app/admin/skills/actions"
import { skillSchema, SkillFormValues, type SkillFormData } from "@/app/admin/skills/schema"

interface CategoryOption {
  _id: string
  name: string
  slug: string
  color?: string
}

interface SkillFormProps {
  categories: CategoryOption[]
  initialData?: SkillFormData & { _id?: string }
  isEditing?: boolean
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
]

export function SkillForm({
  categories,
  initialData,
  isEditing = false,
}: SkillFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const defaultCategoryId =
    initialData?.categoryId || categories[0]?._id || ""

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: initialData?.name || "",
      categoryId: defaultCategoryId,
      level: initialData?.level || "Advanced",
      highlight: initialData?.highlight ?? false,
      order: initialData?.order,
    },
  })

  const onSubmit = async (data: SkillFormValues) => {
    const payload: SkillFormData = {
      name: data.name.trim(),
      categoryId: data.categoryId,
      level: data.level,
      highlight: Boolean(data.highlight),
      ...(isEditing && initialData?.order !== undefined ? { order: initialData.order } : {}),
    }

    startTransition(async () => {
      try {
        if (isEditing && initialData?._id) {
          const res = await updateSkillAction(initialData._id, payload)
          if (res.success) {
            toast.success("Skill updated successfully!")
            router.push("/admin/skills")
            router.refresh()
          } else {
            toast.error(res.error || "Failed to update skill")
          }
        } else {
          const res = await createSkillAction(payload)
          if (res.success) {
            toast.success("Skill created successfully!")
            router.push("/admin/skills")
            router.refresh()
          } else {
            toast.error(res.error || "Failed to create skill")
          }
        }
      } catch (err) {
        console.error("Error submitting skill:", err)
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
          href="/admin/skills"
          className={buttonVariants({ variant: "outline", size: "default" })}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Skills</span>
        </Link>

        <Button type="submit" size="default" disabled={isLoading} className="gap-2 min-w-32">
          {isLoading ? (
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

      {/* Form Details */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Skill & Competency Details
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Assign the technical competency to a parent domain category and specify proficiency level.
          </p>
        </div>

        <div className="space-y-6">
          {/* Category Binding & Skill Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Parent Category <span className="text-destructive">*</span>
                </Label>
                <Link
                  href="/admin/categories/new"
                  target="_blank"
                  className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
                >
                  + Add Category
                </Link>
              </div>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    items={categories.map((c) => ({ value: c._id, label: c.name }))}
                  >
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Select a parent category">
                        {(val) => {
                          const cat = categories.find((c) => c._id === val)
                          if (!cat) return "Select a parent category"
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
                          )
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id} label={cat.name}>
                          <div className="flex items-center gap-2">
                            {cat.color && (
                              <span
                                className="h-2.5 w-2.5 rounded-full shrink-0"
                                style={{ backgroundColor: cat.color }}
                              />
                            )}
                            <span>{cat.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoryId && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Skill / Technology Name <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                placeholder="e.g. NestJS or React 19"
                {...register("name")}
                className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.name && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          {/* Proficiency Level */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Proficiency Level <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="level"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  items={PROFICIENCY_LEVELS.map((lvl) => ({
                    value: lvl.value,
                    label: lvl.label,
                  }))}
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select level">
                      {(val) => {
                        const lvl = PROFICIENCY_LEVELS.find((l) => l.value === val)
                        return lvl ? lvl.label : "Select level"
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {PROFICIENCY_LEVELS.map((lvl) => (
                      <SelectItem key={lvl.value} value={lvl.value} label={lvl.label}>
                        <div className="flex flex-col text-left py-0.5">
                          <span className="font-medium text-foreground">{lvl.label}</span>
                          <span className="text-[11px] text-muted-foreground">{lvl.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.level && (
              <p className="text-xs text-destructive font-medium mt-1">
                {errors.level.message}
              </p>
            )}
          </div>

          {/* Highlight Toggle */}
          <div className="rounded-xl border border-border p-4 bg-card/50 flex items-start gap-3.5 transition-colors hover:bg-card/80">
            <Controller
              name="highlight"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="highlight"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-0.5"
                />
              )}
            />
            <div className="space-y-1">
              <label
                htmlFor="highlight"
                className="text-sm font-semibold text-foreground cursor-pointer flex items-center gap-2 select-none"
              >
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span>Highlight this skill on public website</span>
              </label>
              <p className="text-xs text-muted-foreground leading-relaxed">
                When enabled, this competency receives a distinctive glowing accent dot and highlighted background badge in the skills grid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Sticky Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
        <Link
          href="/admin/skills"
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
              <span>{isEditing ? "Save Changes" : "Create Skill"}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
