"use client"

import { FC, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "@bprogress/next/app"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"

import StringListEditor from "@/components/common/string-list-editor"
import SkillSelector, { SkillSelectorItem } from "@/components/common/skill-selector"
import ConfirmDialog from "@/components/dialogs/confirm-dialog"
import { experienceSchema, type ExperienceFormValues } from "../schema"
import { createExperienceAction, updateExperienceAction, deleteExperienceAction } from "../actions"

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

export interface InitialExperienceData {
   id?: string
   company?: string
   role?: string
   period?: string
   location?: string
   locationType?: "Remote" | "On-Site" | "Hybrid" | string
   type?: string
   description?: string
   achievements?: readonly string[] | string[]
   skills?: unknown[]
   skillIds?: string[]
   order?: number
   [key: string]: unknown
}

interface ExperienceFormProps {
   initialData?: InitialExperienceData
   isEditing?: boolean
   availableSkills?: SkillSelectorItem[]
}

const ExperienceForm: FC<ExperienceFormProps> = ({
   initialData,
   isEditing = false,
   availableSkills = [],
}) => {
   const router = useRouter()
   const [showDeleteDialog, setShowDeleteDialog] = useState(false)
   const [isPending, startTransition] = useTransition()

   // Extract initial skill IDs
   const initialSkillIds: string[] = (() => {
      if (initialData?.skillIds && Array.isArray(initialData.skillIds)) {
         return initialData.skillIds
      }
      if (initialData?.skills && Array.isArray(initialData.skills)) {
         return initialData.skills
            .map((s: unknown) => {
               if (typeof s === "string") return s
               if (s && typeof s === "object") {
                  const obj = s as { skillId?: string; id?: string }
                  return obj.skillId || obj.id
               }
               return undefined
            })
            .filter((id): id is string => typeof id === "string")
      }
      return []
   })()

   const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkillIds)

   // Extract initial achievements
   const initialAchievements: string[] = (() => {
      if (initialData?.achievements && Array.isArray(initialData.achievements) && initialData.achievements.length > 0) {
         return [...initialData.achievements]
      }
      return [""]
   })()

   const [achievements, setAchievements] = useState<string[]>(initialAchievements)

   const initialLocType = (initialData?.locationType as "Remote" | "On-Site" | "Hybrid") || "Remote"
   const [locationType, setLocationType] = useState<"Remote" | "On-Site" | "Hybrid">(initialLocType)

   const {
      register,
      handleSubmit,
      setValue,
      getValues,
      control,
      clearErrors,
      formState: { errors, isSubmitting },
   } = useForm<ExperienceFormValues>({
      resolver: zodResolver(experienceSchema),
      defaultValues: {
         company: initialData?.company || "",
         role: initialData?.role || "",
         period: initialData?.period || "",
         location: initialData?.location || (initialLocType === "Remote" ? "Remote" : ""),
         locationType: initialLocType,
         type: initialData?.type || "Full-Time",
         description: initialData?.description || "",
         achievements: initialAchievements,
         skillIds: initialSkillIds,
         order: initialData?.order,
      },
   })

   const currentType = useWatch({ control, name: "type" }) || "Full-Time"

   const onSubmit = async (values: ExperienceFormValues) => {
      const cleanedAchievements = achievements.map((a) => a.trim()).filter(Boolean)
      const finalLocation = locationType === "Remote" ? "Remote" : values.location.trim()

      const payload: ExperienceFormValues = {
         ...values,
         location: finalLocation,
         locationType,
         achievements: cleanedAchievements,
         skillIds: selectedSkills,
      }

      startTransition(async () => {
         try {
            const result =
               isEditing && initialData?.id
                  ? await updateExperienceAction(initialData.id, payload)
                  : await createExperienceAction(payload)

            if (!result.success) {
               toast.add({
                  type: "error",
                  title: isEditing ? "Update failed" : "Creation failed",
                  description: result.error,
               })
               return
            }

            toast.add({
               type: "success",
               title: isEditing ? "Experience updated" : "Experience created",
               description: `Role at "${payload.company}" was ${isEditing ? "updated" : "created"} successfully.`,
            })

            router.push("/console/experience")
            router.refresh()
         } catch (err: unknown) {
            toast.add({
               type: "error",
               title: "Error",
               description: err instanceof Error ? err.message : "An unexpected error occurred while saving.",
            })
         }
      })
   }

   const handleDelete = () => {
      if (!initialData?.id) return

      startTransition(async () => {
         try {
            const result = await deleteExperienceAction(initialData.id!)
            if (result.success) {
               setShowDeleteDialog(false)
               toast.add({
                  type: "success",
                  title: "Experience deleted",
                  description: `Experience at "${initialData.company || "Company"}" was deleted successfully.`,
               })
               router.push("/console/experience")
               router.refresh()
            } else {
               toast.add({
                  type: "error",
                  title: "Delete failed",
                  description: result.error || "Could not delete experience.",
               })
            }
         } catch (err: unknown) {
            toast.add({
               type: "error",
               title: "Delete failed",
               description: err instanceof Error ? err.message : "Failed to delete experience",
            })
         }
      })
   }

   const isLoading = isSubmitting || isPending

   return (
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full space-y-10 pb-16">
         {/* Top Header Actions */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
               <Link
                  href="/console/experience"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
               >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Experiences</span>
               </Link>
               <Separator orientation="vertical" className="h-4 my-auto" />
               <h1 className="text-base sm:text-lg font-semibold text-foreground truncate max-w-xs sm:max-w-md">
                  {isEditing ? `Edit: ${initialData?.role} at ${initialData?.company}` : "New Work Experience"}
               </h1>
            </div>

            <div className="flex items-center gap-2.5">
               {isEditing && (
                  <Button
                     type="button"
                     variant="outline"
                     size="sm"
                     onClick={() => setShowDeleteDialog(true)}
                     disabled={isLoading}
                     className="text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                  >
                     <Trash2 className="h-4 w-4" />
                     <span className="hidden sm:inline">Delete</span>
                  </Button>
               )}
               <Button type="submit" size="sm" disabled={isLoading} className="gap-2 cursor-pointer">
                  {isLoading ? (
                     <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                     </>
                  ) : (
                     <>
                        <Save className="h-4 w-4" />
                        <span>{isEditing ? "Update Experience" : "Create Experience"}</span>
                     </>
                  )}
               </Button>
            </div>
         </div>

         {/* Section 1: Role & Organization */}
         <section className="space-y-6">
            <div>
               <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                  Role & Organization
               </h2>
               <p className="text-sm text-muted-foreground mt-0.5">
                  Company name, job title, timeline, and employment details.
               </p>
            </div>

            <div className="space-y-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                     <Label className="text-xs font-medium">
                        Company Name <span className="text-destructive">*</span>
                     </Label>
                     <Input
                        type="text"
                        placeholder="e.g. Vanguard Systems"
                        {...register("company")}
                        className={errors.company ? "border-destructive focus-visible:ring-destructive" : ""}
                     />
                     {errors.company && (
                        <p className="text-xs text-destructive font-medium">{errors.company.message}</p>
                     )}
                  </div>

                  <div className="space-y-2">
                     <Label className="text-xs font-medium">
                        Job Title / Role <span className="text-destructive">*</span>
                     </Label>
                     <Input
                        type="text"
                        placeholder="e.g. Staff Backend & Full-Stack Engineer"
                        {...register("role")}
                        className={errors.role ? "border-destructive focus-visible:ring-destructive" : ""}
                     />
                     {errors.role && (
                        <p className="text-xs text-destructive font-medium">{errors.role.message}</p>
                     )}
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="space-y-2">
                     <Label className="text-xs font-medium">
                        Period <span className="text-destructive">*</span>
                     </Label>
                     <Input
                        type="text"
                        placeholder="e.g. 2023 — Present"
                        {...register("period")}
                        className={errors.period ? "border-destructive focus-visible:ring-destructive" : ""}
                     />
                     {errors.period ? (
                        <p className="text-xs text-destructive font-medium">{errors.period.message}</p>
                     ) : (
                        <p className="text-[11px] text-muted-foreground">
                           Use &quot;Present&quot; for ongoing positions.
                        </p>
                     )}
                  </div>

                  <div className="space-y-2">
                     <Label className="text-xs font-medium">Location Type</Label>
                     <Select
                        value={locationType}
                        onValueChange={(val) => {
                           if (val === "Remote" || val === "On-Site" || val === "Hybrid") {
                              setLocationType(val)
                              setValue("locationType", val)
                              if (val === "Remote") {
                                 setValue("location", "Remote")
                                 clearErrors("location")
                              } else if (getValues("location") === "Remote") {
                                 setValue("location", "")
                              }
                           }
                        }}
                     >
                        <SelectTrigger className="w-full">
                           <SelectValue placeholder="Select location type" />
                        </SelectTrigger>
                        <SelectContent>
                           {LOCATION_TYPES.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                 {t.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>

                  <div className="space-y-2">
                     <Label className="text-xs font-medium">Employment Type</Label>
                     <Select
                        value={currentType}
                        onValueChange={(val) => {
                           if (val) setValue("type", val)
                        }}
                     >
                        <SelectTrigger className="w-full">
                           <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                           {EMPLOYMENT_TYPES.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                 {t.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               {/* Physical Location Input if On-Site or Hybrid */}
               {locationType !== "Remote" && (
                  <div className="space-y-2">
                     <Label className="text-xs font-medium">
                        Office / City Location <span className="text-destructive">*</span>
                     </Label>
                     <Input
                        type="text"
                        placeholder="e.g. Austin, TX or Mohali, India"
                        {...register("location")}
                        className={errors.location ? "border-destructive focus-visible:ring-destructive" : ""}
                     />
                     {errors.location && (
                        <p className="text-xs text-destructive font-medium">{errors.location.message}</p>
                     )}
                  </div>
               )}

               <div className="space-y-2">
                  <Label className="text-xs font-medium">
                     Role Summary <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                     rows={3}
                     placeholder="Brief overview of your responsibilities, architectural impact, and team scope..."
                     {...register("description")}
                     className={errors.description ? "border-destructive focus-visible:ring-destructive" : ""}
                  />
                  {errors.description && (
                     <p className="text-xs text-destructive font-medium">{errors.description.message}</p>
                  )}
               </div>
            </div>
         </section>

         <Separator />

         {/* Section 2: Key Achievements & Milestones */}
         <section className="space-y-6">
            <StringListEditor
               title="Key Achievements & Milestones"
               description="High-impact engineering deliverables, metrics, and systems scaled."
               items={achievements}
               onChange={setAchievements}
               placeholder="e.g. Architected modular NestJS microservices handling 15,000+ req/sec with Redis..."
               addButtonLabel="Add Achievement"
            />
         </section>

         <Separator />

         {/* Section 3: Technologies & Tools */}
         <section className="space-y-6">
            <div>
               <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                  Technologies & Skills
               </h2>
               <p className="text-sm text-muted-foreground mt-0.5">
                  Tag technologies used or mastered in this role from your technical database.
               </p>
            </div>

            <SkillSelector
               availableSkills={availableSkills}
               selectedSkillIds={selectedSkills}
               onChange={setSelectedSkills}
            />
         </section>

         {/* Bottom Action Bar */}
         <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
            <Link
               href="/console/experience"
               className={buttonVariants({ variant: "outline", size: "default" })}
            >
               Cancel
            </Link>
            <Button type="submit" size="default" disabled={isLoading} className="gap-2 min-w-36 cursor-pointer">
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

         {/* Delete Confirmation Modal */}
         <ConfirmDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            title="Delete Experience Entry"
            itemName={`${initialData?.role} at ${initialData?.company}`}
            variant="destructive"
            confirmText="Delete Experience"
            isPending={isLoading}
            onConfirm={handleDelete}
         />
      </form>
   )
}

export default ExperienceForm
