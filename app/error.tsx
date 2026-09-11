"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle, RotateCcw, Home, Sparkles } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application runtime error:", error)
  }, [error])

  return (
    <main className="relative min-h-[85vh] flex items-center justify-center p-6 sm:p-10 select-none overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-160 h-100 blur-3xl opacity-20 dark:opacity-25 rounded-full"
        style={{
          background: `radial-gradient(circle, #ef4444 0%, #6366f1 50%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-auto text-center space-y-6">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-500 shadow-xl shadow-red-500/10">
          <AlertCircle className="h-7 w-7" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-black/8 dark:border-white/10 bg-black/3 dark:bg-white/4 text-xs font-mono text-muted-foreground">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>Application Error</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Something unexpected occurred
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
            An error interrupted the request. You can try refreshing the page or navigating back to the homepage.
          </p>
        </div>

        {error.digest && (
          <div className="rounded-xl border border-black/8 dark:border-white/8 bg-muted/40 p-2.5 font-mono text-[11px] text-muted-foreground">
            Error ID: {error.digest}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            onClick={() => reset()}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-5 cursor-pointer shadow-md"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>

          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "gap-2 rounded-full px-5 border-black/10 dark:border-white/12 cursor-pointer"
            )}
          >
            <Home className="h-4 w-4" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
