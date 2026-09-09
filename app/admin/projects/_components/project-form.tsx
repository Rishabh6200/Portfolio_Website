"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from "lucide-react"
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
import { MediaUploader } from "./media-uploader"
import { TechStackInput } from "./tech-stack-input"
import {
  createProjectAction,
  updateProjectAction,
  ProjectFormData,
} from "../actions"

export interface CategoryOption {
  _id?: string
  name: string
  slug?: string
}

interface ProjectFormProps {
  initialData?: ProjectFormData & { _id?: string }
  isEditing?: boolean
  categories?: CategoryOption[]
}

const DEFAULT_CATEGORIES: string[] = [
  "Full-Stack",
  "Backend APIs",
  "Web Apps",
]

const ACCENT_PRESETS = [
  "#6366f1", // Indigo
  "#06b6d4", // Cyan
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#8b5cf6", // Violet
  "#3b82f6", // Blue
  "#14b8a6", // Teal
]

export function ProjectForm({
  initialData,
  isEditing = false,
  categories = [],
}: ProjectFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const availableCategories =
    categories && categories.length > 0
      ? categories.map((c) => c.name)
      : DEFAULT_CATEGORIES

  const [title, setTitle] = useState(initialData?.title || "")
  const [slug, setSlug] = useState(initialData?.slug || "")
  const [isAutoSlug, setIsAutoSlug] = useState(!isEditing)
  const [tagline, setTagline] = useState(initialData?.tagline || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [category, setCategory] = useState<string>(
    initialData?.category || availableCategories[0] || "Full-Stack"
  )
  const [role, setRole] = useState(initialData?.role || "Full-Stack Engineer")
  const [timeline, setTimeline] = useState(initialData?.timeline || "Recent")
  const [accentColor, setAccentColor] = useState(initialData?.accentColor || "#6366f1")
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || "")
  const [architectureDiagram, setArchitectureDiagram] = useState(
    initialData?.architectureDiagram || ""
  )
  const [technologies, setTechnologies] = useState<string[]>(
    initialData?.technologies || ["NestJS", "React", "TypeScript"]
  )
  const [highlights, setHighlights] = useState<string[]>(
    initialData?.highlights || ["High-throughput architecture designed for zero downtime."]
  )
  const [architectureOverview, setArchitectureOverview] = useState(
    initialData?.architectureOverview || ""
  )
  const [challenge, setChallenge] = useState(initialData?.challenge || "")
  const [solution, setSolution] = useState(initialData?.solution || "")
  const [liveUrl, setLiveUrl] = useState(initialData?.liveUrl || "")
  const [githubUrl, setGithubUrl] = useState(initialData?.githubUrl || "")
  const featured = Boolean(initialData?.featured)
  const [status, setStatus] = useState<"published" | "draft">(
    initialData?.status || "published"
  )
  const [order, setOrder] = useState<number>(initialData?.order || 0)

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

  function handleAddHighlight() {
    setHighlights([...highlights, ""])
  }

  function handleHighlightChange(index: number, val: string) {
    const next = [...highlights]
    next[index] = val
    setHighlights(next)
  }

  function handleRemoveHighlight(index: number) {
    setHighlights(highlights.filter((_, i) => i !== index))
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
      category,
      role: role.trim(),
      timeline: timeline.trim(),
      accentColor,
      coverImage: coverImage.trim(),
      architectureDiagram: architectureDiagram.trim(),
      technologies,
      highlights: highlights.filter((h) => h.trim().length > 0),
      architectureOverview: architectureOverview.trim(),
      challenge: challenge.trim(),
      solution: solution.trim(),
      liveUrl: liveUrl.trim(),
      githubUrl: githubUrl.trim(),
      featured,
      status,
      order,
    }

    startTransition(async () => {
      if (isEditing && initialData?._id) {
        const res = await updateProjectAction(initialData._id, payload)
        if (res.success) {
          toast.success("Project updated successfully!")
          router.push("/admin")
          router.refresh()
        } else {
          toast.error(res.error || "Failed to update project")
        }
      } else {
        const res = await createProjectAction(payload)
        if (res.success) {
          toast.success("Project created successfully!")
          router.push("/admin")
          router.refresh()
        } else {
          toast.error(res.error || "Failed to create project")
        }
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-10 pb-20">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-2 border-b border-border">
        <Link
          href="/admin"
          className={buttonVariants({ variant: "outline", size: "default" })}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Projects</span>
        </Link>

        <div className="flex items-center gap-3">
          <Select
            value={status}
            items={[
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
            ]}
            onValueChange={(val) => {
              if (val === "published" || val === "draft") {
                setStatus(val)
              }
            }}
          >
            <SelectTrigger className="h-9 min-w-32 bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published" label="Published">Published</SelectItem>
              <SelectItem value="draft" label="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" size="default" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{isEditing ? "Save Changes" : "Create Project"}</span>
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
            Core identity, URLs, and overview of this engineering case study.
          </p>
        </div>

        <div className="space-y-5">
          {/* Project Title */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Project Title <span className="text-destructive">*</span>
            </Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. CloudPulse API Gateway"
              required
            />
          </div>

          {/* Slug and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  {isAutoSlug ? "Switch to Custom Slug" : "Enable Auto-Slug"}
                </button>
              </div>
              <div className="flex items-center rounded-lg border border-input bg-transparent px-3 py-1 focus-within:ring-2 focus-within:ring-ring/50">
                <span className="text-sm font-mono text-muted-foreground select-none">/projects/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setIsAutoSlug(false)
                    setSlug(e.target.value)
                  }}
                  placeholder="e.g. cloudpulse-api-gateway"
                  required
                  className="flex-1 bg-transparent text-sm font-mono text-foreground focus:outline-none ml-1 py-1.5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Link
                  href="/admin/categories/new"
                  target="_blank"
                  className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer"
                >
                  + Manage Categories
                </Link>
              </div>
              <Select
                value={category}
                onValueChange={(val) => {
                  if (val) {
                    setCategory(val)
                  }
                }}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tagline */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Tagline (One-liner summary) <span className="text-destructive">*</span>
            </Label>
            <Input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Enterprise modular microservices gateway with JWT RBAC and BullMQ queues"
              required
            />
          </div>

          {/* Summary Description */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Summary Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a comprehensive summary of what this system does, how it works, and who it serves..."
              required
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Section 2: Role, Timeline & Display Order */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Role & Timeline
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Specify your technical capacity, timeline duration, and listing priority.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Your Role</Label>
            <Input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Lead Backend Architect"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Timeline / Duration</Label>
            <Input
              type="text"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="e.g. 5 Months (Q1 2025)"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Display Sort Order</Label>
            <Input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value) || 0)}
              placeholder="e.g. 1"
            />
            <p className="text-xs text-muted-foreground">Lower numbers appear first on the site.</p>
          </div>
        </div>
      </section>

      <Separator />

      {/* Section 3: Project Media (ImageKit) */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Project Media (ImageKit CDN)
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Upload images directly to ImageKit CDN or provide hosted media URLs.
          </p>
        </div>

        <div className="space-y-8">
          <MediaUploader
            label="Cover Image / Hero Banner"
            description="The primary showcase image presented on the portfolio gallery and project detail hero."
            value={coverImage}
            onChange={setCoverImage}
            aspectRatio="video"
          />

          <MediaUploader
            label="Architecture Diagram / System Flow (Optional)"
            description="Displayed prominently inside the technical deep dive section to showcase service topology."
            value={architectureDiagram}
            onChange={setArchitectureDiagram}
            aspectRatio="wide"
          />
        </div>
      </section>

      <Separator />

      {/* Section 4: Architecture & Deep Dive */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Architecture & Deep Dive
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Detailed engineering narrative covering topology, bottlenecks, and solutions.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Architecture Overview</Label>
            <Textarea
              rows={4}
              value={architectureOverview}
              onChange={(e) => setArchitectureOverview(e.target.value)}
              placeholder="Describe microservices communication, pub/sub pipelines, Redis caching layers, database indexing strategies..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Engineering Challenge</Label>
              <Textarea
                rows={4}
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                placeholder="What was the core bottleneck or technical challenge? (e.g. rate limiting spikes, concurrent transactions, memory limits)"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Implementation & Solution</Label>
              <Textarea
                rows={4}
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="How did you solve it? (e.g. sliding window algorithm in Redis, BullMQ workers with exponential backoff)"
              />
            </div>
          </div>

          {/* Highlights List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Key Engineering Highlights</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Bulleted engineering achievements displayed in the project case study.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddHighlight}
                className="gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Point</span>
              </Button>
            </div>

            <div className="space-y-3">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground w-6 text-center shrink-0">
                    #{index + 1}
                  </span>
                  <Input
                    type="text"
                    value={highlight}
                    onChange={(e) => handleHighlightChange(index, e.target.value)}
                    placeholder="e.g. Benchmarked 12,000 req/sec at p99 latency < 18ms"
                    className="flex-1"
                  />
                  {highlights.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveHighlight(index)}
                      className="text-muted-foreground hover:text-destructive shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Section 5: Technologies & External Links */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Technologies & External Links
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Define tech stack pills, brand accent color, and live links.
          </p>
        </div>

        <div className="space-y-6">
          {/* Tech Stack Input */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Technologies Used</Label>
            <TechStackInput value={technologies} onChange={setTechnologies} />
          </div>

          {/* Accent Color, Live Demo & GitHub URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Accent Color</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className="h-10 w-12 rounded-lg border border-input shrink-0 transition-colors"
                    style={{ backgroundColor: accentColor }}
                  />
                  <Input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    placeholder="e.g. #6366f1"
                    className="font-mono"
                  />
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {ACCENT_PRESETS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setAccentColor(color)}
                      className={`h-5 w-5 rounded-full border transition-all cursor-pointer ${
                        accentColor.toLowerCase() === color.toLowerCase()
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                          : "border-border hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Live Demo URL</Label>
              <Input
                type="url"
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="e.g. https://cloudpulse.io"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">GitHub Repository URL</Label>
              <Input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="e.g. https://github.com/username/project"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Sticky Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
        <Link
          href="/admin"
          className={buttonVariants({ variant: "outline", size: "default" })}
        >
          Cancel
        </Link>

        <Button type="submit" size="default" disabled={isPending} className="gap-2 min-w-36">
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
