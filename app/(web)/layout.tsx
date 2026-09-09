import { Footer } from "@/components/navigation/footer"
import { Navbar } from "@/components/navigation/navbar"

export default function WebLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main>
      <Navbar />
      {children}
      <Footer />
    </main>
  )
}
