"use client"

import React from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { ArrowUpRight, ChevronRight } from "lucide-react"
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/custom-ui/icons"
import type { ProfileData } from "@/lib/constants/profile"
import { NAV_ITEMS, EASE_OUT } from "./constants"

export interface MobileMenuProps {
   open: boolean
   profile: ProfileData
   onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void
   onClose: () => void
   reducedMotion?: boolean
}

export function MobileMenu({
   open,
   profile,
   onNavClick,
   onClose,
   reducedMotion,
}: MobileMenuProps) {
   return (
      <AnimatePresence initial={false}>
         {open && (
            <motion.div
               id="mobile-navigation"
               role="region"
               aria-label="Mobile navigation"
               initial={
                  reducedMotion
                     ? { opacity: 0 }
                     : { opacity: 0, height: 0 }
               }
               animate={
                  reducedMotion
                     ? { opacity: 1 }
                     : {
                        opacity: 1,
                        height: "auto",
                        transition: {
                           height: { duration: 0.28, ease: EASE_OUT },
                           opacity: { duration: 0.18, delay: 0.04 },
                        },
                     }
               }
               exit={
                  reducedMotion
                     ? { opacity: 0 }
                     : {
                        opacity: 0,
                        height: 0,
                        transition: {
                           height: { duration: 0.2, ease: [0.32, 0.72, 0, 1] },
                           opacity: { duration: 0.12 },
                        },
                     }
               }
               className="sm:hidden overflow-hidden"
            >
               <div className="px-4 pb-3.5 pt-1 flex flex-col gap-2.5">
                  <div className="h-px w-full bg-black/6 dark:bg-white/8" />

                  <div className="flex flex-col gap-1">
                     {NAV_ITEMS.map((item, idx) => {
                        const Icon = item.icon
                        return (
                           <motion.div
                              key={item.href}
                              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: reducedMotion ? 0 : 0.03 * (idx + 1) }}
                           >
                              <Link
                                 href={item.href}
                                 onClick={(e) => onNavClick(e, item.href)}
                                 className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-neutral-700 hover:text-neutral-900 hover:bg-black/4 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-white/6 transition-colors"
                              >
                                 <div className="flex items-center gap-2.5">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-black/4 dark:bg-white/6 text-neutral-600 dark:text-neutral-400">
                                       <Icon className="h-3 w-3" />
                                    </div>
                                    <span>{item.title}</span>
                                 </div>
                                 <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                              </Link>
                           </motion.div>
                        )
                     })}
                  </div>

                  <div className="h-px w-full bg-black/6 dark:bg-white/8" />

                  <div className="flex items-center justify-between px-1 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                     <div className="flex items-center gap-1.5">
                        <span className="relative flex h-1.5 w-1.5">
                           <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                           <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </span>
                        <span className="text-[10px]">{profile.status}</span>
                     </div>

                     <div className="flex items-center gap-2">
                        {profile.socials.github && (
                           <a
                              href={profile.socials.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                              aria-label="GitHub profile"
                           >
                              <GithubIcon className="h-3.5 w-3.5" />
                           </a>
                        )}
                        {profile.socials.linkedin && (
                           <a
                              href={profile.socials.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                              aria-label="LinkedIn profile"
                           >
                              <LinkedinIcon className="h-3.5 w-3.5" />
                           </a>
                        )}
                        {profile.socials.twitter && (
                           <a
                              href={profile.socials.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                              aria-label="X (Twitter) profile"
                           >
                              <XIcon className="h-3.5 w-3.5" />
                           </a>
                        )}
                     </div>
                  </div>

                  <Link
                     href="/#contact"
                     onClick={onClose}
                     className="flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black py-2.5 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
                  >
                     <span>Let&apos;s Build Together</span>
                     <ArrowUpRight className="h-3 w-3" />
                  </Link>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
   )
}
