import type { Metadata, Viewport } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import { PortfolioAnalytics } from "@/components/analytics"
import "./globals.css"
import { ProgressProvider } from "@/components/progress-provider"
import { RecaptchaProvider } from "@/components/providers/recaptcha-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import { profileService } from "@/services"

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
  const recaptchaSiteKey =
    process.env.DISABLE_RECAPTCHA === "true" || process.env.RECAPTCHA_BYPASS === "true"
      ? ""
      : process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || process.env.RECAPTCHA_SITE_KEY

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={cn("antialiased", fontMono.variable, inter.variable)}
    >
      <body className="min-h-screen bg-background font-sans text-foreground selection:bg-indigo-500/20 selection:text-indigo-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <RecaptchaProvider siteKey={recaptchaSiteKey}>
            <ProgressProvider>{children}</ProgressProvider>
          </RecaptchaProvider>
          <Toaster />
          <PortfolioAnalytics />
        </ThemeProvider>
      </body>
    </html>
  )
}