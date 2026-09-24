"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, ExternalLink, Layers, Sparkles } from "lucide-react"
import { GithubIcon } from "@/components/custom-ui/icons"
import { Badge } from "@/components/ui/badge"
import type { WebProjectDetail } from "../../types/detail.type"
import { ProjectImageGallery } from "./project-image-gallery"

export interface ProjectDetailViewProps {
   project: WebProjectDetail
   prevProject: WebProjectDetail | null
   nextProject: WebProjectDetail | null
}

export function ProjectDetailView({
   project,
   prevProject,
   nextProject,
}: ProjectDetailViewProps) {
   return (
      <main className="relative min-h-screen bg-background text-foreground overflow-x-clip">
         <div
            className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-200 h-125 blur-3xl opacity-20 dark:opacity-20 rounded-full"
            style={{
               background: `radial-gradient(circle, #6366f1, transparent 70%)`,
            }}
         />

         <article className="relative mx-auto max-w-4xl xl:max-w-5xl px-4 sm:px-6 md:px-8 xl:px-12 pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24">
            <Link
               href="/#projects"
               className="group inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-6 sm:mb-8 md:mb-10"
            >
               <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
               <span>Back to projects</span>
            </Link>

            <header className="space-y-6">
               <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-mono">
                     {project.role}
                  </Badge>
                  {project.featured && (
                     <Badge
                        variant="outline"
                        className="text-xs font-mono text-amber-500 border-amber-500/30 bg-amber-500/10"
                     >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Featured Project
                     </Badge>
                  )}
               </div>

               <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 md:gap-6">
                  {project.logo && (
                     <div className="relative h-14 w-14 sm:h-18 sm:w-18 md:h-20 md:w-20 rounded-2xl border border-black/10 dark:border-white/10 bg-muted/40 p-2 sm:p-2.5 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
                        <Image
                           src={project.logo}
                           alt={`${project.title} logo`}
                           width={80}
                           height={80}
                           className="h-full w-full object-contain"
                           loading="eager"
                        />
                     </div>
                  )}
                  <div className="space-y-2 sm:space-y-3 min-w-0 flex-1">
                     <h1 className="text-2xl sm:text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white wrap-break-word">
                        {project.title}
                     </h1>
                     <p className="text-base sm:text-lg md:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal max-w-3xl">
                        {project.tagline}
                     </p>
                  </div>
               </div>

               <div className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed border-l-2 border-indigo-500/40 pl-3.5 sm:pl-4 py-1 whitespace-pre-line wrap-break-word">
                  <p>{project.description}</p>
               </div>

               <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-2">
                  {project.liveUrl && (
                     <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] shadow-xs"
                     >
                        <span>Visit Live Demo</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                     </a>
                  )}

                  {project.githubUrl && (
                     <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 dark:border-white/12 bg-black/3 dark:bg-white/4 px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-neutral-900 dark:text-white transition-colors hover:bg-black/6 dark:hover:bg-white/8 active:scale-[0.98]"
                     >
                        <GithubIcon className="h-4 w-4" />
                        <span>View Source Code</span>
                     </a>
                  )}
               </div>
            </header>

            <ProjectImageGallery
               images={project.images || []}
               title={project.title}
               liveUrl={project.liveUrl}
            />

            {project.skills && project.skills.length > 0 && (
               <section className="mt-14 space-y-4">
                  <div className="font-mono text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                     <Layers className="h-3.5 w-3.5" />
                     <span>Technologies & Core Stack</span>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-2.5">
                     {project.skills.map((skill) => (
                        <Badge
                           key={skill.id}
                           variant="secondary"
                           className="h-auto py-1.5 px-3 text-xs font-mono gap-2 rounded-xl border border-black/8 dark:border-white/10 font-normal"
                        >
                           <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                              {skill.name}
                           </span>
                           {skill.categoryId?.name && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-neutral-500 dark:text-neutral-400">
                                 {skill.categoryId.name}
                              </span>
                           )}
                        </Badge>
                     ))}
                  </div>
               </section>
            )}

            <footer className="mt-16 sm:mt-20 pt-8 border-t border-black/8 dark:border-white/8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
               {prevProject ? (
                  <Link
                     href={`/projects/${prevProject.slug}`}
                     className="group flex flex-col items-start p-3.5 sm:p-4 rounded-xl border border-black/8 dark:border-white/8 bg-black/2 dark:bg-white/2 hover:bg-black/4 dark:hover:bg-white/4 hover:border-black/15 dark:hover:border-white/15 sm:w-1/2 sm:max-w-[48%] transition-all"
                  >
                     <span className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 uppercase tracking-wider group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-1" />
                        Previous Project
                     </span>
                     <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mt-1 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                        {prevProject.title}
                     </span>
                  </Link>
               ) : (
                  <div className="hidden sm:block" />
               )}

               {nextProject && (
                  <Link
                     href={`/projects/${nextProject.slug}`}
                     className="group flex flex-col items-start sm:items-end p-3.5 sm:p-4 rounded-xl border border-black/8 dark:border-white/8 bg-black/2 dark:bg-white/2 hover:bg-black/4 dark:hover:bg-white/4 hover:border-black/15 dark:hover:border-white/15 sm:w-1/2 sm:max-w-[48%] sm:text-right sm:ml-auto transition-all"
                  >
                     <span className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 uppercase tracking-wider group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors sm:justify-end">
                        Next Project
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                     </span>
                     <span className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white mt-1 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                        {nextProject.title}
                     </span>
                  </Link>
               )}
            </footer>
         </article>
      </main>
   )
}
