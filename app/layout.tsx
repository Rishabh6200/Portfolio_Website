import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ProgressProvider } from "@/components/progress-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"

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

import { profileService } from "@/services"

export async function generateMetadata(): Promise<Metadata> {
  const profile = await profileService.getProfile()
  const title = `${profile.name} — ${profile.role}`
  const description =
    profile.bio ||
    profile.tagline ||
    "Portfolio of high-throughput distributed systems and fluid web applications."

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
    title,
    description,
    keywords: [
      profile.role,
      "Full-Stack Developer",
      "Systems Architect",
      "Next.js",
      "React 19",
      "TypeScript",
      "Distributed Systems",
      "Tailwind CSS",
    ],
    authors: [{ name: profile.name }],
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
      className={cn("antialiased", fontMono.variable, inter.variable)}
    >
      <body className="min-h-screen bg-background font-sans text-foreground selection:bg-indigo-500/20 selection:text-indigo-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ProgressProvider>{children}</ProgressProvider>
          <Toaster />
          <Analytics
            beforeSend={(event) => {
              if (event.url.includes("/admin")) {
                return null
              }
              return event
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
