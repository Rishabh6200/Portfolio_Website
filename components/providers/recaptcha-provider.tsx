"use client"

import React from "react"
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"

interface RecaptchaProviderProps {
  children: React.ReactNode
  siteKey?: string
}

export function RecaptchaProvider({ children, siteKey: propSiteKey }: RecaptchaProviderProps) {
  const siteKey = propSiteKey || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  if (!siteKey) {
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
