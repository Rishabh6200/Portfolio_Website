"use client";
import Link from "next/link"
import { FC, useState, useTransition } from "react"
import { Badge } from "../../ui/badge"
import { ExternalLink, X, Terminal, Database, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import { Button } from "../../ui/button"
import { toast } from "../../ui/toast"
import { navItems } from "./nav-config";

const AdminSidebar = () => {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isLoggingOut, startLogout] = useTransition()

    const handleLogout = () => {
        startLogout(() => {
            // await logoutAdminAction()
            toast.add({
                type: "success",
                description: "logged out successfully",
            })
        })
    }
    return (
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-border bg-card flex flex-col transition-transform duration-200 md:static md:h-full md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`} >
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
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${isActive
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
    )
}

export default AdminSidebar