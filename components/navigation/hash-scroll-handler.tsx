"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function HashScrollHandler() {
  const pathname = usePathname()

  useEffect(() => {
    // Only process hash scrolling on the root page
    if (pathname !== "/") return

    const hash = window.location.hash
    if (!hash) return

    const id = hash.replace("#", "")
    if (!id) return

    // Prevent browser native scrollRestoration from resetting to top on refresh
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }

    const scrollToElement = (smooth = true) => {
      const el = document.getElementById(id)
      if (!el) return false

      el.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "start",
      })
      return true
    }

    // 1. Initial attempt: instant jump so the browser doesn't get lost while mounting
    scrollToElement(false)

    // 2. Re-align after initial hydration & dynamic components stream in
    const t1 = setTimeout(() => scrollToElement(true), 150)
    const t2 = setTimeout(() => scrollToElement(true), 600)

    // 3. If element is not in DOM yet (e.g. streaming Suspense), observe additions
    let scrollAttempts = 0
    const observer = new MutationObserver(() => {
      if (scrollAttempts < 3 && scrollToElement(true)) {
        scrollAttempts++
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    // Safety timeout: disconnect after 2.5 seconds
    const timer = setTimeout(() => {
      observer.disconnect()
    }, 2500)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [pathname])

  return null
}
