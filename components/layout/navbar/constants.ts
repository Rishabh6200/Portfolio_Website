import type { LucideIcon } from "lucide-react"
import { User, FolderKanban, Briefcase, Mail } from "lucide-react"
import type { ProfileData } from "@/lib/constants/profile"

// Animation easing tokens
export const EASE_OUT = [0.16, 1, 0.3, 1] as const
export const EASE_ENTER = [0.22, 1, 0.36, 1] as const

export interface NavItem {
   readonly title: string
   readonly href: string
   readonly icon: LucideIcon
}

export const NAV_ITEMS: readonly NavItem[] = [
   { title: "About", href: "/#about", icon: User },
   { title: "Projects", href: "/#projects", icon: FolderKanban },
   { title: "Experience", href: "/#experience", icon: Briefcase },
   { title: "Contact", href: "/#contact", icon: Mail },
] as const

export interface AppNavbarProps {
   initialProfile?: ProfileData
   profilePromise?: Promise<ProfileData>
}

export type NavbarProps = AppNavbarProps
