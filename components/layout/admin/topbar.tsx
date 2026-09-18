"use client";
import { Button, buttonVariants } from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import { ExternalLink, LogOut, Menu } from 'lucide-react'
import Link from 'next/link'
import { useTransition } from 'react'
import AdminBreadcrumb from './breadcrumb'
import { navItems } from './nav-config'

const AdminTopbar = () => {
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
        <header className="h-14 shrink-0 border-b border-border bg-background px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    // onClick={() => setSidebarOpen(true)}
                    className="md:hidden p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"
                >
                    <Menu className="h-4 w-4" />
                </button>

                {/* Dynamic Breadcrumbs */}
                <AdminBreadcrumb />
            </div>

            <div className="flex items-center gap-2">
                {/* {!isNew && (
                    <Link
                        href="/admin/projects/new"
                        className={buttonVariants({ size: "sm" })}
                    >
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>New Project</span>
                    </Link>
                )} */}

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
    )
}

export default AdminTopbar