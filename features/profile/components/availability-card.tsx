import { FC } from "react"
import { Sparkles } from "lucide-react"
import type { FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ProfileFormValues } from "../schema"

export const STATUS_PRESETS = [
   "Open for Work",
   "Available for High-Impact Roles",
   "Consulting & Contract Only",
   "Currently Booked",
]

interface ProfileAvailabilityCardProps {
   register: UseFormRegister<ProfileFormValues>
   watch: UseFormWatch<ProfileFormValues>
   setValue: UseFormSetValue<ProfileFormValues>
   errors: FieldErrors<ProfileFormValues>
}

export const ProfileAvailabilityCard: FC<ProfileAvailabilityCardProps> = ({
   register,
   watch,
   setValue,
   errors,
}) => {
   const currentStatus = watch("status")

   return (
      <Card className="border-border bg-card shadow-xs">
         <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
               <div className="space-y-1">
                  <CardTitle className="text-base flex items-center gap-2">
                     <Sparkles className="h-4 w-4 text-emerald-500" />
                     <span>Availability & Status Pill</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                     This status displays prominently in the hero section and navigation banner.
                  </CardDescription>
               </div>

               {/* Live Preview Pill */}
               <div className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium shadow-xs">
                  <span className="relative flex h-2 w-2">
                     <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                     <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-foreground">
                     {currentStatus || "Open for Work"}
                  </span>
               </div>
            </div>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="space-y-2">
               <Label className="text-xs text-muted-foreground">Quick Presets</Label>
               <div className="flex flex-wrap gap-2">
                  {STATUS_PRESETS.map((preset) => (
                     <button
                        key={preset}
                        type="button"
                        onClick={() => setValue("status", preset, { shouldValidate: true, shouldDirty: true })}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                           currentStatus === preset
                              ? "border-primary bg-primary/10 text-primary font-medium shadow-xs"
                              : "border-border bg-background hover:bg-muted text-muted-foreground"
                        }`}
                     >
                        {preset}
                     </button>
                  ))}
               </div>
            </div>

            <div className="space-y-1.5 pt-1">
               <Label htmlFor="status" className="text-xs">
                  Custom Status Text
               </Label>
               <Input
                  id="status"
                  {...register("status")}
                  placeholder="e.g. Open for Work, Full-Time Roles, Contract"
                  className="max-w-md h-9 text-sm"
               />
               {errors.status && (
                  <p className="text-xs text-destructive">{errors.status.message}</p>
               )}
            </div>
         </CardContent>
      </Card>
   )
}

export default ProfileAvailabilityCard
