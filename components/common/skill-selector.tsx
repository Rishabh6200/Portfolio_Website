"use client"

import * as React from "react"
import { Check, Search, Sparkles, X, RotateCcw, Filter, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export interface SkillCategoryInfo {
   id: string
   name: string
   slug?: string
   color?: string
   icon?: string
}

export interface AvailableSkill {
   id: string
   name: string
   level?: "Proficient" | "Advanced" | "Expert" | string
   highlight?: boolean
   order?: number
   categoryId: string
   category?: SkillCategoryInfo | null
}

export type SkillSelectorItem = AvailableSkill

export interface SkillSelectorProps {
   availableSkills: AvailableSkill[]
   selectedSkillIds: string[]
   onChange: (ids: string[]) => void
   name?: string // Optional input name for hidden inputs
   className?: string
   placeholder?: string
   disabled?: boolean
}

export function SkillSelector({
   availableSkills = [],
   selectedSkillIds = [],
   onChange,
   name,
   className,
   placeholder = "Filter skills or paste comma-separated list (e.g. React, Docker, Node.js)...",
   disabled = false,
}: SkillSelectorProps) {
   const [search, setSearch] = React.useState("")
   const [activeCategory, setActiveCategory] = React.useState<string>("all")
   const [showSelectedOnly, setShowSelectedOnly] = React.useState(false)

   const selectedSet = React.useMemo(() => new Set(selectedSkillIds), [selectedSkillIds])

   const selectedSkills = React.useMemo(() => {
      return availableSkills.filter((s) => selectedSet.has(s.id))
   }, [availableSkills, selectedSet])

   const toggleSkill = (id: string) => {
      if (disabled) return
      if (selectedSet.has(id)) {
         onChange(selectedSkillIds.filter((item) => item !== id))
      } else {
         onChange([...selectedSkillIds, id])
      }
   }

   const commaSeparatedTerms = React.useMemo(() => {
      if (!search.includes(",")) return []
      return search
         .split(",")
         .map((t) => t.trim().toLowerCase())
         .filter((t) => t.length > 0)
   }, [search])

   const commaMatches = React.useMemo(() => {
      if (commaSeparatedTerms.length === 0) return []
      return availableSkills.filter((s) => {
         const sName = s.name.toLowerCase()
         return commaSeparatedTerms.some((term) => sName === term || sName.includes(term))
      })
   }, [availableSkills, commaSeparatedTerms])

   const categories = React.useMemo(() => {
      const catMap = new Map<
         string,
         {
            id: string
            name: string
            color: string
            skills: AvailableSkill[]
            selectedCount: number
         }
      >();

      for (const skill of availableSkills) {
         const catId = skill.category?.id || skill.categoryId || "other"
         const catName = skill.category?.name || "Other"
         const catColor = skill.category?.color || "#6366f1"

         let cat = catMap.get(catId)
         if (!cat) {
            cat = { id: catId, name: catName, color: catColor, skills: [], selectedCount: 0 }
            catMap.set(catId, cat)
         }

         cat.skills.push(skill)
         if (selectedSet.has(skill.id)) {
            cat.selectedCount += 1
         }
      }

      return Array.from(catMap.values()).sort((a, b) => a.name.localeCompare(b.name))
   }, [availableSkills, selectedSet])

   // Filter skills based on search term, category tab, and showSelectedOnly
   const filteredSkills = React.useMemo(() => {
      if (commaSeparatedTerms.length > 0) {
         return commaMatches
      }

      const term = search.toLowerCase().trim()

      return availableSkills.filter((s) => {
         if (showSelectedOnly && !selectedSet.has(s.id)) {
            return false
         }

         const catId = s.category?.id || s.categoryId || "other"
         if (activeCategory !== "all" && catId !== activeCategory) {
            return false
         }

         if (!term) return true
         const nameMatch = s.name.toLowerCase().includes(term)
         const catMatch = s.category?.name?.toLowerCase().includes(term)
         const levelMatch = s.level?.toLowerCase().includes(term)
         return nameMatch || Boolean(catMatch) || Boolean(levelMatch)
      })
   }, [availableSkills, search, commaSeparatedTerms, commaMatches, showSelectedOnly, selectedSet, activeCategory])

   // Group filtered skills by Category
   const groupedSkills = React.useMemo(() => {
      const groups: Record<
         string,
         {
            id: string
            name: string
            color: string
            skills: AvailableSkill[]
            totalCount: number
            selectedCount: number
         }
      > = {}

      for (const skill of filteredSkills) {
         const catId = skill.category?.id || skill.categoryId || "other"
         const catName = skill.category?.name || "Other"
         const catColor = skill.category?.color || "#6366f1"

         if (!groups[catName]) {
            const originalCat = categories.find((c) => c.id === catId)
            groups[catName] = {
               id: catId,
               name: catName,
               color: catColor,
               skills: [],
               totalCount: originalCat?.skills.length || 0,
               selectedCount: originalCat?.selectedCount || 0,
            }
         }
         groups[catName].skills.push(skill)
      }

      return groups
   }, [filteredSkills, categories])

   // Category bulk toggle
   const toggleCategory = (categoryId: string) => {
      if (disabled) return
      const cat = categories.find((c) => c.id === categoryId)
      if (!cat) return

      const catSkillIds = cat.skills.map((s) => s.id)
      const allSelected = catSkillIds.every((id) => selectedSet.has(id))

      if (allSelected) {
         onChange(selectedSkillIds.filter((id) => !catSkillIds.includes(id)))
      } else {
         onChange(Array.from(new Set([...selectedSkillIds, ...catSkillIds])))
      }
   }

   return (
      <div className={cn("space-y-4 rounded-xl border border-border bg-card/60 p-4 shadow-2xs", className)}>
         {/* Hidden inputs for native form submissions */}
         {name &&
            selectedSkillIds.map((id) => (
               <input key={id} type="hidden" name={name} value={id} />
            ))}

         {/* 1. Selected Chips Summary */}
         <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground pb-1 border-b border-border/40">
               <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">
                     Selected Technologies ({selectedSkills.length})
                  </span>
                  {selectedSkills.length > 0 && (
                     <span className="text-[11px] font-mono text-muted-foreground">
                        {Math.round((selectedSkills.length / Math.max(availableSkills.length, 1)) * 100)}% of library
                     </span>
                  )}
               </div>

               {selectedSkills.length > 0 && (
                  <Button
                     type="button"
                     variant="ghost"
                     size="xs"
                     onClick={() => onChange([])}
                     disabled={disabled}
                     className="h-6 gap-1 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                     <RotateCcw className="h-3 w-3" />
                     <span>Clear all</span>
                  </Button>
               )}
            </div>

            {selectedSkills.length === 0 ? (
               <p className="text-xs text-muted-foreground italic py-1">
                  No skills selected yet. Click any skill chip below or paste a list to add them.
               </p>
            ) : (
               <div className="flex flex-wrap gap-1.5 min-h-8">
                  {selectedSkills.map((skill) => {
                     const catColor = skill.category?.color || "#6366f1"

                     return (
                        <Badge
                           key={skill.id}
                           variant="secondary"
                           className="group inline-flex items-center gap-1.5 py-1 px-2.5 text-xs font-medium cursor-pointer border border-border/70 bg-background/80 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all shadow-2xs"
                           onClick={() => toggleSkill(skill.id)}
                           title="Click to remove"
                        >
                           <span
                              className="h-2 w-2 rounded-full shrink-0 ring-1 ring-black/10 dark:ring-white/20"
                              style={{ backgroundColor: catColor }}
                           />
                           <span>{skill.name}</span>
                           {skill.highlight && (
                              <Sparkles className="h-3 w-3 text-amber-500 shrink-0" />
                           )}
                           <X className="h-3 w-3 opacity-60 group-hover:opacity-100 group-hover:text-destructive transition-opacity" />
                        </Badge>
                     )
                  })}
               </div>
            )}
         </div>

         {/* 2. Search & Category Filters Bar */}
         <div className="space-y-2.5">
            {/* Search Input */}
            <div className="relative">
               <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
               <Input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={placeholder}
                  disabled={disabled}
                  className="pl-9 pr-8 text-xs h-9 bg-background/70 border-input"
               />
               {search && (
                  <Button
                     type="button"
                     variant="ghost"
                     size="icon-xs"
                     onClick={() => setSearch("")}
                     className="absolute right-1.5 top-1.5 size-6 rounded-full text-muted-foreground hover:text-foreground"
                     aria-label="Clear search"
                  >
                     <X className="h-3.5 w-3.5" />
                  </Button>
               )}
            </div>

            {/* Smart Comma Matches Alert Banner */}
            {commaMatches.length > 0 && (
               <div className="flex items-center justify-between p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-xs animate-in fade-in">
                  <span className="text-foreground font-medium">
                     Found {commaMatches.length} matching skill{commaMatches.length > 1 ? "s" : ""} from your input string
                  </span>
                  <Button
                     type="button"
                     size="xs"
                     onClick={() => {
                        const matchedIds = commaMatches.map((s) => s.id)
                        onChange(Array.from(new Set([...selectedSkillIds, ...matchedIds])))
                        setSearch("")
                     }}
                     className="h-7 px-2.5 text-xs font-medium shadow-xs"
                  >
                     Select All ({commaMatches.length})
                  </Button>
               </div>
            )}

            {/* Category Filter Pills & "Selected Only" Toggle */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
               <Button
                  type="button"
                  size="xs"
                  variant={activeCategory === "all" && !showSelectedOnly ? "default" : "secondary"}
                  onClick={() => {
                     setActiveCategory("all")
                     setShowSelectedOnly(false)
                  }}
                  className="h-6 px-2.5 rounded-full font-medium whitespace-nowrap transition-all gap-1"
               >
                  <span>All</span>
                  <span className="text-[10px] opacity-75 font-mono">({availableSkills.length})</span>
               </Button>

               {/* Selected Only filter button */}
               {selectedSkills.length > 0 && (
                  <Button
                     type="button"
                     size="xs"
                     variant={showSelectedOnly ? "default" : "secondary"}
                     onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                     className="h-6 px-2.5 rounded-full font-medium whitespace-nowrap transition-all gap-1"
                  >
                     <Filter className="h-3 w-3" />
                     <span>Selected Only</span>
                     <span className="text-[10px] font-mono">({selectedSkills.length})</span>
                  </Button>
               )}

               {/* Category Tabs */}
               {categories.map((cat) => {
                  const isActive = activeCategory === cat.id && !showSelectedOnly
                  return (
                     <Button
                        key={cat.id}
                        type="button"
                        size="xs"
                        variant={isActive ? "default" : "secondary"}
                        onClick={() => {
                           setActiveCategory(cat.id)
                           setShowSelectedOnly(false)
                        }}
                        className="h-6 px-2.5 rounded-full font-medium whitespace-nowrap transition-all gap-1.5"
                     >
                        <span
                           className="h-1.5 w-1.5 rounded-full shrink-0"
                           style={{ backgroundColor: cat.color }}
                        />
                        <span>{cat.name}</span>
                        <span className="text-[10px] opacity-80 font-mono">
                           {cat.selectedCount > 0 ? (
                              <span className={isActive ? "text-primary-foreground font-semibold" : "text-primary font-semibold"}>
                                 {cat.selectedCount}/{cat.skills.length}
                              </span>
                           ) : (
                              `(${cat.skills.length})`
                           )}
                        </span>
                     </Button>
                  )
               })}
            </div>
         </div>

         {/* 3. Category-Grouped Skill Chips Grid */}
         <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {Object.keys(groupedSkills).length === 0 ? (
               <div className="text-center py-8 text-xs text-muted-foreground space-y-2">
                  <p>No skills found matching &ldquo;{search}&rdquo;.</p>
                  {(search || activeCategory !== "all" || showSelectedOnly) && (
                     <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                           setSearch("")
                           setActiveCategory("all")
                           setShowSelectedOnly(false)
                        }}
                        className="h-7 text-xs font-medium"
                     >
                        Reset filters
                     </Button>
                  )}
               </div>
            ) : (
               Object.entries(groupedSkills).map(([catName, { id: catId, color, skills, selectedCount, totalCount }]) => (
                  <div key={catName} className="space-y-2">
                     {/* Category Header with color dot, count, and bulk toggle action */}
                     <div className="flex items-center justify-between group/header">
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                           <span
                              className="h-2 w-2 rounded-full shrink-0"
                              style={{ backgroundColor: color || "#6366f1" }}
                           />
                           <span>{catName}</span>
                           <span className="text-[10px] font-mono text-muted-foreground/75 normal-case">
                              ({selectedCount}/{totalCount})
                           </span>
                        </div>

                        {/* Quick category select/deselect all button */}
                        <Button
                           type="button"
                           variant="ghost"
                           size="xs"
                           onClick={() => toggleCategory(catId)}
                           disabled={disabled}
                           className="h-6 px-1.5 text-[11px] text-muted-foreground hover:text-primary transition-colors cursor-pointer opacity-70 group-hover/header:opacity-100 gap-1"
                        >
                           <CheckCheck className="h-3 w-3" />
                           <span>
                              {selectedCount === totalCount ? "Deselect category" : "Select category"}
                           </span>
                        </Button>
                     </div>

                     {/* Skill Chips Cloud */}
                     <div className="flex flex-wrap gap-1.5">
                        {skills.map((skill) => {
                           const isSelected = selectedSet.has(skill.id)

                           return (
                              <Button
                                 key={skill.id}
                                 type="button"
                                 size="xs"
                                 variant={isSelected ? "default" : "outline"}
                                 onClick={() => toggleSkill(skill.id)}
                                 disabled={disabled}
                                 className={cn(
                                    "group/chip h-7 px-2.5 rounded-lg text-xs font-medium transition-all select-none active:scale-95 gap-1.5",
                                    isSelected
                                       ? "bg-foreground text-background hover:bg-foreground/90 shadow-xs font-semibold"
                                       : "bg-muted/40 border-border/70 text-foreground/80 hover:bg-muted hover:text-foreground hover:border-border"
                                 )}
                              >
                                 {isSelected ? (
                                    <Check className="h-3 w-3 shrink-0 stroke-3 animate-in zoom-in-75 duration-100" />
                                 ) : (
                                    <span
                                       className="h-1.5 w-1.5 rounded-full shrink-0 opacity-70 group-hover/chip:opacity-100 transition-opacity"
                                       style={{ backgroundColor: color || "#6366f1" }}
                                    />
                                 )}
                                 <span>{skill.name}</span>

                                 {skill.highlight && (
                                    <Sparkles
                                       className={cn(
                                          "h-3 w-3 shrink-0",
                                          isSelected ? "text-amber-400" : "text-amber-500"
                                       )}
                                    />
                                 )}

                                 {skill.level && (
                                    <span
                                       className={cn(
                                          "text-[10px] opacity-75 font-mono",
                                          isSelected ? "text-background/80" : "text-muted-foreground"
                                       )}
                                    >
                                       • {skill.level}
                                    </span>
                                 )}
                              </Button>
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

export default SkillSelector
