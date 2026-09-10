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

    // Prevent browser native scrollRestoration from resetting to 0 on refresh
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }

    const scrollToTarget = (el: HTMLElement) => {
      // Use requestAnimationFrame to ensure layout has stabilized
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" })
      })
    }

    const checkAndScroll = () => {
      const el = document.getElementById(id)
      if (el) {
        scrollToTarget(el)
        return true
      }
      return false
    }

    // Attempt immediately in case the element already exists in DOM
    if (checkAndScroll()) return

    // If element is not in DOM yet (e.g. streaming Suspense), observe additions
    const observer = new MutationObserver(() => {
      if (checkAndScroll()) {
        observer.disconnect()
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })

    // Safety timeout: disconnect after 3.5 seconds
    const timer = setTimeout(() => {
      observer.disconnect()
    }, 3500)

    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [pathname])

  return null
}
