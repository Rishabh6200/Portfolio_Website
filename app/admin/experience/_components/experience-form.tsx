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
  createExperienceAction,
  updateExperienceAction,
} from "../actions"
import {
  experienceSchema,
  type ExperienceFormValues,
  type ExperienceFormData,
} from "../schema"

interface ExperienceFormProps {
  availableSkills: AvailableSkill[]
  initialData?: ExperienceFormData & { _id?: string }
  isEditing?: boolean
}

const EMPLOYMENT_TYPES = [
  { value: "Full-Time", label: "Full-Time" },
  { value: "Part-Time", label: "Part-Time" },
  { value: "Contract", label: "Contract" },
  { value: "Freelance", label: "Freelance" },
  { value: "Internship", label: "Internship" },
]

const LOCATION_TYPES = [
  { value: "Remote", label: "Remote" },
  { value: "On-Site", label: "On-Site" },
  { value: "Hybrid", label: "Hybrid" },
]

function detectLocationType(rawLocation?: string, locType?: string): string {
  if (locType && ["Remote", "On-Site", "Hybrid"].includes(locType)) {
    return locType
  }
  if (!rawLocation) return "Remote"
  const lower = rawLocation.toLowerCase()
  if (lower.includes("on-site") || lower.includes("onsite")) return "On-Site"
  if (lower.includes("hybrid")) return "Hybrid"
  if (lower === "remote") return "Remote"
  return "On-Site"
}

function cleanLocationName(rawLocation?: string, locType?: string): string {
  if (!rawLocation) return ""
  if (locType === "Remote" || rawLocation.toLowerCase() === "remote") return "Remote"
  return rawLocation
    .replace(/\s*\((on-site|onsite|hybrid|remote)\)\s*/gi, "")
    .trim()
}

