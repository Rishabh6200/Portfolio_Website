"use client"

import React, { useState, useEffect } from "react"
import { motion } from "motion/react"
import {
  Layers,
  Layout,
  Server,
  Cloud,
  MapPin,
  Clock,
  Terminal,
} from "lucide-react"
import { portfolioData } from "@/data/portfolio-data"

const categoryIcons = [Layout, Server, Cloud]
const categoryDescriptions = [
  "Fluid micro-interactions, React 19 architecture, design systems & accessible interfaces.",
  "High-throughput microservices, distributed queues, relational modeling & low latency.",
  "Containerized orchestration, automated delivery pipelines & semantic AI retrieval.",
]

export function BentoGridSection() {
  const [currentTime, setCurrentTime] = useState<string>("")

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date()
        setCurrentTime(
          now.toLocaleTimeString("en-US", {
            timeZone: portfolioData.personal.timezone,
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        )
      } catch {
        setCurrentTime("")
      }
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section
      id="about"
      className="relative py-24 sm:py-28 px-6 sm:px-8 xl:px-12 border-t border-black/6 dark:border-white/6"
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
            <Layers className="h-3.5 w-3.5" />
            <span>Architecture & Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Engineering foundation & how I build.
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base xl:text-lg mt-2.5 max-w-2xl leading-relaxed">
            A breakdown of my technical stack across the full application lifecycle, alongside the core principles that guide my architectural decisions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 lg:sticky lg:top-28 space-y-10"
          >
            <div className="space-y-4">
              <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Operational Ethos</span>
              </span>
              <p className="text-base sm:text-lg text-neutral-800 dark:text-neutral-200 leading-relaxed font-normal">
                I believe great software lives at the intersection of <span className="font-semibold text-neutral-900 dark:text-white">resilient, simple backend primitives</span> and <span className="font-semibold text-neutral-900 dark:text-white">tactile, zero-latency user experiences</span>.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              {portfolioData.principles.map((principle, idx) => (
                <div
                  key={idx}
                  className="group pt-4 border-t border-black/8 dark:border-white/8 transition-colors hover:border-indigo-500/40 dark:hover:border-indigo-500/40"
                >
                  <div className="flex items-baseline gap-3 mb-1.5">
                    <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                      0{idx + 1}
                    </span>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">
                      {principle.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed pl-7">
                    {principle.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-black/8 dark:border-white/8 flex flex-col gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-200">
                  <MapPin className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>{portfolioData.personal.location}</span>
                </div>

                {currentTime && (
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                    <Clock className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                    <span>{currentTime} Local</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                  {portfolioData.personal.status}
                </span>
                <span className="text-neutral-400 dark:text-neutral-600">•</span>
                <span className="text-neutral-500 dark:text-neutral-400">
                  Available for remote & hybrid roles
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7 space-y-10"
          >
            {portfolioData.skills.map((category, catIdx) => {
              const Icon = categoryIcons[catIdx] || Layout
              const desc = categoryDescriptions[catIdx] || ""

              return (
                <div
                  key={category.title}
                  className="pb-8 border-b border-black/8 dark:border-white/8 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                        {category.title}
                      </h3>
                    </div>
                    <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 pt-1">
                      {category.skills.length} competencies
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4 pl-9">
                    {desc}
                  </p>

                  <div className="flex flex-wrap gap-2 pl-9">
                    {category.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className={`group inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-all ${
                          skill.highlight
                            ? "border border-indigo-500/30 bg-indigo-50/50 text-indigo-900 dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:text-indigo-200 hover:border-indigo-500/50 hover:bg-indigo-500/15"
                            : "border border-black/8 bg-white/60 text-neutral-700 hover:border-neutral-400 dark:border-white/8 dark:bg-white/2 dark:text-neutral-300 dark:hover:border-white/20 dark:hover:bg-white/5"
                        }`}
                      >
                        {skill.highlight && (
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400" />
                        )}
                        <span className="font-medium">{skill.name}</span>
                        <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
