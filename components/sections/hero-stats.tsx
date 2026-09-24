"use client"

import React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import type { ProfileStat } from "@/lib/constants/profile"

export interface HeroStatsProps {
  stats?: ProfileStat[]
  className?: string
}

export function HeroStats({ stats, className }: HeroStatsProps) {
  if (!stats || stats.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "mt-8 sm:mt-14 xl:mt-20 w-full border-t border-black/8 dark:border-white/8 pt-6 sm:pt-8 xl:pt-12",
        className
      )}
    >
      <div
        className={cn(
          "grid justify-center items-start",
          stats.length === 1 && "grid-cols-1 max-w-xs mx-auto gap-4",
          stats.length === 2 && "grid-cols-2 max-w-xl mx-auto gap-3 sm:gap-8 xl:gap-12",
          stats.length === 3 && "grid-cols-3 max-w-4xl mx-auto gap-2 xs:gap-4 sm:gap-8 xl:gap-12",
          stats.length === 4 && "grid-cols-2 sm:grid-cols-4 w-full gap-3 sm:gap-6 xl:gap-10",
          stats.length > 4 && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 w-full gap-3 sm:gap-6 xl:gap-10"
        )}
      >
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="group flex flex-col items-center text-center px-1 xs:px-2 sm:px-4 py-1.5 sm:py-2 transition-transform duration-200"
          >
            <span className="font-mono text-xl xs:text-2xl sm:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight transition-transform duration-200 group-hover:scale-105">
              {stat.value}
            </span>
            <span className="text-[11px] xs:text-xs sm:text-sm xl:text-base font-medium text-neutral-800 dark:text-neutral-200 mt-1 sm:mt-1.5 leading-tight text-center">
              {stat.label}
            </span>
            {stat.subtext && (
              <span className="text-[10px] xs:text-[11px] xl:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 sm:mt-1 max-w-60 leading-tight line-clamp-2 sm:line-clamp-none text-center">
                {stat.subtext}
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
