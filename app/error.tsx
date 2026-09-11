"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { AlertTriangle, RotateCcw, Home, Sparkles, Copy, Check, Terminal, ArrowLeft } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { DEFAULT_PROFILE } from "@/lib/constants/profile"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    console.error("Application runtime error:", error)
  }, [error])

  // Hide parent body scroll and layout header/footer when error is rendered
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const headers = document.querySelectorAll<HTMLElement>("header")
    const footers = document.querySelectorAll<HTMLElement>("footer")

    headers.forEach((h) => {
      h.style.display = "none"
    })
    footers.forEach((f) => {
      f.style.display = "none"
    })

    return () => {
      document.body.style.overflow = originalBodyOverflow
      headers.forEach((h) => {
        h.style.display = ""
      })
      footers.forEach((f) => {
        f.style.display = ""
      })
    }
  }, [])

  const copyDigest = () => {
    if (!error?.digest) return
    navigator.clipboard.writeText(error.digest)
    setCopied(true)
    toast.success("Error ID copied to clipboard!", {
      description: `Digest: ${error.digest}`,
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setIsRetrying(true)
    setTimeout(() => {
      reset()
    }, 450)
  }

  return (
    <div className="fixed inset-0 z-100 h-screen w-screen flex flex-col items-center justify-between p-6 sm:p-8 overflow-hidden bg-background text-foreground select-none">
      {/* Ambient background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[36px_36px] mask-[radial-gradient(ellipse_75%_65%_at_50%_45%,#000_60%,transparent_100%)] pointer-events-none" />

      {/* Atmospheric glowing orbs */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.25, 0.42, 0.25],
        }}
        transition={{
          duration: 7.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-140 h-140 rounded-full bg-rose-500/20 blur-[130px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.32, 0.15],
        }}
        transition={{
          duration: 9.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
        className="absolute -bottom-36 left-1/2 -translate-x-1/2 w-130 h-130 rounded-full bg-indigo-500/15 blur-[140px] pointer-events-none"
      />

      {/* Top Brand Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full flex items-center justify-between max-w-5xl z-10 shrink-0"
      >
        <Link
          href="/"
          className="flex items-center gap-2 group transition-opacity hover:opacity-80"
        >
          <div className="h-7 w-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-xs font-bold text-rose-400 font-mono">
            {DEFAULT_PROFILE.name.charAt(0)}
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {DEFAULT_PROFILE.name}
          </span>
        </Link>

        <Badge
          variant="outline"
          className="gap-1.5 px-3 py-1 text-[11px] font-mono border-rose-500/30 bg-rose-500/10 text-rose-400 dark:text-rose-300 backdrop-blur-md rounded-full shadow-xs"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
          </span>
          STATUS: 500_RUNTIME_INTERRUPT
        </Badge>
      </motion.div>

      {/* Center Stage Card */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-xl flex flex-col items-center text-center my-auto py-4 z-10 space-y-6"
      >
        {/* Animated Radar Alert Centerpiece */}
        <motion.div
          variants={itemVariants}
          className="relative flex items-center justify-center select-none"
        >
          {/* Subtle radial glow */}
          <div className="absolute inset-0 blur-2xl bg-rose-500/25 rounded-full scale-125 -z-10" />

          {/* Rotating dashed ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-dashed border-rose-500/40 flex items-center justify-center"
          />

          {/* Outer pulsing ring */}
          <motion.div
            animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.35, 0.75, 0.35] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-rose-500/30 bg-rose-500/5"
          />

          {/* Floating alert core icon */}
          <motion.div
            animate={{ y: [-3, 4, -3] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border border-rose-500/35 bg-linear-to-b from-rose-500/20 to-rose-950/40 shadow-xl shadow-rose-500/20 backdrop-blur-md"
          >
            <AlertTriangle className="h-7 w-7 sm:h-8 sm:w-8 text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.6)]" />
          </motion.div>
        </motion.div>

        {/* Category Pill & Typography */}
        <motion.div variants={itemVariants} className="space-y-3 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-rose-500/20 bg-rose-500/10 text-xs font-mono text-rose-300 dark:text-rose-300 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-rose-400" />
            <span>Application Runtime Error</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Something unexpected{" "}
            <span className="bg-linear-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
              occurred
            </span>
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
            An unhandled runtime error interrupted this request. You can reinitialize the application state or return to safety.
          </p>
        </motion.div>

        {/* Error ID / Diagnostics Terminal */}
        {error.digest && (
          <motion.div variants={itemVariants} className="w-full max-w-sm">
            <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/4 dark:bg-white/4 text-xs font-mono text-muted-foreground shadow-2xs backdrop-blur-md">
              <div className="flex items-center gap-2 truncate">
                <Terminal className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                <span className="truncate">
                  Error ID:{" "}
                  <strong className="text-foreground tracking-wider">
                    {error.digest}
                  </strong>
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={copyDigest}
                className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-[11px] font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                title="Copy Error ID"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Action Controls */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3 pt-2"
        >
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Button
              type="button"
              size="lg"
              onClick={handleReset}
              disabled={isRetrying}
              className="gap-2 h-10 sm:h-11 px-6 rounded-full bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium shadow-lg shadow-indigo-500/25 cursor-pointer transition-all"
            >
              <RotateCcw
                className={cn("h-4 w-4 transition-transform duration-500", isRetrying && "animate-spin")}
              />
              <span>{isRetrying ? "Reinitializing..." : "Try Again"}</span>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "gap-2 h-10 sm:h-11 px-6 rounded-full border-black/12 dark:border-white/12 hover:bg-black/5 dark:hover:bg-white/6 cursor-pointer font-medium"
              )}
            >
              <Home className="h-4 w-4" />
              <span>Go Home</span>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <button
              type="button"
              onClick={() => window.history.back()}
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "gap-2 h-10 sm:h-11 px-5 text-muted-foreground hover:text-foreground cursor-pointer"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous Page</span>
            </button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Footer Signature */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-5xl flex items-center justify-center text-[11px] font-mono text-muted-foreground/50 z-10 pb-1 shrink-0"
      >
        <span>{DEFAULT_PROFILE.name} • {DEFAULT_PROFILE.role}</span>
      </motion.footer>
    </div>
  )
}
