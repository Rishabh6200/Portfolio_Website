import { FC } from "react"
import { Clock, Mail, MapPin, User } from "lucide-react"
import type { FieldErrors, UseFormRegister } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { ProfileFormValues } from "../schema"

interface ProfileBioCardProps {
   register: UseFormRegister<ProfileFormValues>
   errors: FieldErrors<ProfileFormValues>
}

export const ProfileBioCard: FC<ProfileBioCardProps> = ({ register, errors }) => {
   return (
      <Card className="border-border bg-card shadow-xs">
         <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
               <User className="h-4 w-4 text-primary" />
               <span>Personal Bio & Titles</span>
            </CardTitle>
            <CardDescription className="text-xs">
               Core identity displayed on the hero banner and throughout your portfolio.
            </CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs">
                     Display Name *
                  </Label>
                  <Input
                     id="name"
                     {...register("name")}
                     placeholder="Rishabh"
                     className="h-9 text-sm"
                  />
                  {errors.name && (
                     <p className="text-xs text-destructive">{errors.name.message}</p>
                  )}
               </div>

               <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-xs">
                     Role Title *
                  </Label>
                  <Input
                     id="role"
                     {...register("role")}
                     placeholder="Full-Stack & Systems Developer"
                     className="h-9 text-sm"
                  />
                  {errors.role && (
                     <p className="text-xs text-destructive">{errors.role.message}</p>
                  )}
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs flex items-center gap-1.5">
                     <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                     <span>Primary Email</span>
                  </Label>
                  <Input
                     id="email"
                     type="email"
                     {...register("email")}
                     placeholder="rc4556c@gmail.com"
                     className="h-9 text-sm font-mono"
                  />
                  {errors.email && (
                     <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
               </div>

               <div className="space-y-1.5">
                  <Label htmlFor="location" className="text-xs flex items-center gap-1.5">
                     <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                     <span>Location</span>
                  </Label>
                  <Input
                     id="location"
                     {...register("location")}
                     placeholder="Mohali, India (IST)"
                     className="h-9 text-sm"
                  />
                  {errors.location && (
                     <p className="text-xs text-destructive">{errors.location.message}</p>
                  )}
               </div>

               <div className="space-y-1.5">
                  <Label htmlFor="timezone" className="text-xs flex items-center gap-1.5">
                     <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                     <span>Timezone (IANA)</span>
                  </Label>
                  <Input
                     id="timezone"
                     {...register("timezone")}
                     placeholder="Asia/Kolkata"
                     className="h-9 text-sm font-mono"
                  />
                  {errors.timezone && (
                     <p className="text-xs text-destructive">{errors.timezone.message}</p>
                  )}
               </div>
            </div>

            <div className="space-y-1.5">
               <Label htmlFor="tagline" className="text-xs">
                  Hero Tagline
               </Label>
               <Input
                  id="tagline"
                  {...register("tagline")}
                  placeholder="Architecting high-throughput systems & fluid web products."
                  className="h-9 text-sm"
               />
               {errors.tagline && (
                  <p className="text-xs text-destructive">{errors.tagline.message}</p>
               )}
            </div>

            <div className="space-y-1.5">
               <Label htmlFor="bio" className="text-xs">
                  About Bio
               </Label>
               <Textarea
                  id="bio"
                  {...register("bio")}
                  rows={3}
                  placeholder="Short bio explaining your experience and engineering expertise..."
                  className="text-sm leading-relaxed"
               />
               {errors.bio && (
                  <p className="text-xs text-destructive">{errors.bio.message}</p>
               )}
            </div>
         </CardContent>
      </Card>
   )
}

export default ProfileBioCard
