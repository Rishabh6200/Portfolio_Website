"use client"

import { useState, useEffect, useTransition } from "react"
import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type SensorDescriptor,
  type SensorOptions,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { toast } from "sonner"

export interface UseReorderableListOptions<T> {
  initialItems: T[]
  onReorder: (payload: { id: string; order: number }[]) => Promise<{ success: boolean; error?: string }>
  getId?: (item: T) => string
  successMessage?: string
  errorMessage?: string
}

export interface UseReorderableListReturn<T> {
  items: T[]
  setItems: React.Dispatch<React.SetStateAction<T[]>>
  sensors: SensorDescriptor<SensorOptions>[]
  handleDragEnd: (event: DragEndEvent) => void
  isPending: boolean
}

export function useReorderableList<T extends { _id?: string; id?: string }>({
  initialItems,
  onReorder,
  getId = (item) => (item._id || item.id) as string,
  successMessage = "Order updated successfully",
  errorMessage = "Failed to update order",
}: UseReorderableListOptions<T>): UseReorderableListReturn<T> {
  const [items, setItems] = useState<T[]>(initialItems)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((item) => getId(item) === active.id)
    const newIndex = items.findIndex((item) => getId(item) === over.id)

    if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return

    const reordered = arrayMove(items, oldIndex, newIndex)
    const previousItems = items
    setItems(reordered)

    const payload = reordered.map((item, idx) => ({
      id: getId(item),
      order: idx,
    }))

    startTransition(async () => {
      try {
        const res = await onReorder(payload)
        if (res?.success) {
          toast.success(successMessage)
        } else {
          toast.error(res?.error || errorMessage)
          setItems(previousItems) // rollback
        }
      } catch {
        toast.error(errorMessage)
        setItems(previousItems) // rollback
      }
    })
  }

  return {
    items,
    setItems,
    sensors,
    handleDragEnd,
    isPending,
  }
}
