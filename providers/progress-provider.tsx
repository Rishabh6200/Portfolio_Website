"use client"

import * as React from "react"
import { ProgressProvider as BProgressProvider } from "@bprogress/next/app"

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  return (
    <BProgressProvider
      height="2.5px"
      color="#6366f1"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </BProgressProvider>
  )
}
