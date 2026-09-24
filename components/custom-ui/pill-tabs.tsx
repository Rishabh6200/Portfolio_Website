"use client"

import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export interface PillTabItem<T extends string = string> {
  id: T
  label: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  count?: number | string
  disabled?: boolean
  className?: string
}

export interface PillTabsProps<T extends string = string> {
  items: PillTabItem<T>[]
  value: T
  onValueChange: (value: T) => void
  layoutId?: string
  size?: "sm" | "default" | "lg"
  className?: string
  tabClassName?: string
}

const sizeVariants = {
  sm: {
    container: "p-0.5 rounded-lg",
    tab: "px-2.5 py-1 text-xs gap-1.5 rounded-md",
    icon: "h-3 w-3",
    badge: "text-[9px] px-1 py-0.2",
    pillRadius: "rounded-md",
  },
  default: {
    container: "p-1 rounded-xl",
    tab: "px-3.5 py-1.5 text-xs sm:text-sm gap-2 rounded-lg",
    icon: "h-3.5 w-3.5",
    badge: "text-[10px] sm:text-[11px] px-1.5 py-0.2",
    pillRadius: "rounded-lg",
  },
  lg: {
    container: "p-1.5 rounded-2xl",
    tab: "px-4 py-2 text-sm sm:text-base gap-2.5 rounded-xl",
    icon: "h-4 w-4",
    badge: "text-xs px-2 py-0.5",
    pillRadius: "rounded-xl",
  },
}

export function PillTabs<T extends string = string>({
  items,
  value,
  onValueChange,
  layoutId = "activePillTabIndicator",
  size = "default",
  className,
  tabClassName,
}: PillTabsProps<T>) {
  const currentSize = sizeVariants[size] || sizeVariants.default

  return (
    <div
      role="tablist"
      className={cn(
        "relative inline-flex items-center bg-neutral-100/90 dark:bg-neutral-900/90 border border-black/8 dark:border-white/10 shadow-inner backdrop-blur-sm select-none",
        currentSize.container,
        className
      )}
    >
      {items.map((item) => {
        const isSelected = item.id === value
        const Icon = item.icon

        return (
          <motion.button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={isSelected}
            disabled={item.disabled}
            whileTap={!item.disabled ? { scale: 0.96 } : undefined}
            onClick={() => {
              if (!item.disabled && item.id !== value) {
                onValueChange(item.id)
              }
            }}
            className={cn(
              "relative flex items-center font-medium transition-colors duration-150 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 disabled:opacity-40 disabled:cursor-not-allowed",
              currentSize.tab,
              isSelected
                ? "text-neutral-900 dark:text-white"
                : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200",
              item.className,
              tabClassName
            )}
          >
            {/* Sliding Pill Background with Spring Physics */}
            {isSelected && (
              <motion.span
                layoutId={layoutId}
                className={cn(
                  "absolute inset-0 bg-white dark:bg-neutral-800 shadow-sm border border-black/6 dark:border-white/12",
                  currentSize.pillRadius
                )}
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 32,
                }}
              />
            )}

            {/* Tab Content (Icon, Label, Count Badge) */}
            <span className="relative z-10 flex items-center gap-2">
              {Icon && <Icon className={cn(currentSize.icon, "shrink-0")} />}
              <span>{item.label}</span>
              {item.count !== undefined && (
                <span
                  className={cn(
                    "font-mono rounded-full transition-colors",
                    currentSize.badge,
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold"
                      : "bg-black/5 dark:bg-white/10 text-neutral-500 dark:text-neutral-400"
                  )}
                >
                  {item.count}
                </span>
              )}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
