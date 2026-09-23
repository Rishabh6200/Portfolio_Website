import { FC } from "react"
import { Calendar, ExternalLink, Mail, Share2 } from "lucide-react"
import type { UseFormRegister, UseFormWatch } from "react-hook-form"
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/common/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import type { ProfileFormValues } from "../schema"

interface ProfileSocialsCardProps {
   register: UseFormRegister<ProfileFormValues>
   watch: UseFormWatch<ProfileFormValues>
}

export const ProfileSocialsCard: FC<ProfileSocialsCardProps> = ({ register, watch }) => {
   const currentGithub = watch("socials.github")
   const currentLinkedin = watch("socials.linkedin")
   const currentTwitter = watch("socials.twitter")
   const currentCal = watch("socials.cal")
   const currentSocialEmail = watch("socials.email")

   return (
      <Card className="border-border bg-card shadow-xs">
         <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
               <Share2 className="h-4 w-4 text-primary" />
               <span>Social Link Options (Essential Pack)</span>
            </CardTitle>
            <CardDescription className="text-xs">
               Fixed professional platforms with custom branding, tested URLs, and live site integration.
            </CardDescription>
         </CardHeader>
         <CardContent className="space-y-4">
            {/* GitHub */}
            <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center gap-3">
               <div className="flex items-center gap-2.5 sm:w-44 shrink-0">
                  <div className="h-8 w-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0">
                     <GithubIcon className="h-4 w-4" />
                  </div>
                  <div>
                     <div className="text-xs font-semibold">GitHub</div>
                     <div className="text-[10px] text-muted-foreground">Code & Repos</div>
                  </div>
               </div>

               <div className="flex-1 flex items-center gap-2">
                  <Input
                     {...register("socials.github")}
                     placeholder="https://github.com/username"
                     className="h-9 text-xs font-mono"
                  />
                  {currentGithub && (
                     <a
                        href={currentGithub}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                        title="Test link"
                     >
                        <ExternalLink className="h-4 w-4" />
                     </a>
                  )}
               </div>
            </div>

            {/* LinkedIn */}
            <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center gap-3">
               <div className="flex items-center gap-2.5 sm:w-44 shrink-0">
                  <div className="h-8 w-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
                     <LinkedinIcon className="h-4 w-4" />
                  </div>
                  <div>
                     <div className="text-xs font-semibold">LinkedIn</div>
                     <div className="text-[10px] text-muted-foreground">Professional Profile</div>
                  </div>
               </div>

               <div className="flex-1 flex items-center gap-2">
                  <Input
                     {...register("socials.linkedin")}
                     placeholder="https://linkedin.com/in/username"
                     className="h-9 text-xs font-mono"
                  />
                  {currentLinkedin && (
                     <a
                        href={currentLinkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                        title="Test link"
                     >
                        <ExternalLink className="h-4 w-4" />
                     </a>
                  )}
               </div>
            </div>

            {/* X (Twitter) */}
            <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center gap-3">
               <div className="flex items-center gap-2.5 sm:w-44 shrink-0">
                  <div className="h-8 w-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0">
                     <XIcon className="h-3.5 w-3.5" />
                  </div>
                  <div>
                     <div className="text-xs font-semibold">X (Twitter)</div>
                     <div className="text-[10px] text-muted-foreground">Public Discourse</div>
                  </div>
               </div>

               <div className="flex-1 flex items-center gap-2">
                  <Input
                     {...register("socials.twitter")}
                     placeholder="https://x.com/username"
                     className="h-9 text-xs font-mono"
                  />
                  {currentTwitter && (
                     <a
                        href={currentTwitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                        title="Test link"
                     >
                        <ExternalLink className="h-4 w-4" />
                     </a>
                  )}
               </div>
            </div>

            {/* Cal.com / Meeting Booking */}
            <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center gap-3">
               <div className="flex items-center gap-2.5 sm:w-44 shrink-0">
                  <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                     <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                     <div className="text-xs font-semibold">Cal.com</div>
                     <div className="text-[10px] text-muted-foreground">1-on-1 Scheduling</div>
                  </div>
               </div>

               <div className="flex-1 flex items-center gap-2">
                  <Input
                     {...register("socials.cal")}
                     placeholder="https://cal.com/username"
                     className="h-9 text-xs font-mono"
                  />
                  {currentCal && (
                     <a
                        href={currentCal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                        title="Test link"
                     >
                        <ExternalLink className="h-4 w-4" />
                     </a>
                  )}
               </div>
            </div>

            {/* Social Contact Email */}
            <div className="p-3.5 rounded-xl border border-border bg-muted/20 flex flex-col sm:flex-row sm:items-center gap-3">
               <div className="flex items-center gap-2.5 sm:w-44 shrink-0">
                  <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                     <Mail className="h-4 w-4" />
                  </div>
                  <div>
                     <div className="text-xs font-semibold">Direct Email</div>
                     <div className="text-[10px] text-muted-foreground">Contact Inquiries</div>
                  </div>
               </div>

               <div className="flex-1 flex items-center gap-2">
                  <Input
                     {...register("socials.email")}
                     placeholder="rc4556c@gmail.com"
                     className="h-9 text-xs font-mono"
                  />
                  {currentSocialEmail && (
                     <a
                        href={`mailto:${currentSocialEmail}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                        title="Test email link"
                     >
                        <ExternalLink className="h-4 w-4" />
                     </a>
                  )}
               </div>
            </div>
         </CardContent>
      </Card>
   )
}

export default ProfileSocialsCard
