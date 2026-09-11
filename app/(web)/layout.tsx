import { Footer } from "@/components/navigation/footer"
import { Navbar } from "@/components/navigation/navbar"
import { HashScrollHandler } from "@/components/navigation/hash-scroll-handler"
import { profileService } from "@/services"

export default async function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const profile = await profileService.getProfile()

  return (
    <main>
      <HashScrollHandler />
      <Navbar initialProfile={profile} />
      {children}
      <Footer initialProfile={profile} />
    </main>
  )
}
