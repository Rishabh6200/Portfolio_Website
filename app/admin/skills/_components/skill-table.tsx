"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Edit3,
  Trash2,
  Sparkles,
  Loader2,
  Plus,
  Layers,
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
import { deleteSkillAction } from "@/app/admin/skills/actions"

export interface SerializedSkill {
  _id: string
  name: string
  categoryId: {
    _id: string
    name: string
    slug?: string
    color?: string
  } | string
  level: "Proficient" | "Advanced" | "Expert"
  highlight: boolean
  order: number
  createdAt?: string
}

export interface SerializedCategory {
  _id: string
  name: string
  slug: string
  color?: string
}

interface SkillTableProps {
  skills: SerializedSkill[]
  categories: SerializedCategory[]
}

export function SkillTable({
  skills: initialSkills,
  categories,
}: SkillTableProps) {
  const [skills, setSkills] = useState<SerializedSkill[]>(initialSkills)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Delete Dialog state
  const [skillToDelete, setSkillToDelete] = useState<SerializedSkill | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  async function confirmDelete() {
    if (!skillToDelete) return

    setIsDeleting(true)
    try {
      const res = await deleteSkillAction(skillToDelete._id)
      if (res.success) {
        setSkills((prev) => prev.filter((s) => s._id !== skillToDelete._id))
        toast.success(`Deleted skill "${skillToDelete.name}"`)
        setSkillToDelete(null)
      } else {
        toast.error(res.error || "Failed to delete skill")
      }
    } catch {
      toast.error("An error occurred while deleting skill")
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredSkills = skills.filter((skill) => {
    if (selectedCategory === "all") return true
    const catId =
      typeof skill.categoryId === "object"
        ? skill.categoryId?._id
        : skill.categoryId
    return catId === selectedCategory
  })

  if (skills.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-4 bg-card/50">
        <div className="inline-flex p-3.5 rounded-2xl bg-muted text-muted-foreground">
          <Sparkles className="h-8 w-8 text-indigo-500" />
        </div>
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-foreground">
            No skills found
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Technical competencies populate the skills grid on your public website. Add your first technology to get started.
          </p>
        </div>
        <div className="flex items-center justify-center pt-3">
          <Link
            href="/admin/skills/new"
            className={buttonVariants({ size: "default" })}
          >
            <Plus className="h-4 w-4" />
            <span>Create Skill</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Category Filter Tabs */}
      {categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pb-1">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            }`}
          >
            All Competencies ({skills.length})
          </button>
          {categories.map((cat) => {
            const count = skills.filter((s) => {
              const catId =
                typeof s.categoryId === "object"
                  ? s.categoryId?._id
                  : s.categoryId
              return catId === cat._id
            }).length

            return (
              <button
                key={cat._id}
                type="button"
                onClick={() => setSelectedCategory(cat._id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === cat._id
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {cat.color && (
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                )}
                <span>{cat.name}</span>
                <span className="opacity-60 text-[11px]">({count})</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Skills Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-75">Skill / Technology</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Proficiency</TableHead>
              <TableHead className="w-25">Sort Order</TableHead>
              <TableHead className="text-right w-30">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSkills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No skills found in this category.
                </TableCell>
              </TableRow>
            ) : (
              filteredSkills.map((skill) => {
                const categoryObj =
                  typeof skill.categoryId === "object"
                    ? skill.categoryId
                    : categories.find((c) => c._id === skill.categoryId)

                return (
                  <TableRow key={skill._id} className="hover:bg-muted/40">
                    {/* Name & Highlight */}
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-foreground">
                          {skill.name}
                        </span>
                        {skill.highlight && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                            <Sparkles className="h-3 w-3" />
                            <span>Highlighted</span>
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Category Badge */}
                    <TableCell>
                      {categoryObj ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-border bg-muted/50">
                          {categoryObj.color && (
                            <span
                              className="h-2 w-2 rounded-full shrink-0"
                              style={{ backgroundColor: categoryObj.color }}
                            />
                          )}
                          <span>{categoryObj.name}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    {/* Proficiency Level */}
                    <TableCell>
                      <Badge
                        variant={
                          skill.level === "Expert"
                            ? "default"
                            : skill.level === "Advanced"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-xs"
                      >
                        {skill.level}
                      </Badge>
                    </TableCell>

                    {/* Sort Order */}
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {skill.order ?? 0}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/skills/${skill._id}`}
                          className={buttonVariants({
                            variant: "ghost",
                            size: "icon",
                            className: "h-8 w-8 text-muted-foreground hover:text-foreground",
                          })}
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span className="sr-only">Edit</span>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSkillToDelete(skill)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(skillToDelete)}
        onOpenChange={(open) => !open && setSkillToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Skill</DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete{" "}
              <strong className="text-foreground">
                &ldquo;{skillToDelete?.name}&rdquo;
              </strong>
              ? This competency will be permanently removed from your portfolio.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-4">
            <Button
              variant="outline"
              onClick={() => setSkillToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Skill</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