export function ExperienceForm({
  availableSkills,
  initialData,
  isEditing = false,
}: ExperienceFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Skills state
  const initialSkillIds: string[] = Array.isArray(initialData?.skills)
    ? initialData.skills.map((s: any) => (typeof s === "object" ? s._id : String(s)))
    : []
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkillIds)

  // Achievements dynamic list
  const [achievements, setAchievements] = useState<string[]>(
    initialData?.achievements && initialData.achievements.length > 0
      ? initialData.achievements
      : [""]
  )

  const initialLocationType = detectLocationType(initialData?.location, initialData?.locationType)
  const [locationType, setLocationType] = useState<string>(initialLocationType)

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: initialData?.company || "",
      role: initialData?.role || "",
      period: initialData?.period || "",
      location: initialData?.location
        ? cleanLocationName(initialData.location, initialLocationType)
        : initialLocationType === "Remote"
        ? "Remote"
        : "",
      locationType: initialLocationType,
      type: initialData?.type || "Full-Time",
      description: initialData?.description || "",
      achievements: initialData?.achievements || [],
      skills: initialSkillIds,
      order: initialData?.order,
    },
  })

  const currentType = watch("type") || "Full-Time"

  const handleAddAchievement = () => {
    setAchievements((prev) => [...prev, ""])
  }

  const handleAchievementChange = (index: number, value: string) => {
    setAchievements((prev) => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const handleRemoveAchievement = (index: number) => {
    setAchievements((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: ExperienceFormValues) => {
    const cleanedAchievements = achievements.map((a) => a.trim()).filter(Boolean)
    const locType = locationType || "Remote"
    const finalLocation = locType === "Remote" ? "Remote" : data.location.trim()

    const payload: ExperienceFormData = {
      company: data.company.trim(),
      role: data.role.trim(),
      period: data.period.trim(),
      location: finalLocation,
      locationType: locType,
      type: data.type.trim() || "Full-Time",
      description: data.description.trim(),
      achievements: cleanedAchievements,
      skills: selectedSkills,
      ...(isEditing && initialData?.order !== undefined ? { order: initialData.order } : {}),
    }

    startTransition(async () => {
      try {
        if (isEditing && initialData?._id) {
          const res = await updateExperienceAction(initialData._id, payload)
          if (res.success) {
            toast.success("Experience entry updated successfully!")
            router.push("/admin/experience")
            router.refresh()
          } else {
            toast.error(res.error || "Failed to update experience")
          }
        } else {
          const res = await createExperienceAction(payload)
          if (res.success) {
            toast.success("Experience entry created successfully!")
            router.push("/admin/experience")
            router.refresh()
          } else {
            toast.error(res.error || "Failed to create experience")
          }
        }
      } catch (err) {
        console.error("Error submitting experience:", err)
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
          href="/admin/experience"
          className={buttonVariants({ variant: "outline", size: "default" })}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Experiences</span>
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
              <span>{isEditing ? "Save Changes" : "Create Experience"}</span>
            </>
          )}
        </Button>
      </div>

      {/* Section 1: Basic Role Information */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Role & Organization
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Company name, job title, timeline, and employment arrangements.
          </p>
        </div>

        <div className="space-y-6">
          {/* Company & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Company Name <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                placeholder="e.g. Vanguard Systems"
                {...register("company")}
                className={errors.company ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.company && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.company.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Job Title / Role <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                placeholder="e.g. Staff Backend & Full-Stack Developer"
                {...register("role")}
                className={errors.role ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.role && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>

          {/* Period, Location & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Period <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                placeholder="e.g. 2023 — Present"
                {...register("period")}
                className={errors.period ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.period ? (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.period.message}
                </p>
              ) : (
                <p className="text-[11px] text-muted-foreground">
                  Use &quot;Present&quot; for current ongoing roles.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Location <span className="text-destructive">*</span>
              </Label>
              <Select
                value={locationType}
                onValueChange={(val) => {
                  if (val) {
                    setLocationType(val)
                    setValue("locationType", val)
                    if (val === "Remote") {
                      setValue("location", "Remote")
                      clearErrors("location")
                    } else if (watch("location") === "Remote") {
                      setValue("location", "")
                    }
                  }
                }}
                items={LOCATION_TYPES}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATION_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value} label={t.label}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Employment Type</Label>
              <Select
                value={currentType}
                onValueChange={(val) => {
                  if (val) setValue("type", val)
                }}
                items={EMPLOYMENT_TYPES}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value} label={t.label}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conditional Location Name when On-Site or Hybrid */}
          {locationType !== "Remote" && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Location Name <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                placeholder="e.g. Austin, TX or San Francisco, CA"
                {...register("location")}
                className={errors.location ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {errors.location && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.location.message}
                </p>
              )}
              <p className="text-[11px] text-muted-foreground">
                Specify the city, state, or office campus for this {locationType.toLowerCase()} role.
              </p>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Role Summary <span className="text-destructive">*</span>
            </Label>
            <Textarea
              rows={3}
              placeholder="Brief summary of your responsibilities, team scope, and primary mission..."
              {...register("description")}
              className={errors.description ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.description && (
              <p className="text-xs text-destructive font-medium mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* Section 2: Key Achievements */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Key Achievements & Milestones
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Bulleted engineering achievements, metrics, and high-impact deliverables.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddAchievement}
            className="gap-1.5 self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add Point</span>
          </Button>
        </div>

        <div className="space-y-3">
          {achievements.map((item, index) => (
            <div key={index} className="flex items-start gap-2.5">
              <span className="font-mono text-xs text-muted-foreground w-6 text-center pt-2.5 shrink-0">
                #{index + 1}
              </span>
              <Input
                type="text"
                value={item}
                onChange={(e) => handleAchievementChange(index, e.target.value)}
                placeholder="e.g. Architected modular NestJS microservices handling 15,000+ req/sec..."
                className="flex-1"
              />
              {achievements.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveAchievement(index)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  title="Remove point"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* Section 3: Technologies Used (Linked with Skills) */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Technologies & Tools
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Pick technologies directly from your Skills database collection to tag this role.
          </p>
        </div>

        <SkillSelector
          availableSkills={availableSkills}
          selectedSkillIds={selectedSkills}
          onChange={setSelectedSkills}
        />
      </section>

      {/* Bottom Save Action */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
        <Link
          href="/admin/experience"
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
              <span>{isEditing ? "Save Changes" : "Create Experience"}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
