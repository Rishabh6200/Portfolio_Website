import crypto from "node:crypto"

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

/**
 * Decodes a Base32 string into a Buffer.
 */
export function base32Decode(input: string): Buffer {
  const cleanInput = input.toUpperCase().replace(/[\s-]/g, "")
  let bits = ""
  for (let i = 0; i < cleanInput.length; i++) {
    const val = BASE32_ALPHABET.indexOf(cleanInput[i])
    if (val === -1) continue // Skip padding or invalid characters
    bits += val.toString(2).padStart(5, "0")
  }

  const bytes: number[] = []
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2))
  }

  return Buffer.from(bytes)
}

/**
 * Encodes a Buffer or Uint8Array into a Base32 string.
 */
export function base32Encode(buffer: Buffer | Uint8Array): string {
  let bits = ""
  for (let i = 0; i < buffer.length; i++) {
    bits += buffer[i].toString(2).padStart(8, "0")
  }

  let result = ""
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.substring(i, i + 5)
    if (chunk.length < 5) {
      const paddedChunk = chunk.padEnd(5, "0")
      result += BASE32_ALPHABET[parseInt(paddedChunk, 2)]
    } else {
      result += BASE32_ALPHABET[parseInt(chunk, 2)]
    }
  }

  return result
}

/**
 * Generates a random Base32 secret key for Authenticator apps (RFC 4648).
 * Default 20 bytes -> 32 Base32 characters.
 */
export function generateTOTPSecret(byteLength: number = 20): string {
  const randomBytes = crypto.randomBytes(byteLength)
  return base32Encode(randomBytes)
}

/**
 * Generates the current 6-digit TOTP code for a given timestamp and secret.
 */
export function generateTOTP(secret: string, timestampMs: number = Date.now()): string {
  const key = base32Decode(secret)
  const counter = Math.floor(timestampMs / 1000 / 30)

  const counterBuffer = Buffer.alloc(8)
  counterBuffer.writeBigInt64BE(BigInt(counter))

  const hmac = crypto.createHmac("sha1", key).update(counterBuffer).digest()
  const offset = hmac[hmac.length - 1] & 0x0f
  const binary =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff)

  const token = (binary % 1_000_000).toString().padStart(6, "0")
  return token
}

/**
 * Verifies a 6-digit TOTP token against a secret.
 * Allows a +/- window (default window = 1 allows 30 seconds before and after for clock drift).
 */
export function verifyTOTP(
  token: string,
  secret: string,
  window: number = 1
): boolean {
  if (!token || !secret) return false
  const cleanToken = token.trim().replace(/[\s-]/g, "")
  if (cleanToken.length !== 6 || !/^\d{6}$/.test(cleanToken)) return false

  const now = Date.now()
  const stepMs = 30 * 1000

  for (let i = -window; i <= window; i++) {
    const expected = generateTOTP(secret, now + i * stepMs)
    if (crypto.timingSafeEqual(Buffer.from(cleanToken), Buffer.from(expected))) {
      return true
    }
  }

  return false
}

/**
 * Builds the standard otpauth:// URL for scanning into Google Authenticator.
 */
export function getOTPAuthURL(
  secret: string,
  accountName: string = "Rishabh",
  issuer: string = "Portfolio"
): string {
  const encodedAccount = encodeURIComponent(accountName)
  const encodedIssuer = encodeURIComponent(issuer)
  return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`
}
