import { LayoutDashboard, FolderGit2, Layers, Sparkles, Briefcase, GraduationCap, UserCircle, LucideIcon } from "lucide-react";

export interface NavItem {
   title: string;
   href: string;
   icon: LucideIcon;
   exact?: boolean;
}

export const PREFIX = "/console"

export const navItems: NavItem[] = [
   {
      title: "Overview",
      href: PREFIX,
      icon: LayoutDashboard,
      exact: true,
   },
   {
      title: "All Projects",
      href: PREFIX + "/projects",
      icon: FolderGit2,
      exact: false,
   },
   {
      title: "Categories",
      href: PREFIX + "/categories",
      icon: Layers,
      exact: false,
   },
   {
      title: "Skills",
      href: PREFIX + "/skills",
      icon: Sparkles,
      exact: false,
   },
   {
      title: "Experience",
      href: PREFIX + "/experience",
      icon: Briefcase,
      exact: false,
   },
   {
      title: "Education",
      href: PREFIX + "/education",
      icon: GraduationCap,
      exact: false,
   },
   {
      title: "Profile & Socials",
      href: PREFIX + "/profile",
      icon: UserCircle,
      exact: false,
   },
];
