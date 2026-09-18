import type { Metadata, Viewport } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import "./globals.css"
import { cn } from "cn"
import { ThemeProvider } from "@/providers/theme-provider"
import { ProgressProvider } from "@/providers/progress-provider"
import { Toaster } from "@/components/ui/toast"

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