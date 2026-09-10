import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only run protection on /admin and /admin/* routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)
  const isAuthenticated = sessionCookie?.value
    ? await verifySessionToken(sessionCookie.value)
    : false

  // If user is visiting /admin/login
  if (pathname === "/admin/login") {
    // If already authenticated, redirect straight to dashboard
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
    return NextResponse.next()
  }

  // If user is trying to access protected /admin routes without authentication
  if (!isAuthenticated) {
    const loginUrl = new URL("/admin/login", request.url)
    if (pathname !== "/admin") {
      loginUrl.searchParams.set("callbackUrl", pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
  ],
}
