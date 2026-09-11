"use client"

import { useState, useEffect, useTransition } from "react"
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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
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
import { DeleteConfirmDialog } from "@/app/admin/_components/delete-confirm-dialog"
import {
  deleteProjectAction,
  toggleProjectStatusAction,
  reorderProjectsAction,
} from "../actions"
import { DragHandle, SortableRow } from "@/components/ui/sortable-row"

export interface PopulatedSkill {
  _id: string
  name: string
  level?: string
  categoryId?: { _id: string; name: string; color?: string } | string
}

export interface SerializedProject {
  _id: string
  slug: string
  title: string
  tagline: string
  role: string
  skills?: (PopulatedSkill | string)[]
  logo?: string
  images?: string[]
  liveUrl?: string
  githubUrl?: string
  status: "published" | "draft"
  featured: boolean
  order: number
  updatedAt?: string
}

interface ProjectTableProps {
  projects: SerializedProject[]
}

export function ProjectTable({ projects: initialProjects }: ProjectTableProps) {
  const [projects, setProjects] = useState<SerializedProject[]>(initialProjects)
  const [, startTransition] = useTransition()
  const [togglingId, setTogglingId] = useState<string | null>(null)

  // Delete Dialog state
  const [projectToDelete, setProjectToDelete] = useState<SerializedProject | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    setProjects(initialProjects)
  }, [initialProjects])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = projects.findIndex((p) => p._id === active.id)
    const newIndex = projects.findIndex((p) => p._id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(projects, oldIndex, newIndex)
      setProjects(reordered)

      const payload = reordered.map((item, idx) => ({
        id: item._id,
        order: idx,
      }))

      startTransition(async () => {
        const res = await reorderProjectsAction(payload)
        if (res.success) {
          toast.success("Project order updated", { duration: 1500 })
        } else {
          toast.error("Failed to update project order")
          setProjects(projects) // rollback
        }
      })
    }
  }

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10 px-2 text-center">
                  <span className="sr-only">Drag</span>
                </TableHead>
                <TableHead className="py-3 px-4">Project</TableHead>
                <TableHead className="py-3 px-4">Role</TableHead>
                <TableHead className="py-3 px-4">Skills</TableHead>
                <TableHead className="py-3 px-4">Status</TableHead>
                <TableHead className="py-3 px-4 text-right w-28">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SortableContext
                items={projects.map((p) => p._id)}
                strategy={verticalListSortingStrategy}
              >
                {projects.map((p) => {
                  const isToggling = togglingId === p._id
                  const thumbnail = p.logo || (p.images && p.images[0]) || null

                  return (
                    <SortableRow key={p._id} id={p._id}>
                      {({ attributes, listeners }) => (
                        <>
                          {/* Drag Handle */}
                          <TableCell className="w-10 px-2 text-center">
                            <DragHandle attributes={attributes} listeners={listeners} />
                          </TableCell>

                          {/* Project Info + Thumbnail */}
                          <TableCell className="py-3 px-4">
                            <div className="flex items-center gap-3.5">
                              <div className="h-10 w-10 rounded-lg border border-border bg-muted/60 shrink-0 overflow-hidden flex items-center justify-center p-1">
                                {thumbnail ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={thumbnail}
                                    alt={p.title}
                                    className={p.logo ? "h-full w-full object-contain" : "h-full w-full object-cover rounded"}
                                  />
                                ) : (
                                  <FolderGit2 className="h-5 w-5 text-muted-foreground" />
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

                          {/* Role */}
                          <TableCell className="py-3 px-4">
                            <span className="text-xs font-medium text-muted-foreground">
                              {p.role || "Developer"}
                            </span>
                          </TableCell>

                          {/* Skills Chips (2-line layout with + remaining count) */}
                          <TableCell className="py-3 px-4">
                            {(() => {
                              const skills = p.skills || []
                              const maxVisible = 5
                              const visibleSkills = skills.slice(0, maxVisible)
                              const remainingCount = skills.length - maxVisible
                              const remainingNames =
                                remainingCount > 0
                                  ? skills
                                      .slice(maxVisible)
                                      .map((s) => (typeof s === "object" ? s.name : String(s)))
                                      .join(", ")
                                  : ""

                              return (
                                <div className="flex flex-wrap items-center gap-1.5 max-w-85 sm:max-w-95">
                                  {visibleSkills.map((skill) => {
                                    const name = typeof skill === "object" ? skill.name : String(skill)
                                    const id = typeof skill === "object" ? skill._id : String(skill)
                                    return (
                                      <Badge
                                        key={id}
                                        variant="secondary"
                                        className="text-[11px] font-normal py-0 px-1.5 bg-muted/80 text-foreground/80 border-border/50 shrink-0"
                                      >
                                        {name}
                                      </Badge>
                                    )
                                  })}
                                  {remainingCount > 0 && (
                                    <Badge
                                      variant="outline"
                                      title={remainingNames ? `+${remainingCount} more: ${remainingNames}` : undefined}
                                      className="text-[10px] font-mono font-medium py-0 px-1.5 text-muted-foreground bg-muted/40 border-border/60 hover:bg-muted/80 shrink-0 cursor-default"
                                    >
                                      +{remainingCount}
                                    </Badge>
                                  )}
                                  {skills.length === 0 && (
                                    <span className="text-xs text-muted-foreground/60 italic">No skills linked</span>
                                  )}
                                </div>
                              )
                            })()}
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
                        </>
                      )}
                    </SortableRow>
                  )
                })}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        open={Boolean(projectToDelete)}
        onOpenChange={(open) => !open && setProjectToDelete(null)}
        title="Delete Project"
        itemName={projectToDelete?.title}
        description={
          <>
            Are you sure you want to delete{" "}
            <strong className="text-foreground font-semibold">
              &ldquo;{projectToDelete?.title}&rdquo;
            </strong>
            ? This action cannot be undone and will permanently remove this project and its media configurations from MongoDB Atlas.
          </>
        }
        confirmText="Delete Project"
        isDeleting={isDeleting}
        onConfirm={confirmDelete}
      />
    </>
  )
}
