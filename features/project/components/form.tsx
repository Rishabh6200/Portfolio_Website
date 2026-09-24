"use client";

import { FC, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from '@bprogress/next/app'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Globe, Loader2, Save, Sparkles, FolderGit2, RefreshCw, Trash2 } from 'lucide-react'

import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form'

import SkillSelector, { SkillSelectorItem } from '@/components/common/skill-selector'
import LogoUploader from '@/features/project/components/logo-uploader'
import GalleryUploader from '@/features/project/components/gallery-uploader'
import ConfirmDialog from '@/components/dialogs/confirm-dialog'
import { projectSchema, type ProjectFormValues } from '../schema'
import { createProjectAction, updateProjectAction, deleteProjectAction } from '../actions'

const STATUS_OPTIONS = [
   { value: "published", label: "Published (Visible on site)" },
   { value: "draft", label: "Draft (Admin only)" },
] as const

interface InitialProjectData {
   id?: string
   title?: string
   slug?: string
   role?: string
   tagline?: string
   description?: string
   status?: string
   featured?: boolean
   logo?: string
   images?: readonly string[] | string[]
   liveUrl?: string
   githubUrl?: string
   skills?: unknown[]
   [key: string]: unknown
}

interface ProjectFormProps {
   initialData?: InitialProjectData
   isEditing?: boolean
   availableSkills?: SkillSelectorItem[]
}

const generateSlug = (val: string) => {
   return val
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "")
}

