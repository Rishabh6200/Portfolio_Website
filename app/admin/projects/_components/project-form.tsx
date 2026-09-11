"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, Sparkles, FileCode, ClipboardPaste } from "lucide-react"
import { toast } from "sonner"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MediaUploader } from "./media-uploader"
import { GalleryUploader } from "./gallery-uploader"
import { SkillSelector, type AvailableSkill } from "./skill-selector"
import {
  createProjectAction,
  updateProjectAction,
} from "../actions"
import { type ProjectFormData } from "../schema"

const STATUS_OPTIONS = [
  { value: "published", label: "Published (Visible on site)" },
  { value: "draft", label: "Draft (Admin only)" },
]

interface ProjectFormProps {
  initialData?: any
  isEditing?: boolean
  availableSkills?: AvailableSkill[]
}

export function ProjectForm({
  initialData,
  isEditing = false,
  availableSkills = [],
}: ProjectFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Form states
  const [title, setTitle] = useState(initialData?.title || "")
  const [slug, setSlug] = useState(initialData?.slug || "")
  const [isAutoSlug, setIsAutoSlug] = useState(!isEditing)
  const [tagline, setTagline] = useState(initialData?.tagline || "")
  const [role, setRole] = useState(initialData?.role || "Full-Stack Developer")
  const [description, setDescription] = useState(initialData?.description || "")

  // Skills: array of skill IDs
  const initialSkillIds = (initialData?.skills || []).map((s: any) =>
    typeof s === "object" && s?._id ? s._id : String(s)
  )
  const [skills, setSkills] = useState<string[]>(initialSkillIds)

  // Media
  const [logo, setLogo] = useState(initialData?.logo || "")
  const [images, setImages] = useState<string[]>(
    initialData?.images || (initialData?.coverImage ? [initialData.coverImage] : [])
  )

  // Links
  const [liveUrl, setLiveUrl] = useState(initialData?.liveUrl || "")
  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl || "")

  // Settings
  const [featured, setFeatured] = useState<boolean>(Boolean(initialData?.featured))
  const [status, setStatus] = useState<"published" | "draft">(
    initialData?.status || "published"
  )

  // Quick JSON / String Import State
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [importString, setImportString] = useState("")

  function handleApplyImport() {
    if (!importString.trim()) {
      toast.error("Please paste a JSON string first")
      return
    }

    try {
      const data = JSON.parse(importString.trim())
      if (!data || typeof data !== "object") {
        throw new Error("Input must be a valid JSON object")
      }

      if (typeof data.title === "string" && data.title.trim()) {
        setTitle(data.title.trim())
        if (isAutoSlug) {
          setSlug(
            (typeof data.slug === "string" && data.slug.trim()) ||
              data.title
                .toLowerCase()
                .trim()
                .replace(/[\s\W-]+/g, "-")
                .replace(/^-+|-+$/g, "")
          )
        }
      }

      if (typeof data.slug === "string" && data.slug.trim()) {
        setSlug(data.slug.trim())
        setIsAutoSlug(false)
      }

      if (typeof data.tagline === "string" && data.tagline.trim()) {
        setTagline(data.tagline.trim())
      }

      if (typeof data.role === "string" && data.role.trim()) {
        setRole(data.role.trim())
      }

      if (typeof data.description === "string" && data.description.trim()) {
        setDescription(data.description.trim())
      }

      if (typeof data.liveUrl === "string") {
        setLiveUrl(data.liveUrl.trim())
      }

      if (typeof data.githubUrl === "string") {
        setGithubUrl(data.githubUrl.trim())
      }

      if (typeof data.logo === "string") {
        setLogo(data.logo.trim())
      }

      if (Array.isArray(data.images)) {
        setImages(data.images.map((img: unknown) => String(img).trim()).filter(Boolean))
      }

      if (typeof data.featured === "boolean") {
        setFeatured(data.featured)
      }

      if (data.status === "published" || data.status === "draft") {
        setStatus(data.status)
      }

      // Handle skills array if provided (matches skill names or ObjectIds)
      if (Array.isArray(data.skills) && data.skills.length > 0) {
        const resolvedSkillIds: string[] = []
        data.skills.forEach((rawSkill: unknown) => {
          const strVal = String(rawSkill).trim().toLowerCase()
          const match = availableSkills.find(
            (s) =>
              s._id.toLowerCase() === strVal ||
              s.name.toLowerCase() === strVal
          )
          if (match && !resolvedSkillIds.includes(match._id)) {
            resolvedSkillIds.push(match._id)
          } else if (typeof rawSkill === "string" && rawSkill.length === 24) {
            if (!resolvedSkillIds.includes(rawSkill)) {
              resolvedSkillIds.push(rawSkill)
            }
          }
        })

        if (resolvedSkillIds.length > 0) {
          setSkills((prev) => Array.from(new Set([...prev, ...resolvedSkillIds])))
        }
      }

      toast.success("Successfully imported and populated project fields!")
      setIsImportOpen(false)
      setImportString("")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to parse JSON"
      toast.error(msg)
    }
  }

  function handleInsertTemplate() {
    const sample = {
      title: "CloudPulse — Distributed API Gateway",
      slug: "cloudpulse-api-gateway",
      role: "Full-Stack Developer",
      tagline: "High-throughput distributed API gateway with sub-millisecond route dispatch",
      description: "Designed and implemented a distributed microservices gateway handling high concurrency with Redis rate limiting, pub/sub streaming, and Docker orchestration.",
      skills: availableSkills.slice(0, 4).map((s) => s.name),
      liveUrl: "https://cloudpulse.example.com",
      githubUrl: "https://github.com/username/cloudpulse",
      featured: true,
      status: "published",
    }
    setImportString(JSON.stringify(sample, null, 2))
  }

  function handleTitleChange(newTitle: string) {
    setTitle(newTitle)
    if (isAutoSlug) {
      setSlug(
        newTitle
          .toLowerCase()
          .trim()
          .replace(/[\s\W-]+/g, "-")
          .replace(/^-+|-+$/g, "")
      )
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      toast.error("Project title is required")
      return
    }

    if (!slug.trim()) {
      toast.error("URL slug is required")
      return
    }

    if (!tagline.trim()) {
      toast.error("Tagline is required")
      return
    }

    if (!description.trim()) {
      toast.error("Description is required")
      return
    }

    const payload: ProjectFormData = {
      title: title.trim(),
      slug: slug.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      role: role.trim() || "Full-Stack Developer",
      skills,
      logo: logo.trim(),
      images,
      liveUrl: liveUrl.trim(),
      githubUrl: githubUrl.trim(),
      featured,
      status,
      ...(isEditing && initialData?.order !== undefined ? { order: initialData.order } : {}),
    }

    startTransition(async () => {
      if (isEditing && initialData?._id) {
        const res = await updateProjectAction(initialData._id, payload)
        if (res.success) {
          toast.success("Project updated successfully!")
          router.push("/admin")
        } else {
          toast.error(res.error || "Failed to update project")
        }
      } else {
        const res = await createProjectAction(payload)
        if (res.success) {
          toast.success("Project created successfully!")
          router.push("/admin")
        } else {
          toast.error(res.error || "Failed to create project")
        }
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-10 pb-16">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Projects</span>
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-base sm:text-lg font-semibold text-foreground truncate max-w-xs sm:max-w-md">
            {isEditing ? `Edit: ${initialData?.title || "Project"}` : "New Project"}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsImportOpen(true)}
            className="gap-1.5 text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10 cursor-pointer"
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>Import Data</span>
          </Button>

          <Link
            href="/admin"
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
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. CloudPulse — Distributed API Gateway"
              required
            />
          </div>

          {/* URL Slug */}
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
                {isAutoSlug ? "Manual Slug" : "Auto Slug"}
              </button>
            </div>
            <div className="flex items-center rounded-lg border border-input px-3 bg-muted/20 focus-within:ring-2 focus-within:ring-ring/50">
              <span className="text-xs font-mono text-muted-foreground select-none">
                /projects/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setIsAutoSlug(false)
                  setSlug(e.target.value)
                }}
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
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the system, problem it solves, architecture decisions, and business impact..."
              required
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Publication Status</Label>
            <Select
              value={status}
              onValueChange={(val) => {
                if (val === "published" || val === "draft") {
                  setStatus(val)
                }
              }}
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
                checked={featured}
                onCheckedChange={setFeatured}
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

        <SkillSelector
          availableSkills={availableSkills}
          selectedSkillIds={skills}
          onChange={setSkills}
        />
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
          <MediaUploader
            label="Project Logo"
            description="Upload or paste image URL for logo"
            value={logo}
            onChange={setLogo}
            aspectRatio="square"
            projectSlug={slug}
          />
        </div>

        {/* Gallery Images */}
        <div className="space-y-3 pt-4 border-t border-border">
          <Label className="text-sm font-medium">Showcase Gallery Images</Label>
          <p className="text-xs text-muted-foreground">
            Upload project screenshots, mockups, or UI walkthroughs. The first image serves as the main showcase card image.
          </p>
          <GalleryUploader images={images} onChange={setImages} projectSlug={slug} />
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
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">GitHub Repository URL</Label>
            <Input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username/project"
            />
          </div>
        </div>
      </section>

      {/* Bottom Save Button */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
        <Link
          href="/admin"
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

      {/* Quick Import String / JSON Dialog */}
      <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg flex items-center gap-2 font-semibold">
              <FileCode className="h-4 w-4 text-indigo-500" />
              <span>Import Project Data (JSON / String)</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Paste a raw JSON object string to auto-fill the project fields and match linked skills.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">
                Paste JSON String:
              </Label>
              <button
                type="button"
                onClick={handleInsertTemplate}
                className="text-xs text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer flex items-center gap-1 font-medium"
              >
                <Sparkles className="h-3 w-3" />
                <span>Load Sample Template</span>
              </button>
            </div>

            <Textarea
              rows={9}
              value={importString}
              onChange={(e) => setImportString(e.target.value)}
              placeholder={`{\n  "title": "CloudPulse — Distributed API Gateway",\n  "tagline": "High-throughput distributed API gateway",\n  "role": "Full-Stack Developer",\n  "description": "Architected distributed system with Redis & Docker...",\n  "skills": ["React", "TypeScript", "Docker"],\n  "liveUrl": "https://example.com",\n  "githubUrl": "https://github.com/..."\n}`}
              className="font-mono text-xs"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setIsImportOpen(false)
                setImportString("")
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleApplyImport}
              className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <ClipboardPaste className="h-3.5 w-3.5" />
              <span>Apply & Populate Form</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  )
}
