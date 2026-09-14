"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Briefcase, GraduationCap, Award, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { PillTabs, type PillTabItem } from "@/components/custom-ui/pill-tabs"
import { SectionHeader } from "@/components/custom-ui/section-header"
import { TimelineItem } from "@/components/sections/timeline-item"

interface ExperienceSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialExperiences?: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        <SectionHeader
          eyebrow="Career & Credentials"
          icon={Briefcase}
          title="Experience & Education."
          description="A chronological timeline of roles where I designed systems, built development teams, and earned academic credentials."
          action={
            hasBoth && (
              <PillTabs<"experience" | "education">
                items={tabItems}
                value={activeTab}
                onValueChange={setActiveTab}
                layoutId="activeExperienceTabPill"
                className="shrink-0 self-start md:self-end"
              />
            )
          }
        />

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

                  const periodBadge = isCurrent ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                      </span>
                      <span>Current</span>
                    </span>
                  ) : null

                  const locationString =
                    exp.locationType &&
                    exp.locationType !== "Remote" &&
                    !exp.location?.toLowerCase().includes(exp.locationType.toLowerCase())
                      ? `${exp.location} (${exp.locationType})`
                      : exp.location || exp.locationType || "Remote"

                  return (
                    <TimelineItem
                      key={exp._id || exp.company + exp.period}
                      index={idx}
                      period={exp.period}
                      periodBadge={periodBadge}
                      title={exp.company}
                      location={locationString}
                      subtitleDetails={[exp.type]}
                      heading={exp.role}
                      description={exp.description}
                      points={exp.achievements || []}
                      technologies={techList}
                    />
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

                  const periodBadge = (
                    <div className="flex items-center gap-1.5">
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
                  )

                  return (
                    <TimelineItem
                      key={edu._id || edu.institution + edu.degree}
                      index={idx}
                      period={edu.period}
                      periodBadge={periodBadge}
                      title={edu.institution}
                      location={edu.location || "Global"}
                      subtitleDetails={[edu.fieldOfStudy]}
                      heading={edu.degree}
                      description={edu.description}
                      points={edu.highlights || []}
                      technologies={techList}
                    />
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
