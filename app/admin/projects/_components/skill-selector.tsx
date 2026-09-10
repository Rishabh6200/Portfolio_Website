"use client"

import { useState, useMemo } from "react"
import { Search, Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export interface AvailableSkill {
  _id: string
  name: string
  categoryId?: {
    _id: string
    name: string
    color?: string
  } | string
  level?: string
}

interface SkillSelectorProps {
  availableSkills: AvailableSkill[]
  selectedSkillIds: string[]
  onChange: (ids: string[]) => void
}

export function SkillSelector({
  availableSkills,
  selectedSkillIds,
  onChange,
}: SkillSelectorProps) {
  const [search, setSearch] = useState("")

  const toggleSkill = (id: string) => {
    if (selectedSkillIds.includes(id)) {
      onChange(selectedSkillIds.filter((item) => item !== id))
    } else {
      onChange([...selectedSkillIds, id])
    }
  }

  const selectedSkills = useMemo(() => {
    return availableSkills.filter((s) => selectedSkillIds.includes(s._id))
  }, [availableSkills, selectedSkillIds])

  // Filter skills based on search term
  const filteredSkills = useMemo(() => {
    if (!search.trim()) return availableSkills
    const term = search.toLowerCase()
    return availableSkills.filter((s) => {
      const nameMatch = s.name.toLowerCase().includes(term)
      const catName =
        typeof s.categoryId === "object" ? s.categoryId?.name?.toLowerCase() : ""
      return nameMatch || (catName && catName.includes(term))
    })
  }, [availableSkills, search])

  // Group filtered skills by Category
  const groupedSkills = useMemo(() => {
    const groups: Record<string, { color?: string; skills: AvailableSkill[] }> = {}

    filteredSkills.forEach((skill) => {
      const catName =
        typeof skill.categoryId === "object" && skill.categoryId?.name
          ? skill.categoryId.name
          : "Other"
      const catColor =
        typeof skill.categoryId === "object" && skill.categoryId?.color
          ? skill.categoryId.color
          : "#6366f1"

      if (!groups[catName]) {
        groups[catName] = { color: catColor, skills: [] }
      }
      groups[catName].skills.push(skill)
    })

    return groups
  }, [filteredSkills])

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card/60 p-4">
      {/* Selected Chips Summary */}
      <div>
        <div className="flex items-center justify-between text-xs text-muted-foreground pb-2">
          <span>Selected Technologies ({selectedSkills.length})</span>
          {selectedSkills.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>

        {selectedSkills.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-1">
            No skills selected yet. Click skills below to add them to this project.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5 min-h-8">
            {selectedSkills.map((skill) => {
              const catColor =
                typeof skill.categoryId === "object"
                  ? skill.categoryId?.color
                  : undefined

              return (
                <Badge
                  key={skill._id}
                  variant="secondary"
                  className="gap-1.5 py-1 px-2.5 text-xs font-medium cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all group"
                  onClick={() => toggleSkill(skill._id)}
                  title="Click to remove"
                >
                  {catColor && (
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: catColor }}
                    />
                  )}
                  <span>{skill.name}</span>
                  <X className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </Badge>
              )
            })}
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter skills by name or category (e.g. React, PostgreSQL, Docker)..."
          className="pl-9 text-xs"
        />
      </div>

      {/* Category-Grouped Skill Chips */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {Object.keys(groupedSkills).length === 0 ? (
          <div className="text-center py-6 text-xs text-muted-foreground">
            No skills found matching &ldquo;{search}&rdquo;.
          </div>
        ) : (
          Object.entries(groupedSkills).map(([catName, { color, skills }]) => (
            <div key={catName} className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: color || "#6366f1" }}
                />
                <span>{catName}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => {
                  const isSelected = selectedSkillIds.includes(skill._id)

                  return (
                    <button
                      key={skill._id}
                      type="button"
                      onClick={() => toggleSkill(skill._id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-foreground text-background border-foreground shadow-xs font-semibold"
                          : "bg-muted/50 border-border text-foreground/80 hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {isSelected ? (
                        <Check className="h-3 w-3 shrink-0 stroke-3" />
                      ) : (
                        <span
                          className="h-1.5 w-1.5 rounded-full shrink-0 opacity-70"
                          style={{ backgroundColor: color || "#6366f1" }}
                        />
                      )}
                      <span>{skill.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
