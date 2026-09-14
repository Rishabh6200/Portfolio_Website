import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface DbConnectionAlertProps {
  error: string
  title?: string
  className?: string
}

export function DbConnectionAlert({
  error,
  title = "Database Connection Notice",
  className,
}: DbConnectionAlertProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-destructive/20 bg-destructive/5 p-5 space-y-3",
        className
      )}
    >
      <div className="flex items-center gap-2 text-destructive font-medium text-sm">
        <AlertCircle className="h-4 w-4" />
        <span>{title}</span>
      </div>
      <p className="text-xs font-mono text-muted-foreground leading-relaxed">
        {error}
      </p>
    </div>
  )
}
