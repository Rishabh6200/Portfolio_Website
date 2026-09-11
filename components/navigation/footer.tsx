"use client"

import React, { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/custom-ui/icons"
import { DEFAULT_PROFILE, type ProfileData } from "@/lib/constants/profile"

interface FooterProps {
  initialProfile?: ProfileData
}

export function Footer({ initialProfile }: FooterProps) {
  const [time, setTime] = useState<string>("")

  const profile = initialProfile || DEFAULT_PROFILE


  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("en-US", {
          timeZone: profile.timezone || "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [profile.timezone])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative border-t border-black/8 bg-slate-100/60 dark:border-white/8 dark:bg-[#07090e] py-12 px-6 sm:px-8 xl:px-12">
      <div className="mx-auto max-w-5xl xl:max-w-6xl 2xl:max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-neutral-600 dark:text-neutral-400">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <span className="hidden sm:inline text-neutral-400 dark:text-neutral-600">•</span>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            <span>Local Time: {time || "Loading..."}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {profile.socials.github && (
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-950 hover:bg-black/5 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/5 transition-all duration-200 hover:scale-110"
              aria-label="GitHub"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
          )}
          {profile.socials.linkedin && (
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full text-neutral-500 hover:text-sky-600 hover:bg-sky-50 dark:text-neutral-400 dark:hover:text-sky-400 dark:hover:bg-sky-500/10 transition-all duration-200 hover:scale-110"
              aria-label="LinkedIn"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
          )}
          {profile.socials.twitter && (
            <a
              href={profile.socials.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-950 hover:bg-black/5 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/5 transition-all duration-200 hover:scale-110"
              aria-label="X (formerly Twitter)"
            >
              <TwitterIcon className="h-4 w-4" />
            </a>
          )}

          <div className="h-4 w-px bg-black/10 dark:bg-white/10" />

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 rounded-full border border-black/8 bg-black/2 text-neutral-600 hover:text-neutral-900 hover:border-black/15 dark:border-white/8 dark:bg-white/3 px-3 py-1 text-xs dark:text-neutral-400 transition-colors dark:hover:border-white/20 dark:hover:bg-white/8 dark:hover:text-white"
            aria-label="Scroll to top"
          >
            <span>Top</span>
            <ArrowUp className="h-3 w-3" />
          </button>
        </div>
      </div>
    </footer>
  )
}
