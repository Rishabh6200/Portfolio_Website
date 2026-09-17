"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { verifyTOTP } from "@/lib/auth/totp"
import { createSessionToken, setSessionCookie, clearSessionCookie } from "@/lib/auth/session"

// In-memory rate limiting map for login attempts
interface RateLimitEntry {
  attempts: number
  blockedUntil: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

async function getClientIp(): Promise<string> {
  const headerList = await headers()
  const forwardedFor = headerList.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }
  return headerList.get("x-real-ip") || "unknown-ip"
}

function checkRateLimit(ip: string): { allowed: boolean; remainingMinutes?: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry) {
    return { allowed: true }
  }

  if (entry.blockedUntil > now) {
    const remainingMs = entry.blockedUntil - now
    const remainingMinutes = Math.ceil(remainingMs / 60000)
    return { allowed: false, remainingMinutes }
  }

  // Reset if block expired
  if (entry.blockedUntil <= now && entry.attempts >= 5) {
    rateLimitMap.delete(ip)
    return { allowed: true }
  }

  return { allowed: true }
}

function recordFailedAttempt(ip: string): number {
  const now = Date.now()
  const entry = rateLimitMap.get(ip) || { attempts: 0, blockedUntil: 0 }
  entry.attempts += 1

  if (entry.attempts >= 5) {
    entry.blockedUntil = now + 5 * 60 * 1000 // 5 minutes lockout
  }

  rateLimitMap.set(ip, entry)
  return entry.attempts
}

function resetRateLimit(ip: string): void {
  rateLimitMap.delete(ip)
}

function getTotpSecret(): string {
  const secret = process.env.ADMIN_TOTP_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_TOTP_SECRET environment variable is missing on production")
    }
    // Safe fallback key for development if user hasn't added .env yet
    // Base32 representation of a default development key
    return "JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP"
  }
  return secret
}

export async function getLoginStatusAction() {
  const ip = await getClientIp()
  const rateLimit = checkRateLimit(ip)

  return {
    isLockedOut: !rateLimit.allowed,
    remainingMinutes: rateLimit.remainingMinutes || 0,
  }
}

export async function verifyAdminTotpAction(code: string) {
  const ip = await getClientIp()
  const rateLimit = checkRateLimit(ip)

  if (!rateLimit.allowed) {
    return {
      success: false,
      isLockedOut: true,
      remainingMinutes: rateLimit.remainingMinutes,
      error: `Too many failed attempts. Please wait ${rateLimit.remainingMinutes} minute(s) before trying again.`,
    }
  }

  const secret = getTotpSecret()
  const isValid = verifyTOTP(code, secret, 1)

  if (!isValid) {
    const attempts = recordFailedAttempt(ip)
    const remaining = 5 - attempts
    if (remaining <= 0) {
      return {
        success: false,
        isLockedOut: true,
        remainingMinutes: 5,
        error: "Too many failed attempts. You have been locked out for 5 minutes.",
      }
    }
    return {
      success: false,
      isLockedOut: false,
      remainingAttempts: remaining,
      error: `Invalid verification code. ${remaining} attempt(s) remaining.`,
    }
  }

  // Successful verification
  resetRateLimit(ip)
  const token = await createSessionToken()
  await setSessionCookie(token)

  return { success: true, isLockedOut: false }
}

export async function logoutAdminAction() {
  await clearSessionCookie()
  redirect("/admin/login")
}