const ProjectForm: FC<ProjectFormProps> = ({
   initialData,
   isEditing = false,
   availableSkills = [],
}) => {
   const router = useRouter()
   const [isAutoSlug, setIsAutoSlug] = useState(!initialData?.slug)
   const [showDeleteDialog, setShowDeleteDialog] = useState(false)
   const [isDeleting, startDeleteTransition] = useTransition()

   // Extract initial skill IDs
   const initialSkillIds: string[] = (() => {
      if (!initialData?.skills || !Array.isArray(initialData.skills)) return []
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
   })()

   const form = useForm<ProjectFormValues>({
      resolver: zodResolver(projectSchema),
      defaultValues: {
         title: initialData?.title || "",
         slug: initialData?.slug || "",
         role: initialData?.role || "Full-Stack Developer",
         tagline: initialData?.tagline || "",
         description: initialData?.description || "",
         status: (initialData?.status?.toLowerCase() as "published" | "draft") || "published",
         featured: Boolean(initialData?.featured),
         logo: initialData?.logo || "",
         images: Array.isArray(initialData?.images) ? initialData.images.map(String) : [],
         skillIds: initialSkillIds,
         liveUrl: initialData?.liveUrl || "",
         githubUrl: initialData?.githubUrl || "",
      },
   })

   const { isSubmitting } = form.formState
   const watchedTitle = useWatch({ control: form.control, name: "title" })
   const watchedSlug = useWatch({ control: form.control, name: "slug" })
   const activeSlug = watchedSlug?.trim() || generateSlug(watchedTitle || "")

   const handleRequireTitle = () => {
      toast.add({
         type: "warning",
         title: "Project Title Required",
         description: "Please enter a project title before uploading media.",
      })
      form.setFocus("title")
   }

   // Handle title input with auto-slug sync
   const handleTitleChange = (newTitle: string) => {
      form.setValue("title", newTitle, { shouldValidate: true })
      if (isAutoSlug) {
         form.setValue("slug", generateSlug(newTitle), { shouldValidate: true })
      }
   }

   const handleSlugChange = (newSlug: string) => {
      form.setValue("slug", newSlug, { shouldValidate: true })
      setIsAutoSlug(false)
   }

   const handleRegenerateSlug = () => {
      const currentTitle = form.getValues("title")
      form.setValue("slug", generateSlug(currentTitle), { shouldValidate: true })
      setIsAutoSlug(true)
   }

   const handleDeleteProject = () => {
      const projectId = initialData?.id
      if (!projectId) return

      startDeleteTransition(async () => {
         try {
            const result = await deleteProjectAction(projectId)
            if (result.success) {
               setShowDeleteDialog(false)
               toast.add({
                  type: "success",
                  title: "Project deleted",
                  description: `"${initialData.title || "Project"}" was deleted successfully.`,
               })
               router.push("/console/projects")
               router.refresh()
            } else {
               toast.add({
                  type: "error",
                  title: "Delete failed",
                  description: result.error || "Could not delete project.",
               })
            }
         } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Failed to delete project"
            toast.add({
               type: "error",
               title: "Delete failed",
               description: message,
            })
         }
      })
   }

   const onSubmit = async (values: ProjectFormValues) => {
      try {
         const result =
            isEditing && initialData?.id
               ? await updateProjectAction(initialData.id, values)
               : await createProjectAction(values)

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
            title: isEditing ? "Project updated" : "Project created",
            description: `"${values.title}" was ${isEditing ? "updated" : "created"} successfully.`,
         })

         router.push("/console/projects")
      } catch (err: unknown) {
         toast.add({
            type: "error",
            title: "Error",
            description: err instanceof Error ? err.message : "An unexpected error occurred while saving the project.",
         })
      }
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="w-full space-y-10 pb-16">
            {/* Top Header Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
               <div className="flex items-center gap-3">
                  <Link
                     href="/console/projects"
                     className={buttonVariants({ variant: "outline", size: "sm" })}
                  >
                     <ArrowLeft className="h-4 w-4" />
                     <span>Back to Projects</span>
                  </Link>
                  <Separator orientation="vertical" className="h-4 my-auto data-vertical:self-center" />
                  <h1 className="text-base sm:text-lg font-semibold text-foreground truncate max-w-xs sm:max-w-md">
                     {isEditing ? `Edit: ${initialData?.title || "Project"}` : "New Project"}
                  </h1>
               </div>

               <div className="flex items-center gap-2.5">
                  <Button type="submit" size="sm" disabled={isSubmitting || isDeleting} className="gap-2 cursor-pointer">
                     {isSubmitting ? (
                        <>
                           <Loader2 className="h-4 w-4 animate-spin" />
                           <span>Saving...</span>
                        </>
                     ) : (
                        <>
                           <Save className="h-4 w-4" />
                           <span>{isEditing ? "Update Project" : "Create Project"}</span>
                        </>
                     )}
                  </Button>
               </div>
            </div>

            {/* Section 1: Basic Information with Logo on Top */}
            <section className="space-y-6">
               <div>
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">
                     Basic Information
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                     Project identity, branding logo, route slug, and visibility settings.
                  </p>
               </div>

               <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                  {/* Logo Uploader */}
                  <FormField
                     control={form.control}
                     name="logo"
                     render={({ field }) => (
                        <FormItem className="space-y-1.5 shrink-0 flex flex-col">
                           <FormLabel className="text-sm font-medium">Project Logo</FormLabel>
                           <FormControl>
                              <div className="size-28 sm:size-30 aspect-square">
                                 <LogoUploader
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={isSubmitting}
                                    projectSlug={activeSlug}
                                    onRequireTitle={handleRequireTitle}
                                    className="w-full h-full"
                                 />
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Right Column: 1st line title, 2nd line slug & role */}
                  <div className="flex-1 w-full space-y-3.5">
                     {/* 1st Line: Project Title */}
                     <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                           <FormItem className="space-y-1.5">
                              <FormLabel className="text-sm font-medium">
                                 Project Title <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="e.g. CloudPulse — Distributed API Gateway"
                                    disabled={isSubmitting}
                                    className="h-10 text-sm font-medium"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* 2nd Line: URL Slug (left) & Your Role (right) */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {/* URL Slug */}
                        <FormField
                           control={form.control}
                           name="slug"
                           render={({ field }) => (
                              <FormItem className="space-y-1.5">
                                 <div className="flex items-center justify-between">
                                    <FormLabel className="text-sm font-medium">
                                       URL Slug <span className="text-destructive">*</span>
                                    </FormLabel>
                                    {watchedTitle && (
                                       <button
                                          type="button"
                                          onClick={handleRegenerateSlug}
                                          title="Sync slug with title"
                                          disabled={isSubmitting}
                                          className="text-[11px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                                       >
                                          <RefreshCw className="size-3" />
                                          <span>Sync with title</span>
                                       </button>
                                    )}
                                 </div>
                                 <FormControl>
                                    <div className="flex items-center rounded-lg border border-input px-3 bg-muted/20 focus-within:ring-2 focus-within:ring-ring/50 h-10">
                                       <span className="text-xs font-mono text-muted-foreground select-none">
                                          /projects/
                                       </span>
                                       <input
                                          type="text"
                                          value={field.value}
                                          onChange={(e) => handleSlugChange(e.target.value)}
                                          placeholder="cloudpulse-api-gateway"
                                          disabled={isSubmitting}
                                          className="flex-1 bg-transparent text-sm font-mono text-foreground focus:outline-none ml-1 py-1.5"
                                       />
                                    </div>
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />

                        {/* Your Role */}
                        <FormField
                           control={form.control}
                           name="role"
                           render={({ field }) => (
                              <FormItem className="space-y-1.5">
                                 <FormLabel className="text-sm font-medium">
                                    Your Role <span className="text-destructive">*</span>
                                 </FormLabel>
                                 <FormControl>
                                    <Input
                                       {...field}
                                       placeholder="e.g. Full-Stack Developer"
                                       disabled={isSubmitting}
                                       className="h-10"
                                    />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>
                  </div>
               </div>

               {/* Remaining Fields: Tagline, Description, Status, Featured */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Tagline */}
                  <FormField
                     control={form.control}
                     name="tagline"
                     render={({ field }) => (
                        <FormItem className="space-y-2 sm:col-span-2">
                           <FormLabel className="text-sm font-medium">
                              Tagline (One-liner summary) <span className="text-destructive">*</span>
                           </FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 placeholder="e.g. High-throughput distributed API gateway with sub-millisecond route dispatch"
                                 disabled={isSubmitting}
                                 className="h-10"
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Description */}
                  <FormField
                     control={form.control}
                     name="description"
                     render={({ field }) => (
                        <FormItem className="space-y-2 sm:col-span-2">
                           <FormLabel className="text-sm font-medium">
                              Project Description <span className="text-destructive">*</span>
                           </FormLabel>
                           <FormControl>
                              <Textarea
                                 {...field}
                                 rows={4}
                                 placeholder="Describe the system architecture, problem it solves, key challenges, and results..."
                                 disabled={isSubmitting}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Publication Status */}
                  <FormField
                     control={form.control}
                     name="status"
                     render={({ field }) => (
                        <FormItem className="space-y-2">
                           <FormLabel className="text-sm font-medium">Publication Status</FormLabel>
                           <Select
                              value={field.value}
                              onValueChange={field.onChange}
                              items={STATUS_OPTIONS as unknown as { value: string; label: string }[]}
                           >
                              <FormControl>
                                 <SelectTrigger className="w-full h-10">
                                    <SelectValue placeholder="Select status">
                                       {(val) => {
                                          const opt = STATUS_OPTIONS.find((o) => o.value === val)
                                          return opt ? opt.label : "Select status"
                                       }}
                                    </SelectValue>
                                 </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                 {STATUS_OPTIONS.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value} label={opt.label}>
                                       {opt.label}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Featured Spotlight Toggle */}
                  <FormField
                     control={form.control}
                     name="featured"
                     render={({ field }) => (
                        <FormItem className="space-y-2">
                           <FormLabel htmlFor="featured-toggle" className="text-sm font-medium">
                              Featured Project
                           </FormLabel>
                           <div className="flex items-center justify-between rounded-lg border border-input px-3.5 h-10 bg-muted/20 transition-colors hover:bg-muted/30">
                              <label
                                 htmlFor="featured-toggle"
                                 className="flex items-center gap-2 cursor-pointer select-none flex-1 pr-2 min-w-0"
                              >
                                 <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                                 <span className="text-xs text-muted-foreground truncate">
                                    Spotlight on homepage hero & grid
                                 </span>
                              </label>
                              <FormControl>
                                 <Switch
                                    id="featured-toggle"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={isSubmitting}
                                    aria-label="Feature this project"
                                 />
                              </FormControl>
                           </div>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
            </section>

            <Separator />

            {/* Section 2: Technologies & Skills */}
            <section className="space-y-4">
               <FormField
                  control={form.control}
                  name="skillIds"
                  render={({ field }) => (
                     <FormItem className="space-y-4">
                        <div>
                           <FormLabel className="text-xl font-semibold tracking-tight text-foreground block">
                              Technologies & Skills
                           </FormLabel>
                           <p className="text-sm text-muted-foreground mt-1">
                              Pick technologies directly from your database Skill collection.
                           </p>
                        </div>
                        <FormControl>
                           <SkillSelector
                              availableSkills={availableSkills}
                              selectedSkillIds={field.value}
                              onChange={field.onChange}
                              disabled={isSubmitting}
                              name="skillIds"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </section>

            <Separator />

            {/* Section 3: Project Showcase Gallery */}
            <section className="space-y-4">
               <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                     <FormItem className="space-y-4">
                        <div>
                           <FormLabel className="text-xl font-semibold tracking-tight text-foreground block">
                              Project Showcase Gallery
                           </FormLabel>
                           <p className="text-sm text-muted-foreground mt-1">
                              Upload project screenshots, mockups, or UI walkthroughs. The first image serves as the main cover hero.
                           </p>
                        </div>
                        <FormControl>
                           <GalleryUploader
                              images={field.value}
                              onChange={field.onChange}
                              name="images"
                              maxImages={10}
                              disabled={isSubmitting}
                              projectSlug={activeSlug}
                              onRequireTitle={handleRequireTitle}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </section>

            <Separator />

            {/* Section 4: External Links */}
            <section className="space-y-6">
               <div>
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">
                     External Links
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                     Optional production deployment and source code repository links.
                  </p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <FormField
                     control={form.control}
                     name="liveUrl"
                     render={({ field }) => (
                        <FormItem className="space-y-2">
                           <FormLabel className="text-sm font-medium flex items-center gap-1.5">
                              <Globe className="size-3.5 text-muted-foreground" />
                              <span>Live Demo URL</span>
                           </FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 type="url"
                                 placeholder="https://example.com"
                                 disabled={isSubmitting}
                                 className="h-10 font-mono text-xs"
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="githubUrl"
                     render={({ field }) => (
                        <FormItem className="space-y-2">
                           <FormLabel className="text-sm font-medium flex items-center gap-1.5">
                              <FolderGit2 className="size-3.5 text-muted-foreground" />
                              <span>GitHub Repository URL</span>
                           </FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 type="url"
                                 placeholder="https://github.com/username/project"
                                 disabled={isSubmitting}
                                 className="h-10 font-mono text-xs"
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
            </section>

            {/* Bottom Save / Action Bar */}
            <div className="flex items-center justify-between gap-3 pt-6 border-t border-border">
               {isEditing && initialData?.id ? (
                  <Button
                     type="button"
                     variant="destructive"
                     size="default"
                     disabled={isSubmitting || isDeleting}
                     onClick={() => setShowDeleteDialog(true)}
                     className="gap-2 cursor-pointer"
                  >
                     <Trash2 className="h-4 w-4" />
                     <span>Delete Project</span>
                  </Button>
               ) : (
                  <div />
               )}

               <div className="flex items-center gap-3">
                  <Link
                     href="/console/projects"
                     className={buttonVariants({ variant: "outline", size: "default" })}
                  >
                     Cancel
                  </Link>
                  <Button type="submit" size="default" disabled={isSubmitting || isDeleting} className="gap-2 cursor-pointer">
                     {isSubmitting ? (
                        <>
                           <Loader2 className="h-4 w-4 animate-spin" />
                           <span>Saving...</span>
                        </>
                     ) : (
                        <>
                           <Save className="h-4 w-4" />
                           <span>{isEditing ? "Save Changes" : "Publish Project"}</span>
                        </>
                     )}
                  </Button>
               </div>
            </div>
         </form>

         {isEditing && initialData?.id && (
            <ConfirmDialog
               open={showDeleteDialog}
               onOpenChange={setShowDeleteDialog}
               title="Delete Project"
               itemName={initialData.title}
               variant="destructive"
               confirmText="Delete"
               isPending={isDeleting}
               onConfirm={handleDeleteProject}
            />
         )}
      </Form>
   )
}

export default ProjectForm