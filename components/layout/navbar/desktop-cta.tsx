import React from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

export function DesktopCTA() {
   return (
      <Link
         href="/#contact"
         className="hidden lg:flex items-center gap-1 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black px-3.5 py-1.5 text-xs font-medium transition-opacity duration-150 hover:opacity-90 active:scale-[0.98]"
      >
         Let&apos;s Talk
         <ArrowUpRight className="h-3 w-3" />
      </Link>
   )
}
