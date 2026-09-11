import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { ArrowLeft, ArrowRight, ExternalLink, Layers, Sparkles } from "lucide-react"
import { GithubIcon } from "@/components/custom-ui/icons"
import { Badge } from "@/components/ui/badge"
import { projectService } from "@/services"
import { ProjectImageGallery } from "./_components/project-image-gallery"

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
    title: `${project.title} — Case Study | Rishabh`,
    description: project.tagline || project.description,
    openGraph: {
      title: `${project.title} — Case Study`,
      description: project.tagline || project.description,
      images: project.images?.[0] ? [project.images[0]] : undefined,
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
          background: `radial-gradient(circle, #6366f1, transparent 70%)`,
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
              {project.role}
            </Badge>
            {project.featured && (
              <Badge variant="outline" className="text-xs font-mono text-amber-500 border-amber-500/30 bg-amber-500/10">
                <Sparkles className="h-3 w-3 mr-1" />
                Featured Project
              </Badge>
            )}
          </div>

          <div className="flex items-start gap-5">
            {project.logo && (
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border border-black/10 dark:border-white/10 bg-muted/40 p-2.5 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
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
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white">
                {project.title}
              </h1>
              <p className="text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal max-w-3xl">
                {project.tagline}
              </p>
            </div>
          </div>

          <div className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed border-l-2 border-indigo-500/40 pl-4 py-1 whitespace-pre-line">
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
            <div className="flex flex-wrap gap-2.5">
              {project.skills.map((skill: { _id?: string; name?: string; categoryId?: { name?: string } } | string) => {
                const name = typeof skill === "object" ? skill.name : String(skill)
                const id = typeof skill === "object" ? skill._id : String(skill)
                const catName = typeof skill === "object" ? skill.categoryId?.name : undefined

                return (
                  <Badge
                    key={id}
                    variant="secondary"
                    className="h-auto py-1.5 px-3 text-xs font-mono gap-2 rounded-xl border border-black/8 dark:border-white/10 font-normal"
                  >
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {name}
                    </span>
                    {catName && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-neutral-500 dark:text-neutral-400">
                        {catName}
                      </span>
                    )}
                  </Badge>
                )
              })}
            </div>
          </section>
        )}

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
