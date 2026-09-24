"use client"

import React, { use, useCallback, useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"
import { useTheme } from "next-themes"
import { DEFAULT_PROFILE } from "@/lib/constants/profile"
import { EASE_OUT, EASE_ENTER, type AppNavbarProps, MobileOverlay, NavbarBrand, NavbarLinks, ThemeToggle, MobileMenuButton, DesktopCTA, MobileMenu } from "./navbar"

export * from "./navbar"

const emptySubscribe = () => () => { }

export function AppNavbar({ initialProfile, profilePromise }: AppNavbarProps) {
   const resolvedPromiseProfile = profilePromise ? use(profilePromise) : undefined
   const profile = resolvedPromiseProfile ?? initialProfile ?? DEFAULT_PROFILE

   const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
   const [scrolled, setScrolled] = useState(false)
   const mounted = React.useSyncExternalStore(
      emptySubscribe,
      () => true,
      () => false
   )

   const { resolvedTheme, setTheme } = useTheme()
   const prefersReducedMotion = useReducedMotion() ?? false

   // Guarded scroll listener to avoid redundant React state updates
   useEffect(() => {
      const handleScroll = () => {
         const nextScrolled = window.scrollY > 20
         setScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled))
      }

      handleScroll()
      window.addEventListener("scroll", handleScroll, { passive: true })

      return () => {
         window.removeEventListener("scroll", handleScroll)
      }
   }, [])

   // Body scroll locking with safe overflow restoration, escape and resize handling
   useEffect(() => {
      if (!mobileMenuOpen) return

      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = "hidden"

      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.key === "Escape") {
            setMobileMenuOpen(false)
         }
      }

      const handleResize = () => {
         if (window.innerWidth >= 640) {
            setMobileMenuOpen(false)
         }
      }

      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("resize", handleResize)

      return () => {
         document.body.style.overflow = previousOverflow
         window.removeEventListener("keydown", handleKeyDown)
         window.removeEventListener("resize", handleResize)
      }
   }, [mobileMenuOpen])

   const closeMobileMenu = useCallback(() => {
      setMobileMenuOpen(false)
   }, [])

   const toggleMobileMenu = useCallback(() => {
      setMobileMenuOpen((open) => !open)
   }, [])

   const toggleTheme = useCallback(() => {
      setTheme(resolvedTheme === "dark" ? "light" : "dark")
   }, [resolvedTheme, setTheme])

   const handleNavClick = useCallback(
      (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
         if (!href.startsWith("/#") || window.location.pathname !== "/") {
            return
         }

         const id = href.slice(2)
         const element = document.getElementById(id)
         if (!element) return

         event.preventDefault()
         window.history.pushState(null, "", `#${id}`)
         element.scrollIntoView({
            behavior: "smooth",
            block: "start",
         })
         closeMobileMenu()
      },
      [closeMobileMenu]
   )

   return (
      <>
         <MobileOverlay open={mobileMenuOpen} onClose={closeMobileMenu} />

         <header className="fixed top-0 left-0 right-0 z-40 flex justify-center px-4 sm:px-8 md:px-10 py-3 sm:py-6 pointer-events-none">
            <motion.div
               initial={prefersReducedMotion ? { opacity: 0 } : { y: -16, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ duration: prefersReducedMotion ? 0.1 : 0.6, ease: EASE_ENTER }}
               className="pointer-events-auto w-full sm:w-auto max-w-xl sm:max-w-none"
            >
               <motion.nav
                  animate={{
                     borderRadius: mobileMenuOpen ? 26 : 24,
                  }}
                  transition={{
                     borderRadius: {
                        duration: mobileMenuOpen ? 0.28 : 0.2,
                        ease: EASE_OUT,
                     },
                  }}
                  className={`flex flex-col w-full border overflow-hidden transition-[background-color,border-color,box-shadow] duration-200 ${scrolled || mobileMenuOpen
                     ? "border-black/10 bg-white/75 shadow-[0_12px_36px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.8)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/15 dark:bg-[#07090e]/85 dark:shadow-[0_16px_48px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.12)]"
                     : "border-black/8 bg-white/30 shadow-[0_4px_24px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:bg-black/35 dark:shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.08)]"
                     }`}
               >
                  <div className="flex items-center justify-between w-full gap-3 sm:gap-6 px-4.5 sm:px-5 py-2.5 sm:py-2.5">
                     <NavbarBrand profile={profile} onCloseMobile={closeMobileMenu} />

                     <NavbarLinks onNavClick={handleNavClick} />

                     <div className="flex items-center gap-2 sm:gap-2 shrink-0">
                        <ThemeToggle
                           mounted={mounted}
                           resolvedTheme={resolvedTheme}
                           onToggle={toggleTheme}
                           reducedMotion={prefersReducedMotion}
                        />

                        <MobileMenuButton
                           open={mobileMenuOpen}
                           onToggle={toggleMobileMenu}
                           reducedMotion={prefersReducedMotion}
                        />

                        <DesktopCTA />
                     </div>
                  </div>

                  <MobileMenu
                     open={mobileMenuOpen}
                     profile={profile}
                     onNavClick={handleNavClick}
                     onClose={closeMobileMenu}
                     reducedMotion={prefersReducedMotion}
                  />
               </motion.nav>
            </motion.div>
         </header>
      </>
   )
}

// Named alias for drop-in compatibility
export { AppNavbar as Navbar }

export function NavbarSkeleton() {
   return (
      <header className="fixed top-0 left-0 right-0 z-40 flex justify-center px-4 sm:px-8 md:px-10 py-3 sm:py-6 pointer-events-none">
         <div className="pointer-events-auto w-full sm:w-auto max-w-xl sm:max-w-none">
            <div className="flex items-center justify-between w-full gap-3 sm:gap-6 px-4.5 sm:px-5 py-2.5 sm:py-2.5 rounded-[24px] border border-black/8 bg-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.03)] backdrop-blur-xl dark:border-white/10 dark:bg-black/40 dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
               <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 sm:h-6 sm:w-6 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse shrink-0" />
                  <div className="h-4 w-16 sm:w-20 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
               </div>
               <div className="hidden sm:flex items-center gap-4">
                  <div className="h-3 w-12 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                  <div className="h-3 w-14 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                  <div className="h-3 w-16 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                  <div className="h-3 w-12 rounded bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
               </div>
               <div className="flex items-center gap-2">
                  <div className="h-9 w-9 sm:h-8 sm:w-8 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                  <div className="hidden lg:block h-7 w-24 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
               </div>
            </div>
         </div>
      </header>
   )
}
