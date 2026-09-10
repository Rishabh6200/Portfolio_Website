import { Footer } from "@/components/navigation/footer"
import { Navbar } from "@/components/navigation/navbar"
import { HashScrollHandler } from "@/components/navigation/hash-scroll-handler"

export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main>
      <HashScrollHandler />
      <Navbar />
      {children}
      <Footer />
    </main>
  )
}
