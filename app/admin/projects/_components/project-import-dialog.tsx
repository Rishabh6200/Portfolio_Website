"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileCode, Sparkles, ClipboardPaste } from "lucide-react"
import { toast } from "sonner"

export interface ImportedProjectData {
  title?: string
  slug?: string
  tagline?: string
  role?: string
  description?: string
  liveUrl?: string
  githubUrl?: string
  logo?: string
  images?: string[]
  featured?: boolean
  status?: "published" | "draft"
  skills?: string[]
}

interface ProjectImportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onImport: (data: ImportedProjectData) => void
  sampleSkills?: string[]
}

export function ProjectImportDialog({
  open,
  onOpenChange,
  onImport,
  sampleSkills = [],
}: ProjectImportDialogProps) {
  const [importString, setImportString] = useState("")

  function handleInsertTemplate() {
    const sample = {
      title: "CloudPulse — Distributed API Gateway",
      slug: "cloudpulse-api-gateway",
      role: "Full-Stack Developer",
      tagline: "High-throughput distributed API gateway with sub-millisecond route dispatch",
      description: "Designed and implemented a distributed microservices gateway handling high concurrency with Redis rate limiting, pub/sub streaming, and Docker orchestration.",
      skills: sampleSkills.length > 0 ? sampleSkills : ["React", "TypeScript", "Docker", "Redis"],
      liveUrl: "https://cloudpulse.example.com",
      githubUrl: "https://github.com/username/cloudpulse",
      featured: true,
      status: "published",
    }
    setImportString(JSON.stringify(sample, null, 2))
  }

  function handleApply() {
    if (!importString.trim()) {
      toast.error("Please paste a JSON string first")
      return
    }

    try {
      const data = JSON.parse(importString.trim())
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error("Input must be a valid JSON object")
      }

      onImport(data as ImportedProjectData)
      toast.success("Successfully imported and populated project fields!")
      onOpenChange(false)
      setImportString("")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to parse JSON"
      toast.error(msg)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onOpenChange(false)
              setImportString("")
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleApply}
            className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
          >
            <ClipboardPaste className="h-3.5 w-3.5" />
            <span>Apply & Populate Form</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
