import type { Metadata, Viewport } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { cn } from "cn"
import { ThemeProvider } from "@/providers/theme-provider"
import { ProgressProvider } from "@/providers/progress-provider"
import { Toaster } from "@/components/ui/toast"

import { profileQueries } from "@/features/profile/db/queries"

const inter = Inter({
   subsets: ["latin"],
   variable: "--font-sans",
   display: "swap",
})

const fontMono = Geist_Mono({
   subsets: ["latin"],
   variable: "--font-mono",
   display: "swap",
})

export const dynamic = "force-dynamic"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export async function generateMetadata(): Promise<Metadata> {
   const profile = await profileQueries.getProfile()
   const title = profile.name && profile.role ? `${profile.name} — ${profile.role}` : "Portfolio"
   const description =
      profile.bio ||
      profile.tagline ||
      "Portfolio and Content Management System"

   return {
      metadataBase: new URL(appUrl),
      title: {
         default: title,
         template: `%s | ${profile.name || "Portfolio"}`,
      },
      description,
      authors: profile.name ? [{ name: profile.name }] : undefined,
      alternates: {
         canonical: "/",
      },
      openGraph: {
         title,
         description,
         type: "website",
         locale: "en_US",
      },
      twitter: {
         card: "summary_large_image",
         title,
         description,
      },
   }
}

export const viewport: Viewport = {
   themeColor: [
      { media: "(prefers-color-scheme: dark)", color: "#07090e" },
      { media: "(prefers-color-scheme: light)", color: "#6366f1" },
   ],
}

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <html
         lang="en"
         suppressHydrationWarning
         data-scroll-behavior="smooth"
         className={cn("antialiased bg-background text-foreground", fontMono.variable, inter.variable)}
      >
         <body className="min-h-screen bg-background font-sans text-foreground selection:bg-indigo-500/20 selection:text-indigo-300">
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
               <ProgressProvider>
                  {children}
                  <Toaster />
               </ProgressProvider>
            </ThemeProvider>
         </body>
      </html>
   )
}