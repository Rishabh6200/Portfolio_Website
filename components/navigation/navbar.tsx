"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { Sun, Moon, ArrowUpRight, ChevronRight, User, FolderKanban, Briefcase, Mail, } from "lucide-react"
import { useTheme } from "next-themes"
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/custom-ui/icons"
import { DEFAULT_PROFILE, type ProfileData } from "@/lib/constants/profile"

const navItems = [
  { title: "About", href: "/#about", icon: User },
  { title: "Projects", href: "/#projects", icon: FolderKanban },
  { title: "Experience", href: "/#experience", icon: Briefcase },
  { title: "Contact", href: "/#contact", icon: Mail },
]

interface NavbarProps {
  initialProfile?: ProfileData
}

const emptySubscribe = () => () => { }

export function Navbar({ initialProfile }: NavbarProps) {
  const profile = initialProfile || DEFAULT_PROFILE


  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileMenuOpen(false)
      }

      const handleResize = () => {
        if (window.innerWidth >= 640) {
          setMobileMenuOpen(false)
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("resize", handleResize)

      return () => {
        document.body.style.overflow = ""
        window.removeEventListener("keydown", handleKeyDown)
        window.removeEventListener("resize", handleResize)
      }
    } else {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("/#") && window.location.pathname === "/") {
      const targetId = href.replace("/#", "")
      const el = document.getElementById(targetId)
      if (el) {
        e.preventDefault()
        window.history.pushState(null, "", href.replace("/", ""))
        el.scrollIntoView({ behavior: "smooth", block: "start" })
        setMobileMenuOpen(false)
      }
    }
  }

  return (
    <>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            onTouchMove={(e) => e.preventDefault()}
            className="fixed inset-0 z-30 bg-black/25 backdrop-blur-[2px] sm:hidden pointer-events-auto touch-none"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <header className="fixed top-0 left-0 right-0 z-40 flex justify-center px-4 sm:px-8 md:px-10 py-3 sm:py-6 pointer-events-none">
        <motion.div
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto w-full sm:w-auto max-w-xl sm:max-w-none"
        >
          <motion.nav
            animate={{
              borderRadius: mobileMenuOpen ? 26 : 24,
            }}
            transition={{
              borderRadius: {
                duration: mobileMenuOpen ? 0.28 : 0.2,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
            className={`flex flex-col w-full border overflow-hidden transition-[background-color,border-color,box-shadow] duration-200 ${scrolled || mobileMenuOpen
                ? "border-black/10 bg-white/75 shadow-[0_12px_36px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.8)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/15 dark:bg-[#07090e]/85 dark:shadow-[0_16px_48px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.12)]"
                : "border-black/8 bg-white/30 shadow-[0_4px_24px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:bg-black/35 dark:shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.08)]"
              }`}
          >
            <div className="flex items-center justify-between w-full gap-3 sm:gap-6 px-4.5 sm:px-5 py-2.5 sm:py-2.5">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="group flex items-center gap-2.5 text-sm font-semibold text-neutral-900 dark:text-white tracking-tight shrink-0"
              >
                <div className="relative flex h-7 w-7 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-linear-to-tr from-indigo-600 to-cyan-400 text-[11px] sm:text-[10px] font-bold text-white shadow-md shrink-0">
                  {profile.name.charAt(0)}
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  </span>
                </div>
                <span className="font-semibold text-xs sm:text-sm tracking-tight whitespace-nowrap">
                  {profile.name}
                </span>
              </Link>

              <div className="hidden sm:flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
                {navItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="rounded-full px-3 py-1.5 transition-colors hover:text-neutral-900 hover:bg-black/4 dark:hover:text-white dark:hover:bg-white/4"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-2 sm:gap-2 shrink-0">
                <motion.button
                  whileTap={{ scale: 0.88, rotate: 15 }}
                  whileHover={{ scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  onClick={toggleTheme}
                  className="relative flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-black/8 bg-black/2 text-neutral-600 transition-colors hover:border-black/15 hover:bg-black/4 hover:text-neutral-900 dark:border-white/8 dark:bg-white/3 dark:text-neutral-400 dark:hover:border-white/20 dark:hover:bg-white/8 dark:hover:text-white select-none focus:outline-hidden overflow-hidden"
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {mounted && resolvedTheme === "dark" ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, scale: 0, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: 90, scale: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center justify-center"
                      >
                        <Sun className="h-4 w-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, scale: 0, opacity: 0 }}
                        animate={{ rotate: 0, scale: 1, opacity: 1 }}
                        exit={{ rotate: -90, scale: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center justify-center"
                      >
                        <Moon className="h-4 w-4 text-indigo-600 drop-shadow-[0_0_8px_rgba(99,102,241,0.35)]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="sm:hidden flex h-9 w-9 items-center justify-center rounded-full border border-black/8 bg-black/2 text-neutral-700 transition-colors hover:border-black/15 hover:bg-black/4 hover:text-neutral-900 dark:border-white/8 dark:bg-white/3 dark:text-neutral-300 dark:hover:border-white/20 dark:hover:bg-white/8 dark:hover:text-white select-none focus:outline-hidden active:scale-95"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={mobileMenuOpen}
                >
                  <div className="relative h-3.5 w-3.5 flex flex-col justify-center items-center">
                    <motion.span
                      animate={mobileMenuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute h-[1.5px] w-3.5 rounded-full bg-current"
                    />
                    <motion.span
                      animate={mobileMenuOpen ? { opacity: 0, scale: 0.5 } : { opacity: 1, scale: 1 }}
                      transition={{ duration: 0.12 }}
                      className="absolute h-[1.5px] w-3.5 rounded-full bg-current"
                    />
                    <motion.span
                      animate={mobileMenuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute h-[1.5px] w-3.5 rounded-full bg-current"
                    />
                  </div>
                </button>

                <Link
                  href="/#contact"
                  className="hidden lg:flex items-center gap-1 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black px-3.5 py-1.5 text-xs font-medium transition-colors hover:opacity-90 active:scale-[0.98]"
                >
                  Let&apos;s Talk
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    transition: {
                      height: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.18, delay: 0.04 },
                    },
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    transition: {
                      height: { duration: 0.2, ease: [0.32, 0.72, 0, 1] },
                      opacity: { duration: 0.12 },
                    },
                  }}
                  className="sm:hidden overflow-hidden"
                >
                  <div className="px-4 pb-3.5 pt-1 flex flex-col gap-2.5">
                    <div className="h-px w-full bg-black/6 dark:bg-white/8" />

                    <div className="flex flex-col gap-1">
                      {navItems.map((item, idx) => {
                        const Icon = item.icon
                        return (
                          <motion.div
                            key={item.href}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.03 * (idx + 1) }}
                          >
                            <Link
                              href={item.href}
                              onClick={(e) => {
                                handleNavClick(e, item.href)
                                setMobileMenuOpen(false)
                              }}
                              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-neutral-700 hover:text-neutral-900 hover:bg-black/4 dark:text-neutral-300 dark:hover:text-white dark:hover:bg-white/6 transition-colors"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-black/4 dark:bg-white/6 text-neutral-600 dark:text-neutral-400">
                                  <Icon className="h-3 w-3" />
                                </div>
                                <span>{item.title}</span>
                              </div>
                              <ChevronRight className="h-3.5 w-3.5 text-neutral-400" />
                            </Link>
                          </motion.div>
                        )
                      })}
                    </div>

                    <div className="h-px w-full bg-black/6 dark:bg-white/8" />

                    <div className="flex items-center justify-between px-1 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </span>
                        <span className="text-[10px]">{profile.status}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {profile.socials.github && (
                          <a
                            href={profile.socials.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                            aria-label="GitHub"
                          >
                            <GithubIcon className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {profile.socials.linkedin && (
                          <a
                            href={profile.socials.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                            aria-label="LinkedIn"
                          >
                            <LinkedinIcon className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {profile.socials.twitter && (
                          <a
                            href={profile.socials.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                            aria-label="X (Twitter)"
                          >
                            <XIcon className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    <Link
                      href="/#contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black py-2.5 text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
                    >
                      <span>Let&apos;s Build Together</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        </motion.div>
      </header>
    </>
  )
}
