import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  title: "Rishabh — Full-Stack & Systems Developer",
  description: "Portfolio of Rishabh. Specializing in high-throughput distributed architectures, resilient cloud backends, and pixel-precise interactive web experiences.",
  keywords: [
    "Full-Stack Developer",
    "Systems Architect",
    "Next.js",
    "React 19",
    "TypeScript",
    "Distributed Systems",
    "Tailwind CSS",
  ],
  authors: [{ name: "Rishabh" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Rishabh — Full-Stack & Systems Developer",
    description: "Architecting high-throughput distributed systems & polished interactive web experiences.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rishabh — Full-Stack & Systems Developer",
    description: "Architecting high-throughput distributed systems & polished interactive web experiences.",
  },
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
        </ThemeProvider>
      </body>
    </html>
  )
}
