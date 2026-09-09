"use client"

import { useState } from "react"
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
import { portfolioData } from "@/data/portfolio-data"

type CategoryFilter = "All" | "Full-Stack" | "Backend APIs" | "Web Apps"

export function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>("All")

  const filteredProjects = portfolioData.projects.filter(
    (p) => activeFilter === "All" || p.category === activeFilter
  )

  const categories: CategoryFilter[] = ["All", "Full-Stack", "Backend APIs", "Web Apps"]

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
              Featured engineering systems.
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base xl:text-lg mt-2 max-w-xl xl:max-w-2xl leading-relaxed">
              Architectural deep dives into production solutions, performance optimizations, and open-source packages.
            </p>
          </motion.div>

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
                className={`relative px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors z-10 ${activeFilter === cat
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <SpotlightCard
                  spotlightColor={`${project.accentColor}20`}
                  className="group relative h-full flex flex-col justify-between p-6 sm:p-7 transition-all hover:border-black/20 dark:hover:border-white/20"
                >
                  <div>
                    <div className="mb-3">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 font-semibold">
                        {project.category}
                      </span>
                    </div>

                    <Link
                      href={`/projects/${project.slug}`}
                      className="block group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors"
                    >
                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center justify-between gap-2">
                        <span>{project.title}</span>
                        <ArrowRight className="h-4 w-4 text-neutral-400 group-hover:text-indigo-600 dark:text-neutral-500 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                      </h3>
                    </Link>

                    <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm mt-2.5 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className="font-mono text-[10px] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mt-7 pt-4 border-t border-black/6 dark:border-white/6 flex items-center justify-between">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
                    >
                      <span>Explore Project</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <div className="flex items-center gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors p-1"
                          aria-label={`GitHub repository for ${project.title}`}
                        >
                          <GithubIcon className="h-4 w-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors p-1"
                          aria-label={`Live demo for ${project.title}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
