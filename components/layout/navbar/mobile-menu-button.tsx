"use client"

import React from "react"
import { motion } from "motion/react"
import { EASE_OUT } from "./constants"

export interface MobileMenuButtonProps {
   open: boolean
   onToggle: () => void
   reducedMotion?: boolean
}

export function MobileMenuButton({ open, onToggle, reducedMotion }: MobileMenuButtonProps) {
   return (
      <button
         type="button"
         onClick={onToggle}
         className="sm:hidden flex h-9 w-9 items-center justify-center rounded-full border border-black/8 bg-black/2 text-neutral-700 transition-colors hover:border-black/15 hover:bg-black/4 hover:text-neutral-900 dark:border-white/8 dark:bg-white/3 dark:text-neutral-300 dark:hover:border-white/20 dark:hover:bg-white/8 dark:hover:text-white select-none focus:outline-hidden active:scale-95"
         aria-label={open ? "Close navigation menu" : "Open navigation menu"}
         aria-expanded={open}
         aria-controls="mobile-navigation"
      >
         <div className="relative h-3.5 w-3.5 flex flex-col justify-center items-center">
            <motion.span
               animate={
                  open
                     ? { rotate: 45, y: 0 }
                     : { rotate: 0, y: -4 }
               }
               transition={{ duration: reducedMotion ? 0.05 : 0.22, ease: EASE_OUT }}
               className="absolute h-[1.5px] w-3.5 rounded-full bg-current"
            />
            <motion.span
               animate={
                  open
                     ? { opacity: 0, scale: 0.5 }
                     : { opacity: 1, scale: 1 }
               }
               transition={{ duration: reducedMotion ? 0.05 : 0.12 }}
               className="absolute h-[1.5px] w-3.5 rounded-full bg-current"
            />
            <motion.span
               animate={
                  open
                     ? { rotate: -45, y: 0 }
                     : { rotate: 0, y: 4 }
               }
               transition={{ duration: reducedMotion ? 0.05 : 0.22, ease: EASE_OUT }}
               className="absolute h-[1.5px] w-3.5 rounded-full bg-current"
            />
         </div>
      </button>
   )
}
