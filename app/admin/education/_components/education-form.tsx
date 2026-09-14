"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SkillSelector,
  type AvailableSkill,
} from "@/app/admin/projects/_components/skill-selector"
import {
  createEducationAction,
  updateEducationAction,
} from "../actions"
import {
  educationSchema,
  type EducationFormValues,
  type EducationFormData,
} from "../schema"

interface EducationFormProps {
  availableSkills: AvailableSkill[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any
  isEditing?: boolean
}

const EDUCATION_TYPES = [
  { value: "Degree", label: "Degree" },
  { value: "Certification", label: "Certification" },
  { value: "Diploma", label: "Diploma" },
  { value: "Course", label: "Course / Workshop" },
]

export function EducationForm({
  availableSkills,
  initialData,
  isEditing = false,
}: EducationFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Skills state
  const initialSkillIds: string[] = Array.isArray(initialData?.skills)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? initialData.skills.map((s: any) => (typeof s === "object" ? s._id : String(s)))
    : []
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkillIds)

  // Highlights dynamic list
  const [highlights, setHighlights] = useState<string[]>(
    initialData?.highlights && initialData.highlights.length > 0
      ? initialData.highlights
      : [""]
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: initialData?.institution || "",
      degree: initialData?.degree || "",
      fieldOfStudy: initialData?.fieldOfStudy || "",
      period: initialData?.period || "",
      location: initialData?.location || "",
      type: initialData?.type || "Degree",
      grade: initialData?.grade || "",
      description: initialData?.description || "",
      highlights: initialData?.highlights || [],
      skills: initialSkillIds,
      order: initialData?.order,
    },
  })

  const currentType = watch("type") || "Degree"

  const handleAddHighlight = () => {
    setHighlights((prev) => [...prev, ""])
  }

  const handleHighlightChange = (index: number, value: string) => {
    setHighlights((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const handleRemoveHighlight = (index: number) => {
    setHighlights((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: EducationFormValues) => {
    const cleanedHighlights = highlights.map((h) => h.trim()).filter(Boolean)

    const payload: EducationFormData = {
      institution: data.institution.trim(),
      degree: data.degree.trim(),
      fieldOfStudy: data.fieldOfStudy?.trim() || "",
      period: data.period.trim(),
      location: data.location.trim(),
      type: data.type.trim() || "Degree",
      grade: data.grade?.trim() || "",
      description: data.description.trim(),
      highlights: cleanedHighlights,
      skills: selectedSkills,
      ...(isEditing && initialData?.order !== undefined ? { order: initialData.order } : {}),
    }

    startTransition(async () => {
      try {
        if (isEditing && initialData?._id) {
          const res = await updateEducationAction(initialData._id, payload)
          if (res.success) {
            toast.success("Education record updated successfully!")
            router.push("/admin/education")
            router.refresh()
          } else {
            toast.error(res.error || "Failed to update education")
          }
        } else {
          const res = await createEducationAction(payload)
          if (res.success) {
            toast.success("Education record created successfully!")
            router.push("/admin/education")
            router.refresh()
          } else {
            toast.error(res.error || "Failed to create education")
          }
        }
      } catch (err) {
        console.error("Error submitting education record:", err)
        toast.error("An unexpected error occurred")
      }
    })
  }

  const isLoading = isSubmitting || isPending

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full space-y-10 pb-20">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <Link
          href="/admin/education"
          className={buttonVariants({ variant: "outline", size: "default" })}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Education</span>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            disabled={isLoading}
            className="min-w-32"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{isEditing ? "Update Education" : "Create Education"}</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Section 1: Core Credentials & Details */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Qualification Details</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Institution, qualification title, qualification type, and study focus.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Degree / Qualification */}
            <div className="space-y-2">
              <Label htmlFor="degree" className="text-xs font-medium">
                Degree / Qualification Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="degree"
                placeholder="e.g. B.Tech in Computer Science & Engineering"
                {...register("degree")}
                className={errors.degree ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.degree && (
                <p className="text-xs text-destructive">{errors.degree.message}</p>
              )}
            </div>

            {/* Institution */}
            <div className="space-y-2">
              <Label htmlFor="institution" className="text-xs font-medium">
                Institution / University / Issuing Body <span className="text-destructive">*</span>
              </Label>
              <Input
                id="institution"
                placeholder="e.g. Punjab Technical University or Amazon Web Services"
                {...register("institution")}
                className={errors.institution ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.institution && (
                <p className="text-xs text-destructive">{errors.institution.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Field of Study */}
            <div className="space-y-2">
              <Label htmlFor="fieldOfStudy" className="text-xs font-medium">
                Major / Field of Study
              </Label>
              <Input
                id="fieldOfStudy"
                placeholder="e.g. Computer Science, Cloud Architecture"
                {...register("fieldOfStudy")}
                className={errors.fieldOfStudy ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.fieldOfStudy && (
                <p className="text-xs text-destructive">{errors.fieldOfStudy.message}</p>
              )}
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type" className="text-xs font-medium">
                Credential Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={currentType}
                onValueChange={(val) => {
                  if (val) setValue("type", val, { shouldValidate: true })
                }}
                items={EDUCATION_TYPES}
              >
                <SelectTrigger id="type" className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATION_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value} label={t.label}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-xs text-destructive">{errors.type.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Period */}
            <div className="space-y-2">
              <Label htmlFor="period" className="text-xs font-medium">
                Period / Year <span className="text-destructive">*</span>
              </Label>
              <Input
                id="period"
                placeholder="e.g. 2018 — 2022 or 2024"
                {...register("period")}
                className={errors.period ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.period && (
                <p className="text-xs text-destructive">{errors.period.message}</p>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-xs font-medium">
                Location <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                placeholder="e.g. Punjab, India or Online"
                {...register("location")}
                className={errors.location ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.location && (
                <p className="text-xs text-destructive">{errors.location.message}</p>
              )}
            </div>

            {/* Grade / Distinction */}
            <div className="space-y-2">
              <Label htmlFor="grade" className="text-xs font-medium">
                Grade / Distinction / Honors
              </Label>
              <Input
                id="grade"
                placeholder="e.g. First Class Honours or GPA 3.8/4.0"
                {...register("grade")}
                className={errors.grade ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.grade && (
                <p className="text-xs text-destructive">{errors.grade.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-medium">
              Overview & Academic Focus <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Detailed description of the program, core competencies, research thesis, or certification scope..."
              {...register("description")}
              className={errors.description ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* Section 2: Key Modules & Highlights */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Key Modules & Highlights</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Specific coursework, honors, senior projects, or key domains covered.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddHighlight}
            className="gap-1.5 text-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Item</span>
          </Button>
        </div>

        <div className="space-y-3">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-mono text-muted-foreground">
                {index + 1}
              </div>
              <Input
                value={highlight}
                onChange={(e) => handleHighlightChange(index, e.target.value)}
                placeholder="e.g. Data Structures & Algorithms, Distributed Systems, Senior Thesis on Microservices"
                className="flex-1"
              />
              {highlights.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveHighlight(index)}
                  className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Section 3: Technical Skills Tagging */}
      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Associated Technologies & Skills</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Tag skills acquired, practiced, or certified during this course of study.
          </p>
        </div>

        <SkillSelector
          availableSkills={availableSkills}
          selectedSkillIds={selectedSkills}
          onChange={setSelectedSkills}
        />
      </section>

      <Separator />

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-end gap-3">
        <Link
          href="/admin/education"
          className={buttonVariants({ variant: "ghost", size: "default" })}
        >
          Cancel
        </Link>
        <Button
          type="submit"
          disabled={isLoading}
          className="min-w-32"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{isEditing ? "Update Education" : "Create Education"}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
