import { Suspense } from "react"
import { profileQueries } from "@/features/profile/db/queries"
import { Navbar, NavbarSkeleton } from "@/components/layout/app-navbar"
import { Footer } from "@/components/layout/footer"
import { HashScrollHandler } from "@/components/layout/hash-scroll-handler"

export default function WebLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   // Initiate the query without blocking layout streaming
   const profilePromise = profileQueries.getProfile()

   return (
      <main className="min-h-screen flex flex-col">
         <HashScrollHandler />
         <Suspense fallback={<NavbarSkeleton />}>
            <Navbar profilePromise={profilePromise} />
         </Suspense>

         <div className="flex-1">{children}</div>

         <Suspense fallback={null}>
            <Footer profilePromise={profilePromise} />
         </Suspense>
      </main>
   )
}
