"use client"

import React from "react"
import { motion, AnimatePresence } from "motion/react"

export interface MobileOverlayProps {
   open: boolean
   onClose: () => void
}

export function MobileOverlay({ open, onClose }: MobileOverlayProps) {
   return (
      <AnimatePresence>
         {open && (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 0.2 }}
               onClick={onClose}
               className="fixed inset-0 z-30 bg-black/25 backdrop-blur-[2px] sm:hidden pointer-events-auto touch-none"
               aria-hidden="true"
            />
         )}
      </AnimatePresence>
   )
}
