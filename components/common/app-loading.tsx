import { LoaderIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppLoadingProps {
   message?: string;
   size?: number;
   className?: string;
}

const AppLoading = ({ message, size = 4, className }: AppLoadingProps) => {
   return (
      <div className={cn("flex items-center justify-center", className)}>
         <div className="flex flex-col items-center">
            <LoaderIcon
               role="status"
               aria-label="Loading"
               className={`size-${size} text-primary animate-spin`}
            />
            {message && <p className="mt-4 text-xs text-muted-foreground">{message}</p>}
         </div>
      </div>
   )
}

export default AppLoading;