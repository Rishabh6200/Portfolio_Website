import crypto from "node:crypto"

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

function generateSecret(byteLength = 20) {
  const buffer = crypto.randomBytes(byteLength)
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

function generateAuthSecret() {
  return crypto.randomBytes(32).toString("hex")
}

async function main() {
  const totpSecret = generateSecret(20)
  const authSecret = generateAuthSecret()
  const issuer = "Portfolio-v3"
  const accountName = "Admin"

  const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${totpSecret}&issuer=${encodeURIComponent(issuer)}`

  console.log("\n=======================================================")
  console.log("🔐 V3 PRIVATE ADMIN CREDENTIAL GENERATOR")
  console.log("=======================================================\n")

  console.log("1. Add these to your .env file:")
  console.log("-------------------------------------------------------")
  console.log(`ADMIN_TOTP_SECRET=${totpSecret}`)
  console.log(`AUTH_SECRET=${authSecret}`)
  console.log("-------------------------------------------------------\n")

  console.log("2. Google Authenticator / 1Password Setup Details:")
  console.log("-------------------------------------------------------")
  console.log(`• Account Name: ${issuer}: ${accountName}`)
  console.log(`• Secret Key:   ${totpSecret}`)
  console.log(`• Key Type:     Time-based (TOTP, 30s)`)
  console.log(`• OTP Auth URL: ${otpauthUrl}`)
  console.log("-------------------------------------------------------\n")
}

main().catch(console.error)
