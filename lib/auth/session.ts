import { ENV } from "@/config/env";
import { cookies } from "next/headers";

export const SESSION_COOKIE_NAME = ENV.SESSION_COOKIE_NAME;
export const SESSION_DURATION_SECONDS = Number(ENV.SESSION_DURATION_DAYS) * 24 * 60 * 60;

interface SessionPayload {
   admin: true
   iat: number
   exp: number
}

function getSecretKey(): string {
   const secret = ENV.AUTH_SECRET || ENV.ADMIN_TOTP_SECRET;
   if (!secret) {
      throw new Error("AUTH_SECRET or ADMIN_TOTP_SECRET environment variable is required")
   }
   return secret
}


function toBufferSource(str: string): BufferSource {
   return new TextEncoder().encode(str) as unknown as BufferSource
}

function toBase64Url(uint8Array: Uint8Array): string {
   let binary = ""
   for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i])
   }
   return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64Url(str: string): Uint8Array {
   let base64 = str.replace(/-/g, "+").replace(/_/g, "/")
   while (base64.length % 4) {
      base64 += "="
   }
   const binary = atob(base64)
   const bytes = new Uint8Array(binary.length)
   for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
   }
   return bytes
}

async function getCryptoKey(): Promise<CryptoKey> {
   const secretBytes = toBufferSource(getSecretKey())
   return crypto.subtle.importKey(
      "raw",
      secretBytes,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
   )
}

export async function createSessionToken(): Promise<string> {
   const now = Math.floor(Date.now() / 1000)
   const payload: SessionPayload = {
      admin: true,
      iat: now,
      exp: now + SESSION_DURATION_SECONDS,
   }

   const payloadString = JSON.stringify(payload)
   const encodedPayload = toBase64Url(new TextEncoder().encode(payloadString))

   const key = await getCryptoKey()
   const data = toBufferSource(encodedPayload)
   const signatureBuffer = await crypto.subtle.sign("HMAC", key, data)
   const encodedSignature = toBase64Url(new Uint8Array(signatureBuffer))

   return `${encodedPayload}.${encodedSignature}`
}

export async function setSessionCookie(token: string): Promise<void> {
   const cookieStore = await cookies()
   cookieStore.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DURATION_SECONDS,
   })
}

export async function verifySessionToken(token: string): Promise<boolean> {
   if (!token || typeof token !== "string") return false;

   const parts = token.split(".")
   if (parts.length !== 2) return false
   const [encodedPayload, encodedSignature] = parts

   try {
      const key = await getCryptoKey()
      const signatureBytes = fromBase64Url(encodedSignature) as unknown as BufferSource
      const data = toBufferSource(encodedPayload)

      const isValid = await crypto.subtle.verify("HMAC", key, signatureBytes, data);
      if (!isValid) return false;

      const payloadBytes = fromBase64Url(encodedPayload)
      const payloadJson = new TextDecoder().decode(payloadBytes)
      const payload = JSON.parse(payloadJson) as SessionPayload

      const now = Math.floor(Date.now() / 1000)
      if (!payload.admin || !payload.exp || now > payload.exp) {
         return false
      }

      return true
   } catch {
      return false
   }
}

export async function clearSessionCookie(): Promise<void> {
   const cookieStore = await cookies()
   cookieStore.delete({
      name: SESSION_COOKIE_NAME,
      path: "/",
   })
}

export async function isAdminAuthenticated(): Promise<boolean> {
   const cookieStore = await cookies()
   const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
   if (!sessionCookie?.value) return false

   return verifySessionToken(sessionCookie.value)
}
