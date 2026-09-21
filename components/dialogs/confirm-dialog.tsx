import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Spinner } from "../ui/spinner"
import { FC } from "react"

export interface ConfirmDialogProps {
   open: boolean
   onOpenChange: (open: boolean) => void
   title?: string
   description?: React.ReactNode
   itemName?: string
   actionType?: string
   confirmText?: string
   cancelText?: string
   loadingText?: string
   variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
   isPending?: boolean
   isDeleting?: boolean
   onConfirm: () => void | Promise<void>
   children?: React.ReactNode
}

export type DeleteDialogProps = ConfirmDialogProps

const ConfirmDialog: FC<ConfirmDialogProps> = ({ open, onOpenChange, title = "Confirm Action", itemName, actionType, description, confirmText, cancelText = "Cancel", loadingText, variant = "default", isPending = false, isDeleting, onConfirm, children, }) => {
   const isLoading = isPending || isDeleting || false
   const displayConfirmText = confirmText || (variant === "destructive" ? "Delete" : "Confirm")
   const displayLoadingText = loadingText || (variant === "destructive" ? "Deleting..." : "Confirming...")
   const resolvedAction = actionType || (variant === "destructive" ? "delete" : "proceed with")

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle className="text-lg">{title}</DialogTitle>
               <DialogDescription className="text-sm pt-1">
                  {description ? (
                     description
                  ) : itemName ? (
                     <>
                        Are you sure you want to {resolvedAction}{" "}
                        <strong className="text-foreground font-semibold">
                           &ldquo;{itemName}&rdquo;
                        </strong>
                        ? This action cannot be undone.
                     </>
                  ) : (
                     "Are you sure you want to proceed? This action cannot be undone."
                  )}
               </DialogDescription>
            </DialogHeader>

            {children}

            <DialogFooter>
               <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
               >
                  {cancelText}
               </Button>
               <Button
                  type="button"
                  variant={variant}
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="gap-2"
               >
                  {isLoading ? (
                     <>
                        <Spinner />
                        <span>{displayLoadingText}</span>
                     </>
                  ) : (
                     displayConfirmText
                  )}
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}

export default ConfirmDialog