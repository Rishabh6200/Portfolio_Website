import { FC } from "react"
import { BarChart3, Plus, Sparkles, Trash2 } from "lucide-react"
import type { FieldArrayWithId, FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ProfileFormValues } from "../schema"

interface ProfileStatsCardProps {
   fields: FieldArrayWithId<ProfileFormValues, "stats", "id">[]
   register: UseFormRegister<ProfileFormValues>
   watch: UseFormWatch<ProfileFormValues>
   errors: FieldErrors<ProfileFormValues>
   onAddStat: () => void
   onRemoveStat: (index: number) => void
}

export const ProfileStatsCard: FC<ProfileStatsCardProps> = ({
   fields,
   register,
   watch,
   errors,
   onAddStat,
   onRemoveStat,
}) => {
   const watchedStats = watch("stats")

   return (
      <Card className="border-border bg-card shadow-xs">
         <CardHeader>
            <div className="flex items-center justify-between">
               <div className="space-y-1">
                  <CardTitle className="text-base flex items-center gap-2">
                     <BarChart3 className="h-4 w-4 text-primary" />
                     <span>Portfolio Hero Metric Cards</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                     Metrics showcased at the base of your hero banner (e.g. Years Experience, Production Apps).
                  </CardDescription>
               </div>

               <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onAddStat}
                  className="gap-1.5 text-xs h-8 cursor-pointer"
               >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Stat</span>
               </Button>
            </div>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               {fields.map((field, idx) => (
                  <div
                     key={field.id}
                     className="p-3.5 rounded-xl border border-border bg-card hover:border-border/80 transition-all space-y-3"
                  >
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground">
                           Metric #{idx + 1}
                        </span>
                        <button
                           type="button"
                           onClick={() => onRemoveStat(idx)}
                           className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors cursor-pointer"
                           title="Delete metric"
                        >
                           <Trash2 className="h-3.5 w-3.5" />
                        </button>
                     </div>

                     <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1 space-y-1">
                           <Label className="text-[11px] text-muted-foreground">Value</Label>
                           <Input
                              {...register(`stats.${idx}.value`)}
                              placeholder="6+"
                              className="h-8 text-xs font-mono font-bold"
                           />
                           {errors.stats?.[idx]?.value && (
                              <p className="text-[10px] text-destructive">
                                 {errors.stats[idx]?.value?.message}
                              </p>
                           )}
                        </div>
                        <div className="col-span-2 space-y-1">
                           <Label className="text-[11px] text-muted-foreground">Label</Label>
                           <Input
                              {...register(`stats.${idx}.label`)}
                              placeholder="Years Experience"
                              className="h-8 text-xs font-medium"
                           />
                           {errors.stats?.[idx]?.label && (
                              <p className="text-[10px] text-destructive">
                                 {errors.stats[idx]?.label?.message}
                              </p>
                           )}
                        </div>
                     </div>

                     <div className="space-y-1">
                        <Label className="text-[11px] text-muted-foreground">Subtext</Label>
                        <Input
                           {...register(`stats.${idx}.subtext`)}
                           placeholder="Full-stack & distributed APIs"
                           className="h-8 text-xs"
                        />
                     </div>
                  </div>
               ))}
            </div>

            {/* Live Metric Cards Preview */}
            <div className="pt-2 border-t border-border">
               <div className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Live Hero Metrics Preview</span>
               </div>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(watchedStats || []).map((s, idx) => (
                     <div
                        key={idx}
                        className="p-3 rounded-xl border border-border bg-muted/20 space-y-1"
                     >
                        <div className="text-xl font-bold font-mono text-foreground">
                           {s?.value || "0"}
                        </div>
                        <div className="text-xs font-semibold text-foreground truncate">
                           {s?.label || "Metric"}
                        </div>
                        <div className="text-[10px] text-muted-foreground line-clamp-1">
                           {s?.subtext || "Description"}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </CardContent>
      </Card>
   )
}

export default ProfileStatsCard
