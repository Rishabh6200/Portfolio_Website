import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session"

export async function proxy(request: NextRequest) {
   const { pathname } = request.nextUrl

   if (!pathname.startsWith("/console")) {
      return NextResponse.next()
   }

   const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)
   const isAuthenticated = sessionCookie?.value ? await verifySessionToken(sessionCookie.value) : false
   
   if (pathname === "/console/access") {
      if (isAuthenticated) {
         return NextResponse.redirect(new URL("/console", request.url))
      }
      return NextResponse.next()
   }

   if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url))
   }
   return NextResponse.next()
}

export const config = {
   matcher: [
      "/console",
      "/console/:path*",
   ],
}
