import { Suspense } from "react"
import { LoginForm } from "./_components/login-form"

export const metadata = {
  title: "Admin Login — Portfolio",
  description: "Secure 6-digit Authenticator access for portfolio management",
}

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-background">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-160 h-160 bg-radial-gradient opacity-60 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full" />

      {/* Grid Pattern Backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 w-full flex justify-center">
        <Suspense fallback={<div className="h-96 w-full max-w-md animate-pulse bg-muted/20 rounded-2xl" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
