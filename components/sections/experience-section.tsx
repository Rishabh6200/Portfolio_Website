"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Briefcase, MapPin, Calendar, GraduationCap, Award, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { PillTabs, type PillTabItem } from "@/components/custom-ui/pill-tabs"

interface ExperienceSectionProps {
  initialExperiences?: any[]
  initialEducations?: any[]
}

export function ExperienceSection({
  initialExperiences = [],
  initialEducations = [],
}: ExperienceSectionProps) {
  const [activeTab, setActiveTab] = useState<"experience" | "education">("experience")

  const experiences = initialExperiences || []
  const educations = initialEducations || []

  // If both are empty, don't render section
  if (experiences.length === 0 && educations.length === 0) {
    return null
  }

  // If only one exists, default to that one
  const hasBoth = experiences.length > 0 && educations.length > 0
  const currentTab = hasBoth
    ? activeTab
    : experiences.length > 0
      ? "experience"
      : "education"

  const tabItems: PillTabItem<"experience" | "education">[] = [
    {
      id: "experience",
      label: "Experience",
      icon: Briefcase,
      count: experiences.length,
    },
    {
      id: "education",
      label: "Education",
      icon: GraduationCap,
      count: educations.length,
    },
  ]

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
          className="mb-12 sm:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2 flex items-center gap-2">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Career & Credentials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Experience & Education.
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base xl:text-lg mt-2 max-w-xl xl:max-w-2xl leading-relaxed">
              A chronological timeline of roles where I designed systems, built development teams, and earned academic credentials.
            </p>
          </div>

          {/* Standalone Reusable PillTabs Component */}
          {hasBoth && (
            <PillTabs<"experience" | "education">
              items={tabItems}
              value={activeTab}
              onValueChange={setActiveTab}
              layoutId="activeExperienceTabPill"
              className="shrink-0 self-start md:self-end"
            />
          )}
        </motion.div>

        {/* Content Area with smooth transitions and layout stability */}
        <div className="relative border-t border-black/8 dark:border-white/8 min-h-100">
          <AnimatePresence mode="popLayout" initial={false}>
            {currentTab === "experience" ? (
              <motion.div
                key="experience-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {experiences.map((exp: any, idx: number) => {
                  const isCurrent = (exp.period || "").toLowerCase().includes("present")
                  const techList: string[] =
                    Array.isArray(exp.skills) && exp.skills.length > 0
                      ? exp.skills.map((s: any) =>
                        typeof s === "object" && s?.name ? s.name : String(s)
                      )
                      : exp.technologies || []

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

                          {techList.length > 0 && (
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
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            ) : (
              <motion.div
                key="education-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {educations.map((edu: any, idx: number) => {
                  const techList: string[] =
                    Array.isArray(edu.skills) && edu.skills.length > 0
                      ? edu.skills.map((s: any) =>
                        typeof s === "object" && s?.name ? s.name : String(s)
                      )
                      : []

                  const isCertification = edu.type === "Certification"

                  return (
                    <motion.div
                      key={edu._id || edu.institution + edu.degree}
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
                              <span>{edu.period}</span>
                            </span>

                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border",
                                isCertification
                                  ? "border-cyan-500/20 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"
                                  : "border-indigo-500/20 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
                              )}
                            >
                              {isCertification ? (
                                <CheckCircle2 className="h-2.5 w-2.5" />
                              ) : (
                                <Award className="h-2.5 w-2.5" />
                              )}
                              <span>{edu.type || "Degree"}</span>
                            </span>

                            {edu.grade && (
                              <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                                • {edu.grade}
                              </span>
                            )}
                          </div>

                          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                            {edu.institution}
                          </h3>

                          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span>{edu.location || "Global"}</span>
                            {edu.fieldOfStudy && (
                              <>
                                <span>•</span>
                                <span>{edu.fieldOfStudy}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="lg:col-span-8 space-y-4">
                          <div>
                            <h4 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                              {edu.degree}
                            </h4>
                            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mt-1.5">
                              {edu.description}
                            </p>
                          </div>

                          {Array.isArray(edu.highlights) && edu.highlights.length > 0 && (
                            <div className="space-y-2.5 pt-1">
                              {edu.highlights.map((item: string, i: number) => (
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
                          )}

                          {techList.length > 0 && (
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
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

