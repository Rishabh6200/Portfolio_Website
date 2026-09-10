"use client"

import { motion } from "motion/react"
import { Briefcase, MapPin, Calendar } from "lucide-react"

interface ExperienceSectionProps {
  initialExperiences?: any[]
}

export function ExperienceSection({ initialExperiences = [] }: ExperienceSectionProps) {
  const experiences = initialExperiences

  if (experiences.length === 0) {
    return null
  }

  return (
    <section
      id="experience"
      className="relative py-24 sm:py-28 px-6 sm:px-8 xl:px-12 border-t border-black/6 dark:border-white/6 scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="mx-auto max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-14 sm:mb-16"
        >
          <div className="font-mono text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Track Record</span>
          </div>
          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Work experience.
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base xl:text-lg mt-2 max-w-xl xl:max-w-2xl leading-relaxed">
            A chronological timeline of roles where I designed systems, built development teams, and scaled products.
          </p>
        </motion.div>

        <div className="border-t border-black/8 dark:border-white/8">
          {experiences.map((exp: any, idx: number) => {
            const isCurrent = (exp.period || "").toLowerCase().includes("present")
            const techList: string[] = Array.isArray(exp.skills) && exp.skills.length > 0
              ? exp.skills.map((s: any) => (typeof s === "object" && s?.name ? s.name : String(s)))
              : (exp.technologies || [])

            return (
              <motion.div
                key={exp._id || exp.company + exp.period}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="py-10 sm:py-12 border-b border-black/8 dark:border-white/8 transition-colors hover:bg-black/1 dark:hover:bg-white/1"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
                  <div className="lg:col-span-4 space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-neutral-400" />
                        <span>{exp.period}</span>
                      </span>

                      {isCurrent && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                          </span>
                          <span>Current</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                      {exp.company}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span>
                        {exp.locationType &&
                        exp.locationType !== "Remote" &&
                        !exp.location.toLowerCase().includes(exp.locationType.toLowerCase())
                          ? `${exp.location} (${exp.locationType})`
                          : exp.location || exp.locationType || "Remote"}
                      </span>
                      <span>•</span>
                      <span>{exp.type}</span>
                    </div>
                  </div>

                  <div className="lg:col-span-8 space-y-4">
                    <div>
                      <h4 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                        {exp.role}
                      </h4>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mt-1.5">
                        {exp.description}
                      </p>
                    </div>

                    <div className="space-y-2.5 pt-1">
                      {(exp.achievements || []).map((item: string, i: number) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300"
                        >
                          <span className="font-mono text-indigo-600 dark:text-indigo-400 select-none pt-0.5">
                            —
                          </span>
                          <span className="leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-3">
                      {techList.map((tech: string) => (
                        <span
                          key={tech}
                          className="font-mono text-[10px] px-2 py-0.5 rounded-md border border-black/6 bg-black/2 text-neutral-600 dark:border-white/6 dark:bg-white/2 dark:text-neutral-400"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
