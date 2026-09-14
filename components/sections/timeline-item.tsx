"use client"

import React from "react"
import { motion } from "motion/react"
import { Calendar, MapPin } from "lucide-react"

export interface TimelineItemProps {
  period: string
  periodBadge?: React.ReactNode
  title: string
  location?: string
  subtitleDetails?: (string | undefined | null)[]
  heading: string
  description?: string
  points?: string[]
  technologies?: string[]
  index?: number
}

export function TimelineItem({
  period,
  periodBadge,
  title,
  location,
  subtitleDetails = [],
  heading,
  description,
  points = [],
  technologies = [],
  index = 0,
}: TimelineItemProps) {
  const filteredDetails = subtitleDetails.filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="py-10 sm:py-12 border-b border-black/8 dark:border-white/8 transition-colors hover:bg-black/1 dark:hover:bg-white/1"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-neutral-400 shrink-0" />
              <span>{period}</span>
            </span>

            {periodBadge}
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {title}
          </h3>

          {(location || filteredDetails.length > 0) && (
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 flex-wrap">
              {location && (
                <>
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span>{location}</span>
                </>
              )}
              {filteredDetails.map((detail, idx) => (
                <React.Fragment key={idx}>
                  <span>•</span>
                  <span>{detail}</span>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-4">
          <div>
            <h4 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {heading}
            </h4>
            {description && (
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mt-1.5">
                {description}
              </p>
            )}
          </div>

          {points.length > 0 && (
            <div className="space-y-2.5 pt-1">
              {points.map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300"
                >
                  <span className="font-mono text-indigo-600 dark:text-indigo-400 select-none pt-0.5">
                    —
                  </span>
                  <span className="leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          )}

          {technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-3">
              {technologies.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[10px] px-2 py-0.5 rounded-md border border-black/6 bg-black/2 text-neutral-600 dark:border-white/6 dark:bg-white/2 dark:text-neutral-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
