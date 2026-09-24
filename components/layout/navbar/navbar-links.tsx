"use client"

import React from "react"
import Link from "next/link"
import { NAV_ITEMS } from "./constants"

export interface NavbarLinksProps {
   onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void
}

export function NavbarLinks({ onNavClick }: NavbarLinksProps) {
   return (
      <div className="hidden sm:flex items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400">
         {NAV_ITEMS.map((item) => (
            <Link
               key={item.title}
               href={item.href}
               onClick={(e) => onNavClick(e, item.href)}
               className="rounded-full px-3 py-1.5 transition-colors hover:text-neutral-900 hover:bg-black/4 dark:hover:text-white dark:hover:bg-white/4"
            >
               {item.title}
            </Link>
         ))}
      </div>
   )
}
