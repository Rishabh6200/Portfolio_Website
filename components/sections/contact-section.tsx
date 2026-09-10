"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import {
  Copy,
  Check,
  Calendar,
  ArrowUpRight,
  ArrowRight,
  Mail,
} from "lucide-react"
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/custom-ui/icons"
import { portfolioData } from "@/data/portfolio-data"
import { toast } from "sonner"

export function ContactSection() {
  const [copied, setCopied] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioData.personal.email)
    setCopied(true)
    toast.success("Email copied to clipboard!", {
      description: portfolioData.personal.email,
    })
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <section
      id="contact"
      className="relative py-28 sm:py-36 px-6 sm:px-8 xl:px-12 border-t border-black/6 dark:border-white/6 overflow-hidden"
    >
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-225 h-112.5 bg-linear-to-t from-indigo-500/10 via-cyan-500/5 to-transparent blur-3xl rounded-full ambient-glow" />

      <div className="relative mx-auto max-w-4xl xl:max-w-5xl 2xl:max-w-6xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span>Available for new projects & high-impact developer roles</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl xl:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.08]"
        >
          Let&apos;s build something <br className="hidden sm:inline" />
          <span className="bg-linear-to-r from-indigo-600 via-cyan-500 to-emerald-500 dark:from-indigo-400 dark:via-cyan-300 dark:to-emerald-400 bg-clip-text text-transparent">
            extraordinary
          </span>{" "}
          together.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base xl:text-lg mt-6 max-w-xl xl:max-w-2xl mx-auto leading-relaxed"
        >
          Have an ambitious project in mind, a developer role to discuss, or just want to chat about distributed systems and frontend craft? Reach out anytime.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 max-w-lg mx-auto"
        >
          <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 sm:p-2 rounded-2xl sm:rounded-full border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/3 backdrop-blur-xl shadow-xs dark:shadow-none">
            <div className="flex items-center gap-2 px-3.5 py-2 w-full sm:w-auto flex-1 text-xs sm:text-sm font-mono text-neutral-700 dark:text-neutral-300">
              <Mail className="h-4 w-4 text-neutral-400 shrink-0" />
              <span className="truncate">{portfolioData.personal.email}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={copyEmail}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border border-black/8 bg-black/2 hover:bg-black/5 text-neutral-800 dark:border-white/8 dark:bg-white/4 dark:hover:bg-white/8 dark:text-neutral-200 text-xs font-medium transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-neutral-500" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <a
                href={`mailto:${portfolioData.personal.email}`}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-semibold transition-all hover:shadow-md active:scale-95"
              >
                <span>Say Hello</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, delay: 0.4 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs text-neutral-600 dark:text-neutral-400"
        >
          <a
            href={portfolioData.personal.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-black/4 dark:hover:bg-white/5 transition-all duration-200"
          >
            <span className="flex items-center justify-center w-4 h-4 shrink-0 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-950 dark:group-hover:text-white transition-all duration-200 group-hover:scale-110">
              <GithubIcon className="w-3.5 h-3.5" />
            </span>
            <span className="leading-none font-medium pt-px group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
              GitHub
            </span>
            <ArrowUpRight className="w-3 h-3 text-neutral-400 dark:text-neutral-500 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-950 dark:group-hover:text-white" />
          </a>

          <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-800 shrink-0 select-none" />

          <a
            href={portfolioData.personal.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-black/4 dark:hover:bg-white/5 transition-all duration-200"
          >
            <span className="flex items-center justify-center w-4 h-4 shrink-0 text-neutral-500 dark:text-neutral-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-all duration-200 group-hover:scale-110">
              <LinkedinIcon className="w-3.5 h-3.5" />
            </span>
            <span className="leading-none font-medium pt-px group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
              LinkedIn
            </span>
            <ArrowUpRight className="w-3 h-3 text-neutral-400 dark:text-neutral-500 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-950 dark:group-hover:text-white" />
          </a>

          <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-800 shrink-0 select-none" />

          <a
            href={portfolioData.personal.socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-black/4 dark:hover:bg-white/5 transition-all duration-200"
          >
            <span className="flex items-center justify-center w-4 h-4 shrink-0 text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-950 dark:group-hover:text-white transition-all duration-200 group-hover:scale-110">
              <TwitterIcon className="w-3 h-3" />
            </span>
            <span className="leading-none font-medium pt-px group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
              X (Twitter)
            </span>
            <ArrowUpRight className="w-3 h-3 text-neutral-400 dark:text-neutral-500 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-950 dark:group-hover:text-white" />
          </a>

          {portfolioData.personal.socials.cal && (
            <>
              <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-800 shrink-0 select-none" />
              <a
                href={portfolioData.personal.socials.cal}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-black/4 dark:hover:bg-white/5 transition-all duration-200"
              >
                <span className="flex items-center justify-center w-4 h-4 shrink-0 text-neutral-500 dark:text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all duration-200 group-hover:scale-110">
                  <Calendar className="w-3.5 h-3.5" />
                </span>
                <span className="leading-none font-medium pt-px group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
                  Schedule Call
                </span>
                <ArrowUpRight className="w-3 h-3 text-neutral-400 dark:text-neutral-500 shrink-0 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-950 dark:group-hover:text-white" />
              </a>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}
