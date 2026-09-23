import { FC } from "react"
import { Loader2, Save, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfileFormHeaderProps {
   isLoading: boolean
}

export const ProfileFormHeader: FC<ProfileFormHeaderProps> = ({ isLoading }) => {
   return (
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-md z-20 pt-2">
         <div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
               <User className="h-6 w-6 text-primary" />
               <span>Profile & Social Links</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
               Manage your personal bio, live availability status, fixed social links, and hero metric cards.
            </p>
         </div>

         <div className="flex items-center gap-3">
            <Button
               type="submit"
               disabled={isLoading}
               className="gap-2 shadow-sm font-medium px-5 cursor-pointer"
            >
               {isLoading ? (
                  <>
                     <Loader2 className="h-4 w-4 animate-spin" />
                     <span>Saving...</span>
                  </>
               ) : (
                  <>
                     <Save className="h-4 w-4" />
                     <span>Save Changes</span>
                  </>
               )}
            </Button>
         </div>
      </div>
   )
}

export default ProfileFormHeader
