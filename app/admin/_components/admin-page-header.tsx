import Link from "next/link"
import { Plus } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface AdminPageHeaderProps {
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  actionIcon?: React.ComponentType<{ className?: string }>
  actionSize?: "default" | "sm" | "lg" | "icon"
  children?: React.ReactNode
  className?: string
}

export function AdminPageHeader({
  title,
  description,
  actionLabel,
  actionHref,
  actionIcon: ActionIcon = Plus,
  actionSize = "default",
  children,
  className,
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border",
        className
      )}
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      {(actionHref || children) && (
        <div className="flex items-center gap-2">
          {children}
          {actionHref && actionLabel && (
            <Link
              href={actionHref}
              className={buttonVariants({ size: actionSize })}
            >
              <ActionIcon className="h-4 w-4" />
              <span>{actionLabel}</span>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
