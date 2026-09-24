"use client"

import React, { useState } from "react"
import { motion } from "motion/react"
import { ArrowRight, Copy, Check, Terminal, ExternalLink, ChevronDown } from "lucide-react"
import { toast } from "@/components/ui/toast"
import Link from "next/link"
import { MeshConstellation } from "@/components/custom-ui/mesh-constellation"
import { DEFAULT_PROFILE, type ProfileData } from "@/lib/constants/profile"
import { HeroStats } from "./hero-stats"


interface HeroSectionProps {
  initialProfile?: ProfileData
}

export function HeroSection({ initialProfile }: HeroSectionProps) {
  const [copied, setCopied] = useState(false)

  const profile = initialProfile || DEFAULT_PROFILE

  const copyEmail = () => {
    navigator.clipboard.writeText(profile.email)
    setCopied(true)
    toast.success("Email address copied!", {
      description: `${profile.email} is ready to paste.`,
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center pt-28 pb-16 px-6 sm:px-8 xl:px-12 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60" />
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-225 h-150 bg-linear-to-b from-indigo-500/15 via-cyan-500/10 to-transparent blur-3xl rounded-full ambient-glow" />
      <div className="pointer-events-none absolute top-1/3 right-10 w-125 h-125 bg-purple-500/10 blur-[130px] rounded-full" />

      <div className="absolute top-0 right-0 h-[48%] sm:h-[60%] lg:h-[85%] w-full lg:w-[68%] xl:w-[62%] 2xl:w-[58%] z-0 pointer-events-none lg:pointer-events-auto opacity-40 sm:opacity-65 lg:opacity-100">
        <MeshConstellation />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl xl:max-w-6xl 2xl:max-w-7xl w-full">
        <div className="max-w-3xl xl:max-w-4xl 2xl:max-w-4xl flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2.5 rounded-full border border-black/8 bg-white/70 shadow-sm dark:shadow-none dark:border-white/10 dark:bg-white/4 px-3.5 py-1.5 backdrop-blur-md mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              {profile.status}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
            className="font-mono text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>{profile.role}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14, ease: "easeOut" }}
            className="flex items-center gap-2.5 text-xl sm:text-2xl lg:text-3xl font-medium tracking-tight text-neutral-800 dark:text-neutral-200 mb-3"
          >
            <span>
              Hi, I&apos;m{" "}
              <motion.span
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="inline-block font-extrabold bg-linear-to-r from-indigo-500 via-cyan-400 to-emerald-500 dark:from-indigo-400 dark:via-cyan-300 dark:to-emerald-400 bg-clip-text text-transparent animate-name-shimmer select-none cursor-default"
              >
                {profile.name}
              </motion.span>
            </span>
            <motion.span
              className="inline-block text-2xl sm:text-3xl origin-[70%_70%] select-none cursor-pointer"
              animate={{
                rotate: [0, 18, -10, 18, -6, 12, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                repeatDelay: 1.2,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.25,
                rotate: [0, 22, -14, 22, -8, 14, 0],
                transition: { duration: 0.6, repeat: Infinity },
              }}
              whileTap={{ scale: 0.9 }}
              title="Wave back!"
            >
              👋
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl xl:text-7xl 2xl:text-[5rem] font-bold tracking-tight text-neutral-900 dark:text-white leading-[1.08]"
          >
            {profile.tagline ? (
              profile.tagline.includes("high-throughput") ? (
                <>
                  {profile.tagline.split("high-throughput")[0]}
                  <span className="bg-linear-to-r from-indigo-600 via-cyan-500 to-emerald-500 dark:from-indigo-400 dark:via-cyan-300 dark:to-emerald-400 bg-clip-text text-transparent">
                    high-throughput
                  </span>
                  {profile.tagline.split("high-throughput")[1]}
                </>
              ) : (
                profile.tagline
              )
            ) : (
              <>
                Architecting{" "}
                <span className="bg-linear-to-r from-indigo-600 via-cyan-500 to-emerald-500 dark:from-indigo-400 dark:via-cyan-300 dark:to-emerald-400 bg-clip-text text-transparent">
                  high-throughput
                </span>{" "}
                systems & fluid web products.
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-base sm:text-lg xl:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed"
          >
            {profile.bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <Link
              href="/#projects"
              className="group flex items-center gap-2 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 px-6 py-3 text-sm font-semibold transition-all hover:shadow-[0_0_25px_rgba(99,102,241,0.2)] active:scale-[0.98]"
            >
              <span>Explore Projects</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <button
              onClick={copyEmail}
              className="group flex items-center gap-2 rounded-full border border-black/12 bg-white text-neutral-900 hover:bg-neutral-50 shadow-sm dark:shadow-none dark:border-white/12 dark:bg-[#0d111a] dark:text-white dark:hover:bg-white/6 px-5 py-3 text-sm font-medium transition-all active:scale-[0.98]"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4 text-neutral-500 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-white transition-colors" />
              )}
              <span>{copied ? "Copied Email!" : "Copy Email"}</span>
            </button>

            {profile.socials.github && (
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-black/8 bg-black/2 text-neutral-700 hover:text-neutral-900 dark:border-white/8 dark:bg-white/2 dark:text-neutral-400 dark:hover:text-white px-4 py-3 text-sm font-medium transition-colors"
              >
                <span>GitHub</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </motion.div>
        </div>

        <HeroStats stats={profile.stats} />
      </div>

      <div className="mx-auto mt-8 sm:mt-12 flex justify-center text-neutral-400 dark:text-neutral-600 animate-bounce">
        <ChevronDown className="h-5 w-5" />
      </div>
    </section>
  )
}
