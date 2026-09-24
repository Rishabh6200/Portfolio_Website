import React from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { buttonVariants, Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  actionIcon?: React.ComponentType<{ className?: string }>
  onAction?: () => void
  className?: string
  children?: React.ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionIcon: ActionIcon = Plus,
  onAction,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 px-4 text-center",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">
        {description}
      </p>

      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className={buttonVariants({ size: "sm", className: "mt-4 gap-1.5" })}
        >
          <ActionIcon className="h-4 w-4" />
          <span>{actionLabel}</span>
        </Link>
      )}

      {onAction && actionLabel && !actionHref && (
        <Button
          size="sm"
          onClick={onAction}
          className="mt-4 gap-1.5"
        >
          <ActionIcon className="h-4 w-4" />
          <span>{actionLabel}</span>
        </Button>
      )}

      {children}
    </div>
  )
}
