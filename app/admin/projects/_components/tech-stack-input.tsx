"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TechStackInputProps {
  value: string[]
  onChange: (technologies: string[]) => void
}

const COMMON_SUGGESTIONS = [
  "NestJS",
  "React",
  "Next.js",
  "Laravel",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Redis",
  "Docker",
  "MongoDB",
  "TailwindCSS",
  "GraphQL",
  "AWS",
  "Prisma",
  "Kafka",
  "WebSockets",
]

export function TechStackInput({ value, onChange }: TechStackInputProps) {
  const [inputValue, setInputValue] = useState("")

  function addTag(tag: string) {
    const trimmed = tag.trim()
    if (!trimmed) return
    if (value.includes(trimmed)) return
    onChange([...value, trimmed])
    setInputValue("")
  }

  function removeTag(tagToRemove: string) {
    onChange(value.filter((t) => t !== tagToRemove))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  const unselectedSuggestions = COMMON_SUGGESTIONS.filter((s) => !value.includes(s)).slice(0, 8)

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg border border-input bg-transparent min-h-12 focus-within:ring-2 focus-within:ring-ring/50">
        {value.map((tech) => (
          <Badge
            key={tech}
            variant="secondary"
            className="text-xs font-mono py-1 px-2.5 gap-1.5 font-medium"
          >
            <span>{tech}</span>
            <button
              type="button"
              onClick={() => removeTag(tech)}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? "Type a tech name and press Enter (e.g. NestJS, Docker)..." : "Add more..."}
          className="flex-1 min-w-44 bg-transparent text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none px-1 py-1"
        />
      </div>

      {unselectedSuggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-medium text-muted-foreground">Quick suggestions:</span>
          {unselectedSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-md border border-border bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <Plus className="h-3 w-3" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
