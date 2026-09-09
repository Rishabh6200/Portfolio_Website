import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  Terminal,
} from "lucide-react"
import { GithubIcon } from "@/components/custom-ui/icons"
import { Badge } from "@/components/ui/badge"
import { portfolioData } from "@/data/portfolio-data"
import { projectService } from "@/services"

interface PageProps {
  params: Promise<{ slug: string }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await projectService.getBySlugWithContext(slug)

  if (!data || !data.project) {
    return {
      title: "Project Not Found",
    }
  }

  const { project } = data

  return {
    title: `${project.title} — Technical Overview | ${portfolioData.personal.name}`,
    description: project.description,
    openGraph: {
      title: `${project.title} — Technical Overview`,
      description: project.tagline,
    },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const data = await projectService.getBySlugWithContext(slug)

  if (!data || !data.project) {
    notFound()
  }

  const { project, prevProject, nextProject } = data

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-200 h-125 blur-3xl opacity-20 dark:opacity-20 rounded-full"
        style={{
          background: `radial-gradient(circle, ${project.accentColor || "#6366f1"}, transparent 70%)`,
        }}
      />

      <article className="relative mx-auto max-w-4xl xl:max-w-5xl px-6 sm:px-8 xl:px-12 pt-32 pb-24">
        <Link
          href="/#projects"
          className="group inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors mb-10"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to projects</span>
        </Link>

        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="text-xs font-mono">
              {project.category}
            </Badge>
            <Badge variant="outline" className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
              {project.role}
            </Badge>
            {project.featured && (
              <Badge variant="outline" className="text-xs font-mono">
                <Sparkles className="h-3 w-3 text-indigo-400 mr-1" />
                Featured System
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {project.title}
            </h1>
            <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal max-w-3xl">
              {project.tagline}
            </p>
          </div>

          <div className="text-sm sm:text-base text-neutral-700 dark:text-neutral-400 leading-relaxed border-l-2 border-indigo-500/40 pl-4 py-1">
            <p>{project.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
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
                className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/12 bg-black/3 dark:bg-white/4 px-5 py-2.5 text-xs sm:text-sm font-medium text-neutral-900 dark:text-white transition-colors hover:bg-black/6 dark:hover:bg-white/8 active:scale-[0.98]"
              >
                <GithubIcon className="h-4 w-4" />
                <span>View Source Code</span>
              </a>
            )}
          </div>
        </header>

        {/* Project Cover Image (if uploaded) */}
        {project.coverImage && (
          <div className="mt-10 overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl bg-neutral-100 dark:bg-[#0e131f] aspect-video w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverImage}
              alt={project.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <section className="mt-16 space-y-4">
          <div className="font-mono text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            <Layers className="h-3.5 w-3.5" />
            <span>System Architecture & Solution</span>
          </div>

          <div className="rounded-3xl border border-black/8 dark:border-white/10 bg-black/1 dark:bg-white/2 p-6 sm:p-8 space-y-6">
            {project.architectureOverview && (
              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-500/10 p-5 font-mono text-xs text-neutral-800 dark:text-neutral-200">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
                  <Terminal className="h-3.5 w-3.5" />
                  <span>Architecture Blueprint</span>
                </div>
                <p className="leading-relaxed whitespace-pre-line">{project.architectureOverview}</p>
              </div>
            )}

            {/* Architecture Diagram Media (if uploaded) */}
            {project.architectureDiagram && (
              <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-100 dark:bg-[#0e131f] aspect-video w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.architectureDiagram}
                  alt={`${project.title} Architecture Diagram`}
                  className="h-full w-full object-contain p-4"
                />
              </div>
            )}

            {project.solution && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white uppercase font-mono text-[11px]">
                  Implementation Details
                </h3>
                <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                  {project.solution}
                </p>
              </div>
            )}

            {project.challenge && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Engineering Challenge
                </h3>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {project.challenge}
                </p>
              </div>
            )}

            {project.highlights && project.highlights.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Key Technical Highlights
                </h3>
                <ul className="space-y-2.5">
                  {project.highlights.map((highlight: string, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed"
                    >
                      <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {project.technologies && project.technologies.length > 0 && (
          <section className="mt-12 space-y-4">
            <h2 className="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider font-mono text-xs">
              Technologies & Infrastructure
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech: string) => (
                <span
                  key={tech}
                  className="rounded-xl border border-black/8 dark:border-white/10 bg-black/2 dark:bg-white/4 px-4 py-2 font-mono text-xs text-neutral-800 dark:text-neutral-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Footer Navigation between Projects */}
        <footer className="mt-20 pt-8 border-t border-black/8 dark:border-white/8 flex items-center justify-between gap-4">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="group flex flex-col items-start max-w-[45%]"
            >
              <span className="flex items-center gap-1 text-[11px] font-mono text-neutral-500 uppercase group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                <ArrowLeft className="h-3 w-3" />
                Previous Project
              </span>
              <span className="text-sm font-bold text-neutral-900 dark:text-white mt-1 truncate">
                {prevProject.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {nextProject && (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group flex flex-col items-end max-w-[45%] text-right ml-auto"
            >
              <span className="flex items-center gap-1 text-[11px] font-mono text-neutral-500 uppercase group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Next Project
                <ArrowRight className="h-3 w-3" />
              </span>
              <span className="text-sm font-bold text-neutral-900 dark:text-white mt-1 truncate">
                {nextProject.title}
              </span>
            </Link>
          )}
        </footer>
      </article>
    </main>
  )
}
