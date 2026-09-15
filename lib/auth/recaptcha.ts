/**
 * Google reCAPTCHA v3 Server-Side Verification Utility
 */

export interface RecaptchaVerificationResult {
  success: boolean
  score?: number
  action?: string
  hostname?: string
  errorCodes?: string[]
  error?: string
}

export async function verifyRecaptcha(
  token?: string,
  expectedAction?: string
): Promise<RecaptchaVerificationResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!secretKey) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[reCAPTCHA:Server] RECAPTCHA_SECRET_KEY is missing in development. Bypassing verification (action: ${expectedAction || "none"}).`
      )
      return { success: true, score: 1.0, action: expectedAction }
    }
    console.error(
      "[reCAPTCHA:Server] CRITICAL: RECAPTCHA_SECRET_KEY is missing in server environment variables on production!"
    )
    return {
      success: false,
      error: "RECAPTCHA_SECRET_KEY is missing in server environment variables",
    }
  }

  if (!token) {
    console.warn("[reCAPTCHA:Server] Verification failed: Missing reCAPTCHA token in request payload.")
    return { success: false, error: "Missing reCAPTCHA token" }
  }

  const startTime = Date.now()
  const tokenPreview = token.length > 12 ? `${token.slice(0, 8)}...${token.slice(-4)}` : "token-short"
  console.log(
    `[reCAPTCHA:Server] Initiating verification with Google API (tokenPreview: ${tokenPreview}, length: ${token.length}, expectedAction: ${expectedAction || "none"})`
  )

  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
      cache: "no-store",
    })

    const duration = Date.now() - startTime

    if (!res.ok) {
      console.error(
        `[reCAPTCHA:Server] Google siteverify endpoint returned HTTP ${res.status} in ${duration}ms: ${res.statusText}`
      )
      return {
        success: false,
        error: `Google verification endpoint returned status ${res.status}`,
      }
    }

    const data = await res.json()
    console.log(
      `[reCAPTCHA:Server] Google API response in ${duration}ms:`,
      JSON.stringify({
        success: data.success,
        score: data.score,
        action: data.action,
        hostname: data.hostname,
        challenge_ts: data.challenge_ts,
        errorCodes: data["error-codes"],
      })
    )

    // Score ranges from 0.0 (likely bot) to 1.0 (likely human)
    // Google recommendation: >= 0.5 is legitimate user
    if (!data.success) {
      const errorCodes = Array.isArray(data["error-codes"])
        ? data["error-codes"].join(", ")
        : "Verification failed"
      console.warn(`[reCAPTCHA:Server] Verification rejected by Google. Error codes: [${errorCodes}]`)
      return {
        success: false,
        score: data.score,
        action: data.action,
        hostname: data.hostname,
        errorCodes: data["error-codes"],
        error: `reCAPTCHA failed: ${errorCodes}`,
      }
    }

    if (data.score !== undefined && data.score < 0.5) {
      console.warn(
        `[reCAPTCHA:Server] Verification rejected: score ${data.score} is below threshold 0.5 (action: ${data.action}, hostname: ${data.hostname})`
      )
      return {
        success: false,
        score: data.score,
        action: data.action,
        hostname: data.hostname,
        error: `Bot score threshold not met (score: ${data.score})`,
      }
    }

    if (expectedAction && data.action && data.action !== expectedAction) {
      console.warn(
        `[reCAPTCHA:Server] Verification rejected: action mismatch. Expected '${expectedAction}', got '${data.action}'`
      )
      return {
        success: false,
        score: data.score,
        action: data.action,
        hostname: data.hostname,
        error: `reCAPTCHA action mismatch: expected '${expectedAction}', got '${data.action}'`,
      }
    }

    console.log(
      `[reCAPTCHA:Server] Verification PASSED (score: ${data.score}, action: ${data.action}, hostname: ${data.hostname})`
    )
    return {
      success: true,
      score: data.score,
      action: data.action,
      hostname: data.hostname,
    }
  } catch (err: unknown) {
    const duration = Date.now() - startTime
    console.error(`[reCAPTCHA:Server] Verification exception after ${duration}ms:`, err)
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to verify reCAPTCHA",
    }
  }
}
