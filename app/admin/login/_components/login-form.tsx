"use client"

import React, { useState, useEffect, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import {
  ShieldCheck,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Lock,
} from "lucide-react"
import { toast } from "sonner"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"
import { verifyAdminTotpAction, getLoginStatusAction } from "../actions"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/admin"

  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLockedOut, setIsLockedOut] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [shake, setShake] = useState(false)

  // Check on initial page load if client IP is currently locked out
  useEffect(() => {
    let isMounted = true
    getLoginStatusAction().then((status) => {
      if (isMounted && status.isLockedOut) {
        setIsLockedOut(true)
        setError(
          `Too many failed attempts. Please wait ${status.remainingMinutes} minute(s) before trying again.`
        )
      }
    })
    return () => {
      isMounted = false
    }
  }, [])

  const triggerSubmit = (codeToSubmit: string) => {
    if (codeToSubmit.length !== 6 || isLockedOut) return
    setError(null)

    startTransition(async () => {
      try {
        const res = await verifyAdminTotpAction(codeToSubmit)
        if (res.success) {
          toast.success("Authentication successful! Welcome back.")
          router.push(callbackUrl)
          router.refresh()
        } else {
          setError(res.error || "Invalid code. Please try again.")
          setShake(true)
          setTimeout(() => setShake(false), 500)
          setCode("")

          if (res.isLockedOut) {
            setIsLockedOut(true)
          }
        }
      } catch (err) {
        console.error("Login error:", err)
        setError("An unexpected error occurred. Please try again.")
      }
    })
  }

  const isComplete = code.length === 6

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Return to Portfolio Link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Portfolio</span>
        </Link>
      </div>

      {/* Login Card */}
      <motion.div
        animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-black/10 dark:border-white/10 bg-card/80 backdrop-blur-xl p-7 sm:p-9 shadow-2xl space-y-6"
      >
        {/* Card Header */}
        <div className="text-center space-y-2">
          <div
            className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border shadow-inner transition-colors ${
              isLockedOut
                ? "bg-destructive/10 text-destructive border-destructive/20"
                : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
            }`}
          >
            {isLockedOut ? <Lock className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {isLockedOut ? "Access Locked" : "Admin Authentication"}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {isLockedOut
              ? "Security lockout active due to repeated failed attempts"
              : "Enter the 6-digit code"}
          </p>
        </div>

        {/* Shadcn 6-Digit OTP Input */}
        <div className="space-y-4 pt-2">
          <div className="flex justify-center items-center py-2">
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={code}
              onChange={(value) => {
                setCode(value)
                if (value.length === 6) {
                  triggerSubmit(value)
                }
              }}
              disabled={isPending || isLockedOut}
              autoFocus={!isLockedOut}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <p className="text-xs text-destructive font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <Button
            type="button"
            disabled={!isComplete || isPending || isLockedOut}
            onClick={() => triggerSubmit(code)}
            className="w-full h-11 rounded-xl gap-2 font-medium"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying Code...</span>
              </>
            ) : isLockedOut ? (
              <>
                <Lock className="h-4 w-4" />
                <span>Locked Out</span>
              </>
            ) : (
              <>
                <span>Access Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
