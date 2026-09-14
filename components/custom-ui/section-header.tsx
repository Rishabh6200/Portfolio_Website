"use client"

import * as React from "react"
import { motion } from "motion/react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SectionHeaderProps {
  eyebrow?: string
  icon?: LucideIcon | React.ComponentType<{ className?: string }>
  title: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  className?: string
  align?: "left" | "center"
}

export function SectionHeader({
  eyebrow,
  icon: Icon,
  title,
  description,
  action,
  className,
  align = "left",
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={cn(
        action
          ? "mb-12 sm:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6"
          : align === "center"
            ? "mb-14 sm:mb-16 text-center mx-auto max-w-3xl"
            : "mb-14 sm:mb-16",
        className
      )}
    >
      <div className={cn(action ? "max-w-2xl" : "", align === "center" && !action ? "flex flex-col items-center" : "")}>
        {eyebrow && (
          <div className="font-mono text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
            {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
            <span>{eyebrow}</span>
          </div>
        )}
        <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
          {title}
        </h2>
        {description && (
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base xl:text-lg mt-2.5 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  )
}
