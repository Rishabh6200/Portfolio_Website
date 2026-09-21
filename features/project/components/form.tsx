"use client";
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Loader2, Save, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { FC, useTransition } from 'react'

const STATUS_OPTIONS = [
   { value: "published", label: "Published (Visible on site)" },
   { value: "draft", label: "Draft (Admin only)" },
]

interface InitialProjectData {
   id?: string
   title?: string
   slug?: string
   role?: string
   tagline?: string
   description?: string
   status?: string
   featured?: boolean
   liveUrl?: string
   githubUrl?: string
   [key: string]: unknown
}

interface ProjectFormProps {
   initialData?: InitialProjectData
   isEditing?: boolean
   // availableSkills?: AvailableSkill[]
}

const ProjectForm: FC<ProjectFormProps> = ({ initialData, isEditing = false }) => {
   const [isPending] = useTransition()

   return (
      <form className="w-full space-y-10 pb-16">
         {/* Top Action Bar */}
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
               <Link
                  href="/console/projects"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
               >
                  Cancel
               </Link>
               <Button type="submit" size="sm" disabled={isPending} className="gap-2">
                  {isPending ? (
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

         {/* Section 1: Basic Information */}
         <section className="space-y-6">
            <div>
               <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Basic Information
               </h2>
               <p className="text-sm text-muted-foreground mt-1">
                  Project name, route slug, role, and visibility settings.
               </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               {/* Project Title */}
               <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-medium">
                     Project Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                     type="text"
                     name="title"
                     defaultValue={initialData?.title}
                     placeholder="e.g. CloudPulse — Distributed API Gateway"
                     required
                  />
               </div>

               {/* URL Slug */}
               <div className="space-y-2">
                  <Label className="text-sm font-medium">
                     URL Slug <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex items-center rounded-lg border border-input px-3 bg-muted/20 focus-within:ring-2 focus-within:ring-ring/50">
                     <span className="text-xs font-mono text-muted-foreground select-none">
                        /projects/
                     </span>
                     <input
                        type="text"
                        name="slug"
                        defaultValue={initialData?.slug}
                        placeholder="cloudpulse-api-gateway"
                        required
                        className="flex-1 bg-transparent text-sm font-mono text-foreground focus:outline-none ml-1 py-1.5"
                     />
                  </div>
               </div>

               {/* Role */}
               <div className="space-y-2">
                  <Label className="text-sm font-medium">
                     Your Role <span className="text-destructive">*</span>
                  </Label>
                  <Input
                     type="text"
                     name="role"
                     defaultValue={initialData?.role || "Full-Stack Developer"}
                     placeholder="e.g. Full-Stack Developer"
                     required
                  />
               </div>

               {/* Tagline */}
               <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-medium">
                     Tagline (One-liner summary) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                     type="text"
                     name="tagline"
                     defaultValue={initialData?.tagline}
                     placeholder="e.g. High-throughput distributed API gateway with sub-millisecond route dispatch"
                     required
                  />
               </div>

               {/* Description */}
               <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm font-medium">
                     Project Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                     rows={4}
                     name="description"
                     defaultValue={initialData?.description}
                     placeholder="Describe the system, problem it solves, architecture decisions, and business impact..."
                     required
                  />
               </div>

               {/* Status */}
               <div className="space-y-2">
                  <Label className="text-sm font-medium">Publication Status</Label>
                  <Select
                     name="status"
                     defaultValue={initialData?.status?.toLowerCase() || "published"}
                     items={STATUS_OPTIONS}
                  >
                     <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status">
                           {(val) => {
                              const opt = STATUS_OPTIONS.find((o) => o.value === val)
                              return opt ? opt.label : "Select status"
                           }}
                        </SelectValue>
                     </SelectTrigger>
                     <SelectContent>
                        {STATUS_OPTIONS.map((opt) => (
                           <SelectItem key={opt.value} value={opt.value} label={opt.label}>
                              {opt.label}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

               {/* Featured Toggle */}
               <div className="space-y-2">
                  <Label htmlFor="featured-toggle" className="text-sm font-medium">Featured Project</Label>
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
                     <Switch
                        id="featured-toggle"
                        name="featured"
                        defaultChecked={initialData?.featured}
                        aria-label="Feature this project"
                     />
                  </div>
               </div>
            </div>
         </section>

         <Separator />

         {/* Section 2: Skills & Technologies (From Skill Collection) */}
         <section className="space-y-4">
            <div>
               <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Technologies & Skills
               </h2>
               <p className="text-sm text-muted-foreground mt-1">
                  Pick technologies directly from your database Skill collection.
               </p>
            </div>

            {/* <SkillSelector
               availableSkills={availableSkills}
               selectedSkillIds={skills}
               onChange={setSkills}
            /> */}
         </section>

         <Separator />

         {/* Section 3: Media (Logo + Gallery Images) */}
         <section className="space-y-6">
            <div>
               <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Project Media
               </h2>
               <p className="text-sm text-muted-foreground mt-1">
                  Upload the project logo and multiple showcase screenshots/gallery images.
               </p>
            </div>

            {/* Logo */}
            <div className="space-y-3">
               <Label className="text-sm font-medium">Project Logo / Icon (Optional)</Label>
               <p className="text-xs text-muted-foreground">
                  A square icon or brand logo shown in the admin table and project headers.
               </p>
               {/* <MediaUploader
                  label="Project Logo"
                  description="Upload or paste image URL for logo"
                  value={logo}
                  onChange={setLogo}
                  aspectRatio="square"
                  projectSlug={slug}
               /> */}
            </div>

            {/* Gallery Images */}
            <div className="space-y-3 pt-4 border-t border-border">
               <Label className="text-sm font-medium">Showcase Gallery Images</Label>
               <p className="text-xs text-muted-foreground">
                  Upload project screenshots, mockups, or UI walkthroughs. The first image serves as the main showcase card image.
               </p>
               {/* <GalleryUploader images={images} onChange={setImages} projectSlug={slug} /> */}
            </div>
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
               <div className="space-y-2">
                  <Label className="text-sm font-medium">Live Demo URL</Label>
                  <Input
                     type="url"
                     name="liveUrl"
                     defaultValue={initialData?.liveUrl}
                     placeholder="https://example.com"
                  />
               </div>

               <div className="space-y-2">
                  <Label className="text-sm font-medium">GitHub Repository URL</Label>
                  <Input
                     type="url"
                     name="githubUrl"
                     defaultValue={initialData?.githubUrl}
                     placeholder="https://github.com/username/project"
                  />
               </div>
            </div>
         </section>

         {/* Bottom Save Button */}
         <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
            <Link
               href="/console/projects"
               className={buttonVariants({ variant: "outline", size: "default" })}
            >
               Cancel
            </Link>
            <Button type="submit" size="default" disabled={isPending} className="gap-2">
               {isPending ? (
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
      </form>
   )
}

export default ProjectForm