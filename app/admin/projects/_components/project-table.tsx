"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import {
  Edit3,
  Trash2,
  ExternalLink,
  Sparkles,
  Loader2,
  FolderGit2,
  Plus,
} from "lucide-react"
import { toast } from "sonner"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  deleteProjectAction,
  toggleProjectStatusAction,
} from "../actions"

interface SerializedProject {
  _id: string
  slug: string
  title: string
  tagline: string
  category: string
  role: string
  status: "published" | "draft"
  featured: boolean
  order: number
  coverImage?: string
  technologies: string[]
  updatedAt?: string
}

interface ProjectTableProps {
  projects: SerializedProject[]
}

export function ProjectTable({ projects: initialProjects }: ProjectTableProps) {
  const [projects, setProjects] = useState<SerializedProject[]>(initialProjects)
  const [isPending, startTransition] = useTransition()
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // Delete Dialog state
  const [projectToDelete, setProjectToDelete] = useState<SerializedProject | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  function handleToggleStatus(id: string, currentStatus: "published" | "draft") {
    setTogglingId(id)
    startTransition(async () => {
      const res = await toggleProjectStatusAction(id, currentStatus)
      if (res.success && res.status) {
        const nextStatus = res.status as "published" | "draft"
        setProjects((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: nextStatus } : p))
        )
        toast.success(`Project status updated to ${res.status}`)
      } else {
        toast.error("Failed to update status")
      }
      setTogglingId(null)
    })
  }

  async function confirmDelete() {
    if (!projectToDelete) return

    setIsDeleting(true)
    try {
      const res = await deleteProjectAction(projectToDelete._id)
      if (res.success) {
        setProjects((prev) => prev.filter((p) => p._id !== projectToDelete._id))
        toast.success(`Deleted "${projectToDelete.title}"`)
        setProjectToDelete(null)
      } else {
        toast.error(res.error || "Failed to delete project")
      }
    } catch {
      toast.error("An error occurred while deleting")
    } finally {
      setIsDeleting(false)
    }
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-4 bg-card/50">
        <div className="inline-flex p-3.5 rounded-2xl bg-muted text-muted-foreground">
          <FolderGit2 className="h-8 w-8" />
        </div>
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-foreground">
            No projects found
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your portfolio currently has no projects. Create your first project to get started.
          </p>
        </div>
        <div className="flex items-center justify-center pt-3">
          <Link
            href="/admin/projects/new"
            className={buttonVariants({ size: "default" })}
          >
            <Plus className="h-4 w-4" />
            <span>Create Project</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-3 px-4">Project</TableHead>
              <TableHead className="py-3 px-4">Category</TableHead>
              <TableHead className="py-3 px-4">Technologies</TableHead>
              <TableHead className="py-3 px-4">Status</TableHead>
              <TableHead className="py-3 px-4 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => {
              const isToggling = togglingId === p._id

              return (
                <TableRow key={p._id}>
                  {/* Project Info + Thumbnail */}
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center gap-3.5">
                      <div className="h-11 w-16 rounded-lg border border-border bg-muted shrink-0 overflow-hidden flex items-center justify-center">
                        {p.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.coverImage}
                            alt={p.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FolderGit2 className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/projects/${p._id}`}
                            className="text-sm font-semibold text-foreground hover:underline truncate max-w-xs sm:max-w-sm"
                          >
                            {p.title}
                          </Link>
                          {p.featured && (
                            <Badge variant="secondary" className="gap-1 text-[11px] py-0 px-1.5 text-amber-500 bg-amber-500/10 border-amber-500/20">
                              <Sparkles className="h-3 w-3" />
                              <span>Featured</span>
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs font-mono text-muted-foreground truncate max-w-xs sm:max-w-sm mt-0.5">
                          /projects/{p.slug}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell className="py-3 px-4">
                    <Badge variant="outline" className="text-xs font-normal">
                      {p.category}
                    </Badge>
                  </TableCell>

                  {/* Tech Stack */}
                  <TableCell className="py-3 px-4">
                    <div className="flex flex-wrap gap-1.5 max-w-xs">
                      {p.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md bg-muted text-xs font-mono text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                      {p.technologies.length > 3 && (
                        <span className="text-xs font-mono text-muted-foreground self-center">
                          +{p.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Status Toggle */}
                  <TableCell className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(p._id, p.status)}
                      disabled={isToggling}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        p.status === "published"
                          ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {isToggling ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <span
                          className={`h-2 w-2 rounded-full ${
                            p.status === "published" ? "bg-emerald-500" : "bg-muted-foreground"
                          }`}
                        />
                      )}
                      <span className="capitalize">{p.status}</span>
                    </button>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {p.status === "published" && (
                        <a
                          href={`/projects/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Preview on site"
                          className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                        >
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </a>
                      )}
                      <Link
                        href={`/admin/projects/${p._id}`}
                        title="Edit Project"
                        className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
                      >
                        <Edit3 className="h-4 w-4 text-muted-foreground" />
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setProjectToDelete(p)}
                        className="hover:text-destructive hover:bg-destructive/10"
                        title="Delete Project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Modal (shadcn Dialog) */}
      <Dialog
        open={Boolean(projectToDelete)}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg">Delete Project</DialogTitle>
            <DialogDescription className="text-sm">
              Are you sure you want to delete{" "}
              <strong className="text-foreground font-semibold">
                &ldquo;{projectToDelete?.title}&rdquo;
              </strong>
              ? This action cannot be undone and will permanently remove this project and its media configurations from MongoDB Atlas.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="default"
              onClick={() => setProjectToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="default"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Project</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
