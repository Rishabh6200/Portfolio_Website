"use client"
import { ArrowLeft, ArrowRight, Loader2, Lock, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react';
import { useState, useTransition } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/toast';
import { verifyAdminTotpAction } from '@/app/console/access/actions';
import { Button } from '@/components/ui/button';

const LoginForm = () => {
   const router = useRouter()
   const [code, setCode] = useState<string>("")
   const [shake, setShake] = useState<boolean>(false)
   const [error, setError] = useState<string | null>(null)
   const [isLockedOut, setIsLockedOut] = useState<boolean>(false)
   const [isPending, startTransition] = useTransition();


   const triggerSubmit = (codeToSubmit: string) => {
      if (codeToSubmit.length !== 6 || isLockedOut) return
      setError(null)

      startTransition(async () => {
         try {
            const res = await verifyAdminTotpAction(codeToSubmit)
            if (res.success) {
               toast.add({
                  type: "success",
                  title: "Access granted!",
                  description: "You're all set! Welcome back.",
               })
               router.push("/console")
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
            console.error("[Auth:Login:Client] Unexpected login error:", err)
            setError("An unexpected error occurred. Please try again.")
         }
      })
   }

   return (
      <div className="w-full max-w-md space-y-8">
         <div>
            <Link
               href="/"
               className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
               <ArrowLeft className="h-3.5 w-3.5" />
               <span>Return to Portfolio</span>
            </Link>
         </div>

         <motion.div
            animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-black/10 dark:border-white/10 bg-card/80 backdrop-blur-xl p-7 sm:p-9 shadow-2xl space-y-6"
         >
            <div className="text-center space-y-2">
               <div
                  className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border shadow-inner transition-colors ${isLockedOut
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
                     <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:text-xl">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                     </InputOTPGroup>
                     <InputOTPSeparator />
                     <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:text-xl">
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                     </InputOTPGroup>
                  </InputOTP>
               </div>

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

               <Button
                  type="button"
                  disabled={code.length !== 6 || isPending || isLockedOut}
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

export default LoginForm