"use client"

import React from "react"
import Link from "next/link"
import type { ProfileData } from "@/lib/constants/profile"

export interface NavbarBrandProps {
   profile: ProfileData
   onCloseMobile: () => void
}

export function NavbarBrand({ profile, onCloseMobile }: NavbarBrandProps) {
   return (
      <Link
         href="/"
         onClick={onCloseMobile}
         className="group flex items-center gap-2.5 text-sm font-semibold text-neutral-900 dark:text-white tracking-tight shrink-0"
      >
         <div className="relative flex h-7 w-7 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-linear-to-tr from-indigo-600 to-cyan-400 text-[11px] sm:text-[10px] font-bold text-white shadow-md shrink-0">
            {profile.name.charAt(0)}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
               <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
               <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
         </div>
         <span className="font-semibold text-xs sm:text-sm tracking-tight whitespace-nowrap">
            {profile.name}
         </span>
      </Link>
   )
}
