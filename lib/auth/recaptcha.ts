/**
 * Google reCAPTCHA v3 Server-Side Verification Utility
 */

export interface RecaptchaVerificationResult {
  success: boolean
  score?: number
  action?: string
  error?: string
}

export async function verifyRecaptcha(
  token?: string,
  expectedAction?: string
): Promise<RecaptchaVerificationResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!secretKey) {
    if (process.env.NODE_ENV !== "production") {
      return { success: true, score: 1.0, action: expectedAction }
    }
    return {
      success: false,
      error: "RECAPTCHA_SECRET_KEY is missing in server environment variables",
    }
  }

  if (!token) {
    return { success: false, error: "Missing reCAPTCHA token" }
  }

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

    if (!res.ok) {
      return {
        success: false,
        error: `Google verification endpoint returned status ${res.status}`,
      }
    }

    const data = await res.json()

    // Score ranges from 0.0 (likely bot) to 1.0 (likely human)
    // Google recommendation: >= 0.5 is legitimate user
    if (!data.success) {
      const errorCodes = Array.isArray(data["error-codes"])
        ? data["error-codes"].join(", ")
        : "Verification failed"
      return { success: false, error: `reCAPTCHA failed: ${errorCodes}` }
    }

    if (data.score !== undefined && data.score < 0.5) {
      return {
        success: false,
        score: data.score,
        error: `Bot score threshold not met (score: ${data.score})`,
      }
    }

    if (expectedAction && data.action && data.action !== expectedAction) {
      return {
        success: false,
        score: data.score,
        action: data.action,
        error: `reCAPTCHA action mismatch: expected '${expectedAction}', got '${data.action}'`,
      }
    }

    return {
      success: true,
      score: data.score,
      action: data.action,
    }
  } catch (err: unknown) {
    console.error("reCAPTCHA verification error:", err)
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to verify reCAPTCHA",
    }
  }
}
