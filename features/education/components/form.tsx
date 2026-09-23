"use client"

import { FC, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "@bprogress/next/app"
import { useForm } from "react-hook-form"
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
import { educationSchema, type EducationFormValues } from "../schema"
import { createEducationAction, updateEducationAction, deleteEducationAction } from "../actions"

const EDUCATION_TYPES = [
   { value: "Degree", label: "Degree" },
   { value: "Certification", label: "Certification" },
   { value: "Diploma", label: "Diploma" },
   { value: "Course", label: "Course / Workshop" },
]

const STATUS_OPTIONS = [
   { value: "published", label: "Published (Visible on site)" },
   { value: "draft", label: "Draft (Hidden from public site)" },
]

export interface InitialEducationData {
   id?: string
   institution?: string
   degree?: string
   fieldOfStudy?: string
   period?: string
   location?: string
   type?: string
   grade?: string
   description?: string
   highlights?: readonly string[] | string[]
   status?: "published" | "draft" | string
   skills?: unknown[]
   skillIds?: string[]
   order?: number
   [key: string]: unknown
}

interface EducationFormProps {
   initialData?: InitialEducationData
   isEditing?: boolean
   availableSkills?: SkillSelectorItem[]
}

const EducationForm: FC<EducationFormProps> = ({
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

   // Extract initial highlights
   const initialHighlights: string[] = (() => {
      if (initialData?.highlights && Array.isArray(initialData.highlights) && initialData.highlights.length > 0) {
         return [...initialData.highlights]
      }
      return [""]
   })()

   const [highlights, setHighlights] = useState<string[]>(initialHighlights)

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
         highlights: initialHighlights,
         skillIds: initialSkillIds,
         status: (initialData?.status as "published" | "draft") || "published",
         order: initialData?.order,
      },
   })

   const currentType = watch("type") || "Degree"
   const currentStatus = watch("status") || "published"

   const onSubmit = async (values: EducationFormValues) => {
      const cleanedHighlights = highlights.map((h) => h.trim()).filter(Boolean)

      const payload: EducationFormValues = {
         ...values,
         highlights: cleanedHighlights,
         skillIds: selectedSkills,
      }

      startTransition(async () => {
         try {
            const result =
               isEditing && initialData?.id
                  ? await updateEducationAction(initialData.id, payload)
                  : await createEducationAction(payload)

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
               title: isEditing ? "Education updated" : "Education created",
               description: `"${payload.degree}" was ${isEditing ? "updated" : "created"} successfully.`,
            })

            router.push("/console/education")
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
            const result = await deleteEducationAction(initialData.id!)
            if (result.success) {
               setShowDeleteDialog(false)
               toast.add({
                  type: "success",
                  title: "Education deleted",
                  description: `"${initialData.degree || "Qualification"}" was deleted successfully.`,
               })
               router.push("/console/education")
               router.refresh()
            } else {
               toast.add({
                  type: "error",
                  title: "Delete failed",
                  description: result.error || "Could not delete education record.",
               })
            }
         } catch (err: unknown) {
            toast.add({
               type: "error",
               title: "Delete failed",
               description: err instanceof Error ? err.message : "Failed to delete education record",
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
                  href="/console/education"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
               >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Education</span>
               </Link>
               <Separator orientation="vertical" className="h-4 my-auto" />
               <h1 className="text-base sm:text-lg font-semibold text-foreground truncate max-w-xs sm:max-w-md">
                  {isEditing ? `Edit: ${initialData?.degree}` : "New Qualification"}
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
                        <span>{isEditing ? "Update Qualification" : "Create Qualification"}</span>
                     </>
                  )}
               </Button>
            </div>
         </div>

         {/* Section 1: Qualification Details */}
         <section className="space-y-6">
            <div>
               <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                  Qualification Details
               </h2>
               <p className="text-sm text-muted-foreground mt-0.5">
                  Degree or certification title, institution, field of study, and honors.
               </p>
            </div>

            <div className="space-y-6">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                     <Label className="text-xs font-medium">
                        Degree / Qualification Title <span className="text-destructive">*</span>
                     </Label>
                     <Input
                        type="text"
                        placeholder="e.g. Bachelor of Technology (B.Tech)"
                        {...register("degree")}
                        className={errors.degree ? "border-destructive focus-visible:ring-destructive" : ""}
                     />
                     {errors.degree && (
                        <p className="text-xs text-destructive font-medium">{errors.degree.message}</p>
                     )}
                  </div>

                  <div className="space-y-2">
                     <Label className="text-xs font-medium">
                        Institution / Issuing Body <span className="text-destructive">*</span>
                     </Label>
                     <Input
                        type="text"
                        placeholder="e.g. Punjab Technical University or Amazon Web Services"
                        {...register("institution")}
                        className={errors.institution ? "border-destructive focus-visible:ring-destructive" : ""}
                     />
                     {errors.institution && (
                        <p className="text-xs text-destructive font-medium">{errors.institution.message}</p>
                     )}
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                     <Label className="text-xs font-medium">Field of Study / Major</Label>
                     <Input
                        type="text"
                        placeholder="e.g. Computer Science & Engineering"
                        {...register("fieldOfStudy")}
                        className={errors.fieldOfStudy ? "border-destructive focus-visible:ring-destructive" : ""}
                     />
                     {errors.fieldOfStudy && (
                        <p className="text-xs text-destructive font-medium">{errors.fieldOfStudy.message}</p>
                     )}
                  </div>

                  <div className="space-y-2">
                     <Label className="text-xs font-medium">Credential Type</Label>
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
                           {EDUCATION_TYPES.map((t) => (
                              <SelectItem key={t.value} value={t.value}>
                                 {t.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="space-y-2">
                     <Label className="text-xs font-medium">
                        Period / Year <span className="text-destructive">*</span>
                     </Label>
                     <Input
                        type="text"
                        placeholder="e.g. 2015 — 2019 or Issued 2023"
                        {...register("period")}
                        className={errors.period ? "border-destructive focus-visible:ring-destructive" : ""}
                     />
                     {errors.period && (
                        <p className="text-xs text-destructive font-medium">{errors.period.message}</p>
                     )}
                  </div>

                  <div className="space-y-2">
                     <Label className="text-xs font-medium">
                        Location <span className="text-destructive">*</span>
                     </Label>
                     <Input
                        type="text"
                        placeholder="e.g. Punjab, India or Online / Global"
                        {...register("location")}
                        className={errors.location ? "border-destructive focus-visible:ring-destructive" : ""}
                     />
                     {errors.location && (
                        <p className="text-xs text-destructive font-medium">{errors.location.message}</p>
                     )}
                  </div>

                  <div className="space-y-2">
                     <Label className="text-xs font-medium">Grade / Distinction</Label>
                     <Input
                        type="text"
                        placeholder="e.g. First Class with Distinction"
                        {...register("grade")}
                        className={errors.grade ? "border-destructive focus-visible:ring-destructive" : ""}
                     />
                     {errors.grade && (
                        <p className="text-xs text-destructive font-medium">{errors.grade.message}</p>
                     )}
                  </div>

                  <div className="space-y-2">
                     <Label className="text-xs font-medium">Publication Status</Label>
                     <Select
                        value={currentStatus}
                        onValueChange={(val) => {
                           if (val === "published" || val === "draft") {
                              setValue("status", val)
                           }
                        }}
                     >
                        <SelectTrigger className="w-full">
                           <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                           {STATUS_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                 {opt.label}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               <div className="space-y-2">
                  <Label className="text-xs font-medium">
                     Overview & Academic Focus <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                     rows={3}
                     placeholder="Detailed description of the program, core competencies, research thesis, or certification scope..."
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

         {/* Section 2: Key Modules & Highlights */}
         <section className="space-y-6">
            <StringListEditor
               title="Key Coursework & Highlights"
               description="Specific coursework, honors, senior capstone, or key domains covered."
               items={highlights}
               onChange={setHighlights}
               placeholder="e.g. Capstone Project: High-throughput distributed task scheduler..."
               addButtonLabel="Add Highlight"
            />
         </section>

         <Separator />

         {/* Section 3: Associated Technologies & Skills */}
         <section className="space-y-6">
            <div>
               <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                  Associated Technologies & Skills
               </h2>
               <p className="text-sm text-muted-foreground mt-0.5">
                  Tag technical skills acquired, practiced, or certified during this course of study.
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
               href="/console/education"
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
                     <span>{isEditing ? "Save Changes" : "Create Qualification"}</span>
                  </>
               )}
            </Button>
         </div>

         {/* Delete Confirmation Modal */}
         <ConfirmDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            title="Delete Education Record"
            itemName={initialData?.degree}
            variant="destructive"
            confirmText="Delete Education"
            isPending={isLoading}
            onConfirm={handleDelete}
         />
      </form>
   )
}

export default EducationForm
