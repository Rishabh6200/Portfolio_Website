import AdminSidebar from "@/components/layout/admin/sidebar"
import AdminTopbar from "@/components/layout/admin/topbar"
import { FolderGit2, Layers, Sparkles, Briefcase, GraduationCap, UserCircle } from "lucide-react"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="h-screen w-full overflow-hidden flex bg-background text-foreground">
      <AdminSidebar />
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <AdminTopbar />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </div>
      </div>
    </main>
  )
}
