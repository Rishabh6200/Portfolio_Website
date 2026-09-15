"use client"

import React from "react"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"

interface RecaptchaProviderProps {
  children: React.ReactNode
}

export function RecaptchaProvider({ children }: RecaptchaProviderProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  // If site key is not configured, render children without error
  if (!siteKey) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[reCAPTCHA:Provider] CRITICAL: NEXT_PUBLIC_RECAPTCHA_SITE_KEY is missing in production environment!"
      )
    } else {
      console.warn(
        "[reCAPTCHA:Provider] NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not defined. reCAPTCHA provider will not initialize."
      )
    }
    return <>{children}</>
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  )
}
