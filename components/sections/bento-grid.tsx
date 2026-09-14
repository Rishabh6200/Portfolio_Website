"use client"

import React from "react"
import { motion } from "motion/react"
import {
  Layers,
  Layout,
  Server,
  Cloud,
  Database,
  Cpu,
  Code2,
  Terminal,
  CheckCircle2,
} from "lucide-react"
import { SectionHeader } from "@/components/custom-ui/section-header"
import { EmptyState } from "@/components/custom-ui/empty-state"
const ICON_COMPONENTS: Record<string, React.ComponentType<{ className?: string }>> = {
  Server,
  Layout,
  Cloud,
  Database,
  Cpu,
  Code2,
  Terminal,
}

export interface SkillItem {
  name: string
  level: "Proficient" | "Advanced" | "Expert" | string
  highlight?: boolean
}

export interface CategoryWithSkills {
  _id?: string
  title: string
  slug?: string
  description?: string
  icon?: string
  color?: string
  skills: SkillItem[]
}

interface BentoGridSectionProps {
  initialCategories?: CategoryWithSkills[]
}

export function BentoGridSection({ initialCategories = [] }: BentoGridSectionProps) {
  const displayCategories: CategoryWithSkills[] = initialCategories

  return (
    <section
      id="about"
      className="relative py-24 sm:py-28 px-6 sm:px-8 xl:px-12 border-t border-black/6 dark:border-white/6 scroll-mt-24 sm:scroll-mt-28"
    >
      <div id="skills" className="scroll-mt-24 sm:scroll-mt-28" />
      <div className="mx-auto max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
        {/* Section Header */}
        <SectionHeader
          eyebrow="Technical Stack & Core Competencies"
          icon={Layers}
          title="Skills & Technical Capabilities."
          description="A comprehensive breakdown of the languages, frameworks, database systems, and infrastructure tools I leverage in production."
        />

        {/* Dynamic Category & Skills Grid */}
        {displayCategories.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No technical competencies published yet"
            description="Skills and categories will appear here once published from the admin dashboard."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8 items-stretch">
            {displayCategories.map((category, catIdx) => {
              const Icon =
                (category.icon && ICON_COMPONENTS[category.icon]) || Server
              const desc = category.description || ""

            return (
              <motion.div
                key={category._id || category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: catIdx * 0.1 }}
                className="rounded-2xl border border-black/8 dark:border-white/8 bg-white/50 dark:bg-card/50 backdrop-blur-sm p-6 sm:p-7 flex flex-col justify-between hover:border-indigo-500/40 dark:hover:border-indigo-500/30 transition-all duration-300 shadow-sm hover:shadow-md group"
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-transform group-hover:scale-105"
                        style={
                          category.color
                            ? {
                                backgroundColor: `${category.color}15`,
                                color: category.color,
                              }
                            : undefined
                        }
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                          {category.title}
                        </h3>
                        <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                          {category.skills.length} competencies
                        </span>
                      </div>
                    </div>
                  </div>

                  {desc && (
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                      {desc}
                    </p>
                  )}
                </div>

                {/* Skill Badges */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-black/6 dark:border-white/6">
                  {category.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className={`group/skill inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all ${
                        skill.highlight
                          ? "border border-indigo-500/30 bg-indigo-50/70 text-indigo-950 dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-200 hover:border-indigo-500/50 hover:bg-indigo-500/20"
                          : "border border-black/8 bg-white/80 text-neutral-700 hover:border-neutral-400 dark:border-white/8 dark:bg-white/2 dark:text-neutral-300 dark:hover:border-white/20 dark:hover:bg-white/5"
                      }`}
                    >
                      {skill.highlight ? (
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 shrink-0" />
                      ) : (
                        <CheckCircle2 className="h-3 w-3 text-neutral-400 dark:text-neutral-500 shrink-0" />
                      )}
                      <span className="font-medium">{skill.name}</span>
                      <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400 group-hover/skill:text-neutral-700 dark:group-hover/skill:text-neutral-300 transition-colors">
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  </section>
  )
}

export const SkillsSection = BentoGridSection
