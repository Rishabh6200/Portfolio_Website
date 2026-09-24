"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { Home, ArrowLeft, Compass, Sparkles, Terminal } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DEFAULT_PROFILE } from "@/lib/constants/profile"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    // Hide parent body scroll and layout header/footer when 404 is rendered
    const originalBodyOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const headers = document.querySelectorAll<HTMLElement>("header")
    const footers = document.querySelectorAll<HTMLElement>(
      "footer:not([data-not-found-footer])"
    )

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

  return (
    <div className="fixed inset-0 z-100 h-screen w-screen flex flex-col items-center justify-between p-6 sm:p-8 overflow-hidden bg-background text-foreground select-none">
      {/* Ambient background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[36px_36px] mask-[radial-gradient(ellipse_75%_65%_at_50%_45%,#000_60%,transparent_100%)] pointer-events-none" />

      {/* Atmospheric glowing orbs */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-137.5 h-137.5 rounded-full bg-indigo-500/15 blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
        className="absolute -bottom-36 left-1/2 -translate-x-1/2 w-125 h-125 rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none"
      />

      {/* Spacer / Brand Top */}
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
          <div className="h-7 w-7 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400 font-mono">
            {DEFAULT_PROFILE.name.charAt(0)}
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {DEFAULT_PROFILE.name}
          </span>
        </Link>

        <Badge
          variant="outline"
          className="gap-1.5 px-3 py-1 text-[11px] font-mono border-indigo-500/30 bg-indigo-500/10 text-indigo-400 dark:text-indigo-300 backdrop-blur-md rounded-full shadow-xs"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
          STATUS: 404_PAGE_NOT_FOUND
        </Badge>
      </motion.div>

      {/* Center Hero Stage */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl flex flex-col items-center text-center my-auto py-4 z-10 space-y-5"
      >
        {/* Animated 404 Hologram */}
        <motion.div
          variants={itemVariants}
          className="relative flex items-center justify-center select-none"
        >
          {/* Subtle radial glow behind the numbers */}
          <div className="absolute inset-0 blur-3xl bg-indigo-500/20 rounded-full scale-75 -z-10" />

          <motion.div
            animate={{ y: [-4, 6, -4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <span className="text-7xl sm:text-9xl md:text-[11.5rem] font-black tracking-tighter leading-none bg-clip-text text-transparent bg-linear-to-b from-foreground via-foreground/75 to-foreground/20 drop-shadow-2xl">
              4
            </span>

            {/* Orbiting Center Portal */}
            <div className="relative mx-2 sm:mx-4 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 sm:w-22 sm:h-22 md:w-28 md:h-28 rounded-full border-2 border-dashed border-indigo-500/40 flex items-center justify-center"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 rounded-full border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-xs" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180, 270, 360] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute"
              >
                <Sparkles className="w-6 h-6 sm:w-9 sm:h-9 text-indigo-400 opacity-90 drop-shadow-[0_0_14px_rgba(99,102,241,0.6)]" />
              </motion.div>
            </div>

            <span className="text-7xl sm:text-9xl md:text-[11.5rem] font-black tracking-tighter leading-none bg-clip-text text-transparent bg-linear-to-b from-foreground via-foreground/75 to-foreground/20 drop-shadow-2xl">
              4
            </span>
          </motion.div>
        </motion.div>

        {/* Title & Description */}
        <motion.div variants={itemVariants} className="space-y-2.5 max-w-lg">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            System Dimension Not Found
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            The route coordinates you specified cannot be resolved across active clusters.
            The page may have been relocated, archived, or dissolved into the digital ether.
          </p>
        </motion.div>

        {/* Terminal Diagnostic Pill */}
        <motion.div variants={itemVariants}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-border/70 bg-muted/40 text-[11px] font-mono text-muted-foreground shadow-2xs">
            <Terminal className="h-3.5 w-3.5 text-indigo-400" />
            <span>HTTP 404 • ERR_ROUTE_UNRESOLVED</span>
          </div>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center justify-center gap-3 pt-2"
        >
          {/* Return to Orbit Button - Deep vivid indigo with clear white text */}
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-10 sm:h-11 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Return to Orbit</span>
          </Link>

          <Button
            size="lg"
            variant="outline"
            onClick={() => router.back()}
            className="h-10 sm:h-11 gap-2 px-6 cursor-pointer hover:bg-muted/70 transition-all hover:scale-[1.02]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </Button>

          <Link
            href="/#projects"
            className={buttonVariants({
              variant: "ghost",
              size: "lg",
              className:
                "h-10 sm:h-11 gap-2 px-5 text-muted-foreground hover:text-foreground cursor-pointer",
            })}
          >
            <Compass className="h-4 w-4" />
            <span>View Projects</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Footer Signature */}
      <motion.footer
        data-not-found-footer="true"
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
