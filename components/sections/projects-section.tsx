"use client"

import { useState, useMemo } from "react"
import { AnimatePresence } from "motion/react"
import { FolderGit2 } from "lucide-react"
import { EmptyState } from "@/components/custom-ui/empty-state"
import { SectionHeader } from "@/components/custom-ui/section-header"
import { ProjectCard, type ProjectCardData } from "@/components/sections/project-card"

interface ProjectsSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialProjects?: any[]
}

export function ProjectsSection({ initialProjects = [] }: ProjectsSectionProps = {}) {
  const [activeFilter] = useState<string>("All")

  const filteredProjects = useMemo(() => {
    if (activeFilter === "All") return initialProjects
    return initialProjects.filter((p) =>
      p.skills?.some((s: any) => s?.categoryId?.name === activeFilter)
    )
  }, [initialProjects, activeFilter])

  return (
    <section id="projects" className="relative py-24 px-6 sm:px-8 xl:px-12 border-t border-black/6 dark:border-white/6 scroll-mt-24 sm:scroll-mt-28">
      <div className="mx-auto max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
        <SectionHeader
          eyebrow="Selected Work"
          icon={FolderGit2}
          title="Featured projects & applications."
          description="Architectural deep dives into production solutions, performance optimizations, and open-source packages."
        />

        {initialProjects.length === 0 ? (
          <EmptyState
            icon={FolderGit2}
            title="No published projects yet"
            description="Projects and case studies will appear here once published from the admin dashboard."
          />
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
                filteredProjects.map((project: ProjectCardData) => (
                  <ProjectCard key={project.slug} project={project} />
                ))
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  )
}
