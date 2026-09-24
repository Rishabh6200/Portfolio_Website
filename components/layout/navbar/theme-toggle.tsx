"use client"

import React from "react"
import { motion, AnimatePresence } from "motion/react"
import { Sun, Moon } from "lucide-react"
import { EASE_OUT } from "./constants"

export interface ThemeToggleProps {
   mounted: boolean
   resolvedTheme: string | undefined
   onToggle: () => void
   reducedMotion?: boolean
}

export function ThemeToggle({
   mounted,
   resolvedTheme,
   onToggle,
   reducedMotion,
}: ThemeToggleProps) {
   return (
      <button
         type="button"
         onClick={onToggle}
         className="relative flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-black/8 bg-black/2 text-neutral-600 transition-transform duration-150 hover:scale-105 active:scale-90 hover:border-black/15 hover:bg-black/4 hover:text-neutral-900 dark:border-white/8 dark:bg-white/3 dark:text-neutral-400 dark:hover:border-white/20 dark:hover:bg-white/8 dark:hover:text-white select-none focus:outline-hidden overflow-hidden"
         aria-label="Toggle theme"
      >
         {mounted && (
            <AnimatePresence mode="wait" initial={false}>
               {resolvedTheme === "dark" ? (
                  <motion.div
                     key="sun"
                     initial={reducedMotion ? { opacity: 0 } : { rotate: -90, scale: 0, opacity: 0 }}
                     animate={reducedMotion ? { opacity: 1 } : { rotate: 0, scale: 1, opacity: 1 }}
                     exit={reducedMotion ? { opacity: 0 } : { rotate: 90, scale: 0, opacity: 0 }}
                     transition={{ duration: reducedMotion ? 0.1 : 0.22, ease: EASE_OUT }}
                     className="flex items-center justify-center"
                  >
                     <Sun className="h-4 w-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
                  </motion.div>
               ) : (
                  <motion.div
                     key="moon"
                     initial={reducedMotion ? { opacity: 0 } : { rotate: 90, scale: 0, opacity: 0 }}
                     animate={reducedMotion ? { opacity: 1 } : { rotate: 0, scale: 1, opacity: 1 }}
                     exit={reducedMotion ? { opacity: 0 } : { rotate: -90, scale: 0, opacity: 0 }}
                     transition={{ duration: reducedMotion ? 0.1 : 0.22, ease: EASE_OUT }}
                     className="flex items-center justify-center"
                  >
                     <Moon className="h-4 w-4 text-indigo-600 drop-shadow-[0_0_8px_rgba(99,102,241,0.35)]" />
                  </motion.div>
               )}
            </AnimatePresence>
         )}
      </button>
   )
}
