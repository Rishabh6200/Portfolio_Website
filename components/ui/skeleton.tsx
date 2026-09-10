import { cn } from "cn"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-md bg-neutral-200/80 dark:bg-white/10 dark:border dark:border-white/5",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-linear-to-r before:from-transparent before:via-black/4 dark:before:via-white/8 before:to-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
