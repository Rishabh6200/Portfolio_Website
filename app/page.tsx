import { Navbar } from "@/components/navigation/navbar"
import { HeroSection } from "@/components/sections/hero"
import { BentoGridSection } from "@/components/sections/bento-grid"
import { ProjectsSection } from "@/components/sections/projects-section"
import { ExperienceSection } from "@/components/sections/experience-section"
import { ContactSection } from "@/components/sections/contact-section"
import { Footer } from "@/components/navigation/footer"

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground selection:bg-indigo-500/20 selection:text-indigo-400">
      <Navbar />
      <HeroSection />
      <BentoGridSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
