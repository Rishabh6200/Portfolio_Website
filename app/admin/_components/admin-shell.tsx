"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FolderGit2,
  PlusCircle,
  ExternalLink,
  Menu,
  X,
  Terminal,
  Database,
  ChevronRight,
  Layers,
  Sparkles,
  Briefcase,
  LogOut,
} from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { logoutAdminAction } from "../login/actions"

interface AdminShellProps {
  children: React.ReactNode
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggingOut, startLogout] = useTransition()

  // If on login page, render clean standalone layout without admin shell
  if (pathname === "/admin/login") {
    return <main className="min-h-screen w-full bg-background text-foreground">{children}</main>
  }

  const handleLogout = () => {
    startLogout(async () => {
      await logoutAdminAction()
    })
  }

  const navItems = [
    {
      title: "All Projects",
      href: "/admin",
      icon: FolderGit2,
      exact: true,
    },
    {
      title: "Add Project",
      href: "/admin/projects/new",
      icon: PlusCircle,
      exact: false,
    },
    {
      title: "Categories",
      href: "/admin/categories",
      icon: Layers,
      exact: false,
    },
    {
      title: "Skills",
      href: "/admin/skills",
      icon: Sparkles,
      exact: false,
    },
    {
      title: "Experience",
      href: "/admin/experience",
      icon: Briefcase,
      exact: false,
    },
  ]

  // Breadcrumb generator
  const isNew = pathname === "/admin/projects/new"
  const isEdit = pathname.startsWith("/admin/projects/") && !isNew
  const isCategories = pathname.startsWith("/admin/categories")
  const isNewCategory = pathname === "/admin/categories/new"
  const isEditCategory = isCategories && !isNewCategory && pathname !== "/admin/categories"
  const isSkills = pathname.startsWith("/admin/skills")
  const isNewSkill = pathname === "/admin/skills/new"
  const isEditSkill = isSkills && !isNewSkill && pathname !== "/admin/skills"
  const isExperience = pathname.startsWith("/admin/experience")
  const isNewExperience = pathname === "/admin/experience/new"
  const isEditExperience = isExperience && !isNewExperience && pathname !== "/admin/experience"

  return (
    <div className="h-screen w-full overflow-hidden flex bg-background text-foreground">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
        />
      )}

      {/* Sidebar - 100% Fixed and Stationary */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-border bg-card flex flex-col transition-transform duration-200 md:static md:h-full md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-14 shrink-0 border-b border-border flex items-center justify-between px-4">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Terminal className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tracking-tight">Portfolio</span>
              <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 h-4">
                Admin
              </Badge>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1 rounded-md text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          <div className="space-y-1">
            <p className="px-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Overview
            </p>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              )
            })}
          </div>

          <div className="space-y-1">
            <p className="px-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Quick Links
            </p>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <ExternalLink className="h-4 w-4" />
                <span>Live Portfolio</span>
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">↗</span>
            </Link>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border shrink-0 space-y-2">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/40 text-xs">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-foreground truncate">MongoDB Atlas</p>
              <p className="text-[10px] text-muted-foreground font-mono truncate">Ready</p>
            </div>
            <Database className="h-3.5 w-3.5 text-muted-foreground" />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full justify-start gap-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Bar - 100% Fixed */}
        <header className="h-14 shrink-0 border-b border-border bg-background px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-4 w-4" />
            </button>

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Link href="/admin" className="hover:text-foreground transition-colors">
                Admin
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
              {isExperience ? (
                isNewExperience ? (
                  <>
                    <Link href="/admin/experience" className="hover:text-foreground transition-colors">
                      Experience
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span className="text-foreground font-semibold">New Experience</span>
                  </>
                ) : isEditExperience ? (
                  <>
                    <Link href="/admin/experience" className="hover:text-foreground transition-colors">
                      Experience
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span className="text-foreground font-semibold">Edit Experience</span>
                  </>
                ) : (
                  <span className="text-foreground font-semibold">Experience</span>
                )
              ) : isSkills ? (
                isNewSkill ? (
                  <>
                    <Link href="/admin/skills" className="hover:text-foreground transition-colors">
                      Skills
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span className="text-foreground font-semibold">New Skill</span>
                  </>
                ) : isEditSkill ? (
                  <>
                    <Link href="/admin/skills" className="hover:text-foreground transition-colors">
                      Skills
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span className="text-foreground font-semibold">Edit Skill</span>
                  </>
                ) : (
                  <span className="text-foreground font-semibold">Skills</span>
                )
              ) : isCategories ? (
                isNewCategory ? (
                  <>
                    <Link href="/admin/categories" className="hover:text-foreground transition-colors">
                      Categories
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span className="text-foreground font-semibold">New Category</span>
                  </>
                ) : isEditCategory ? (
                  <>
                    <Link href="/admin/categories" className="hover:text-foreground transition-colors">
                      Categories
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span className="text-foreground font-semibold">Edit Category</span>
                  </>
                ) : (
                  <span className="text-foreground font-semibold">Categories</span>
                )
              ) : isNew ? (
                <>
                  <Link href="/admin" className="hover:text-foreground transition-colors">
                    Projects
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                  <span className="text-foreground font-semibold">New Project</span>
                </>
              ) : isEdit ? (
                <>
                  <Link href="/admin" className="hover:text-foreground transition-colors">
                    Projects
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                  <span className="text-foreground font-semibold">Edit Project</span>
                </>
              ) : (
                <span className="text-foreground font-semibold">Projects</span>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {!isNew && (
              <Link
                href="/admin/projects/new"
                className={buttonVariants({ size: "sm" })}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>New Project</span>
              </Link>
            )}

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">View Site</span>
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="gap-1.5 text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{isLoggingOut ? "..." : "Logout"}</span>
            </Button>
          </div>
        </header>

        {/* Scrollable Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-6xl space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
