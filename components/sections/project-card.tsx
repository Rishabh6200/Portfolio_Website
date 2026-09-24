"use client"

import React from "react"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight, ExternalLink } from "lucide-react"
import { GithubIcon } from "@/components/custom-ui/icons"
import { SpotlightCard } from "@/components/custom-ui/spotlight-card"
import Image from "next/image"
import { getMediaUrl } from "@/lib/utils"

export interface ProjectCardData {
  id?: string
  slug: string
  title: string
  role?: string
  tagline?: string
  description?: string
  logo?: string
  images?: readonly string[] | string[]
  featured?: boolean
  githubUrl?: string
  liveUrl?: string
  skills?: (string | { _id?: string; id?: string; name: string; categoryId?: { color?: string; name?: string } })[]
}

export interface ProjectCardProps {
  project: ProjectCardData
}

export function ProjectCard({ project }: ProjectCardProps) {
  const rawLogo = project.logo || (project.images && project.images[0]) || null
  const projectLogo = getMediaUrl(rawLogo)
  const firstSkill = project.skills?.[0]
  const primaryColor =
    (typeof firstSkill === "object" && firstSkill?.categoryId?.color) || "#6366f1"
  const skills = project.skills || []
  const maxSkills = 3
  const visibleSkills = skills.slice(0, maxSkills)
  const remainingSkillsCount = skills.length - maxSkills
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="h-full flex flex-col"
    >
      <SpotlightCard
        spotlightColor={`${primaryColor}18`}
        className="group relative h-full flex flex-col justify-between p-5 sm:p-5.5 transition-all duration-300 hover:border-black/20 dark:hover:border-white/20 hover:shadow-lg dark:hover:shadow-indigo-500/5"
      >
        <div className="flex-1 flex flex-col">
          {/* Header: Logo on left, Title + Role + Actions on right */}
          <div className="flex items-start gap-3.5 mb-2.5">
            <Link
              href={`/projects/${project.slug}`}
              className="relative h-12 w-12 sm:h-13 sm:w-13 rounded-xl sm:rounded-2xl border border-black/8 dark:border-white/10 bg-neutral-100 dark:bg-[#121826] p-2 flex items-center justify-center shrink-0 shadow-xs group-hover:border-indigo-500/40 group-hover:shadow-indigo-500/10 group-hover:scale-105 transition-all duration-300"
            >
              {projectLogo ? (
                <Image
                  src={projectLogo}
                  alt={`${project.title} logo`}
                  height={48}
                  width={48}
                  className="h-full w-full object-contain rounded-lg"
                />
              ) : (
                <div className="h-full w-full rounded-lg bg-indigo-500/10 dark:bg-indigo-500/15 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400 font-mono text-sm sm:text-base">
                  {project.title.slice(0, 2).toUpperCase()}
                </div>
              )}
            </Link>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold truncate">
                    {project.role || "Full-Stack Developer"}
                  </span>
                  {project.featured && (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                      Featured
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0 -mr-1">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      aria-label={`GitHub repository for ${project.title}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GithubIcon className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                      aria-label={`Live demo for ${project.title}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <Link
                href={`/projects/${project.slug}`}
                className="block mt-0.5 group/title"
              >
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-neutral-900 dark:text-white group-hover/title:text-indigo-600 dark:group-hover/title:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span className="truncate">{project.title}</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all shrink-0 text-indigo-600 dark:text-indigo-400" />
                </h3>
              </Link>
            </div>
          </div>

          {/* Tagline / Summary: fixed height so cards remain identical */}
          <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-[13px] leading-relaxed line-clamp-2 h-10 flex items-center">
            {project.tagline || project.description}
          </p>

          {/* Skills / Tech Stack: pinned to bottom of body */}
          <div className="mt-auto pt-3 flex flex-wrap items-center gap-1.5">
            {visibleSkills.map((skill) => {
              const name = typeof skill === "object" ? skill.name : String(skill)
              const id = typeof skill === "object" ? (skill._id ?? skill.id ?? skill.name) : String(skill)
              return (
                <span
                  key={id}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-mono bg-neutral-100 dark:bg-white/4 border border-black/6 dark:border-white/7 text-neutral-600 dark:text-neutral-300 font-medium"
                >
                  {name}
                </span>
              )
            })}
            {remainingSkillsCount > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-mono font-medium bg-neutral-100/80 dark:bg-white/2 border border-black/6 dark:border-white/5 text-neutral-500 dark:text-neutral-400">
                +{remainingSkillsCount}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Actions: pinned to bottom */}
        <div className="mt-4 pt-3 border-t border-black/6 dark:border-white/6 flex items-center justify-between shrink-0">
          <Link
            href={`/projects/${project.slug}`}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1.5 transition-colors group/link"
          >
            <span>Explore Project</span>
            <ArrowRight className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>

          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 flex items-center gap-1 transition-colors"
            >
              <span>Live Preview</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600">
              Architecture Docs
            </span>
          )}
        </div>
      </SpotlightCard>
    </motion.div>
  )
}
