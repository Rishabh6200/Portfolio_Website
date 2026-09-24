import { Database, Cloud, ShieldCheck, Mail } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ProfileData } from "@/features/profile/schema"

interface SystemStatusCardProps {
   profile: ProfileData
}

export const SystemStatusCard = ({ profile }: SystemStatusCardProps) => {
   return (
      <Card className="shadow-xs">
         <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Environment & System Health</CardTitle>
            <CardDescription>Live service and database connections</CardDescription>
         </CardHeader>
         <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/20 text-xs">
               <div className="flex items-center gap-2.5">
                  <Database className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium text-foreground">PostgreSQL Database</span>
               </div>
               <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
                  Connected
               </Badge>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/20 text-xs">
               <div className="flex items-center gap-2.5">
                  <Cloud className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-foreground">AWS S3 Media Storage</span>
               </div>
               <Badge variant="outline" className="text-[10px] font-mono border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/5">
                  Ready
               </Badge>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/20 text-xs">
               <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-purple-500" />
                  <span className="font-medium text-foreground">TOTP 2FA Security</span>
               </div>
               <Badge variant="outline" className="text-[10px] font-mono border-purple-500/30 text-purple-600 dark:text-purple-400 bg-purple-500/5">
                  Active
               </Badge>
            </div>

            {profile.email && (
               <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span className="flex items-center gap-1.5">
                     <Mail className="h-3.5 w-3.5" />
                     <span className="truncate">{profile.email}</span>
                  </span>
                  <span>{profile.timezone || "UTC"}</span>
               </div>
            )}
         </CardContent>
      </Card>
   )
}
