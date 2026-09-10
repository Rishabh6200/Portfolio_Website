"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

export interface SerializedCategory {
  _id: string
  name: string
  slug: string
  color?: string
}

interface SkillTabsProps {
  categories: SerializedCategory[]
  counts: Record<string, number>
  activeCategoryId: string
}

export function SkillTabs({
  categories,
  counts,
  activeCategoryId,
}: SkillTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleTabClick = (cat: SerializedCategory) => {
    const target = cat.slug || cat._id
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("category")
      params.set("c", target)
      router.replace(`/admin/skills?${params.toString()}`, { scroll: false })
    })
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pb-1">
      {categories.map((cat) => {
        const isActive =
          activeCategoryId === cat._id || activeCategoryId === cat.slug
        const count = counts[cat._id] ?? 0

        return (
          <button
            key={cat._id}
            type="button"
            onClick={() => handleTabClick(cat)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              isActive
                ? "bg-foreground text-background shadow-xs font-semibold"
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
            <span
              className={`text-[11px] ${
                isActive ? "opacity-80" : "opacity-60"
              }`}
            >
              ({count})
            </span>
          </button>
        )
      })}

      {isPending && (
        <span className="flex items-center gap-1 text-xs text-muted-foreground animate-pulse pl-2">
          <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
          <span>Updating...</span>
        </span>
      )}
    </div>
  )
}
