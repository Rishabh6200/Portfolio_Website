import crypto from "node:crypto"
import QRCode from "qrcode"

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
  const issuer = "My"
  const accountName = "Portfolio"

  // Produces "My: Portfolio" in Authenticator apps
  const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${totpSecret}&issuer=${encodeURIComponent(issuer)}`

  // Generate ultra-compact ASCII QR code for terminal
  const terminalQR = await QRCode.toString(otpauthUrl, {
    type: "terminal",
    small: true,
    margin: 1,
    errorCorrectionLevel: "L",
  })

  console.log("\n=======================================================")
  console.log("🔐 PRIVATE ADMIN CREDENTIAL & QR CODE GENERATOR")
  console.log("=======================================================\n")

  console.log("📱 SCAN THIS QR CODE WITH GOOGLE AUTHENTICATOR / AUTHY:")
  console.log("-------------------------------------------------------")
  console.log(terminalQR)
  console.log("-------------------------------------------------------\n")

  console.log("1. Copy & Paste these into your .env.local file:")
  console.log("-------------------------------------------------------")
  console.log(`ADMIN_TOTP_SECRET=${totpSecret}`)
  console.log(`AUTH_SECRET=${authSecret}`)
  console.log("-------------------------------------------------------\n")

  console.log("2. Or Enter Setup Key Manually (if not scanning):")
  console.log("-------------------------------------------------------")
  console.log(`• Account Name: ${issuer}: ${accountName}`)
  console.log(`• Secret Key:   ${totpSecret}`)
  console.log(`• Key Type:     Time-based (TOTP, 30s)`)
  console.log("-------------------------------------------------------")
  console.log("⚠️  Shown in terminal only. No files saved to disk.\n")
}

main().catch(console.error)
