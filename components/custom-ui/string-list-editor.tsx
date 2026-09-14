"use client"

import * as React from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface StringListEditorProps {
  title?: string
  description?: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
  addButtonLabel?: string
  minItems?: number
  className?: string
}

export function StringListEditor({
  title,
  description,
  items,
  onChange,
  placeholder = "Add an item...",
  addButtonLabel = "Add Item",
  minItems = 1,
  className,
}: StringListEditorProps) {
  // Ensure we have at least minItems
  const currentItems = items.length === 0 ? [""] : items

  const handleItemChange = (index: number, value: string) => {
    const updated = [...currentItems]
    updated[index] = value
    onChange(updated)
  }

  const handleAddItem = () => {
    onChange([...currentItems, ""])
  }

  const handleRemoveItem = (index: number) => {
    if (currentItems.length <= minItems) return
    const updated = currentItems.filter((_, i) => i !== index)
    onChange(updated)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {(title || description || addButtonLabel) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {(title || description) && (
            <div>
              {title && (
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {description}
                </p>
              )}
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddItem}
            className="gap-1.5 self-start sm:self-auto text-xs shrink-0"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{addButtonLabel}</span>
          </Button>
        </div>
      )}

      <div className="space-y-2.5">
        {currentItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-mono text-muted-foreground select-none">
              {index + 1}
            </span>
            <Input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
            {currentItems.length > minItems && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem(index)}
                className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0"
                title="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
