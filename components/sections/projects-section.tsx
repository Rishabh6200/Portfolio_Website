"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  FolderGit2,
  ArrowRight,
  ExternalLink,
} from "lucide-react"
import { GithubIcon } from "@/components/custom-ui/icons"
import { SpotlightCard } from "@/components/custom-ui/spotlight-card"
import { Badge } from "@/components/ui/badge"

interface ProjectsSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialProjects?: any[]
}

export function ProjectsSection({ initialProjects = [] }: ProjectsSectionProps = {}) {
  const [activeFilter, setActiveFilter] = useState<string>("All")

  const categories = useMemo(() => {
    const catSet = new Set<string>()
    initialProjects.forEach((p) => {
      p.skills?.forEach((s: any) => {
        if (s?.categoryId?.name) {
          catSet.add(s.categoryId.name)
        }
      })
    })
    return ["All", ...Array.from(catSet)]
  }, [initialProjects])

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return initialProjects
    return initialProjects.filter((p) =>
      p.skills?.some((s: any) => s?.categoryId?.name === activeFilter)
    )
  }, [initialProjects, activeFilter])

  return (
    <section id="projects" className="relative py-24 px-6 sm:px-8 xl:px-12 border-t border-black/6 dark:border-white/6">
      <div className="mx-auto max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 xl:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="font-mono text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
              <FolderGit2 className="h-3.5 w-3.5" />
              <span>Selected Work</span>
            </div>
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Featured projects & applications.
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base xl:text-lg mt-2 max-w-xl xl:max-w-2xl leading-relaxed">
              Architectural deep dives into production solutions, performance optimizations, and open-source packages.
            </p>
          </motion.div>

          {categories.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-wrap gap-1.5 p-1 rounded-xl border border-black/8 bg-white/80 shadow-sm dark:shadow-none dark:border-white/8 dark:bg-[#0d111a]/80 backdrop-blur-md"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`relative px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors z-10 ${
                    activeFilter === cat
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
                  }`}
                >
                  {activeFilter === cat && (
                    <motion.div
                      layoutId="activeFilterTab"
                      className="absolute inset-0 rounded-lg bg-indigo-500/15 border border-indigo-500/30 dark:bg-indigo-600/30 dark:border-indigo-500/40"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {initialProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 dark:border-white/10 p-12 text-center bg-black/2 dark:bg-white/2">
            <FolderGit2 className="h-8 w-8 text-muted-foreground mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-semibold text-foreground">No published projects yet</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Projects and case studies will appear here once published from the admin dashboard.
            </p>
          </div>
        ) : (
          <div
            className={`grid items-stretch gap-5 xl:gap-6 ${
              filteredProjects.length === 1
                ? "grid-cols-1 max-w-xl mx-auto"
                : filteredProjects.length === 2
                  ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full py-12 text-center text-sm text-muted-foreground">
                  No projects found matching the selected filter.
                </div>
              ) : (
                filteredProjects.map((project) => {
                  const projectLogo = project.logo || (project.images && project.images[0]) || null
                  const primaryColor = project.skills?.[0]?.categoryId?.color || "#6366f1"
                  const skills = project.skills || []
                  const maxSkills = 3
                  const visibleSkills = skills.slice(0, maxSkills)
                  const remainingSkillsCount = skills.length - maxSkills

                  return (
                    <motion.div
                      key={project.slug}
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
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={projectLogo}
                                  alt={`${project.title} logo`}
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
                            {visibleSkills.map((skill: any) => {
                              const name = typeof skill === "object" ? skill.name : String(skill)
                              const id = typeof skill === "object" ? skill._id : String(skill)
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
                })
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  )
}
