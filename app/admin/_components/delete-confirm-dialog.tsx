"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export interface DeleteConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  itemName?: string
  description?: React.ReactNode
  confirmText?: string
  cancelText?: string
  isDeleting?: boolean
  onConfirm: () => void | Promise<void>
  children?: React.ReactNode
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  title = "Delete Item",
  itemName,
  description,
  confirmText,
  cancelText = "Cancel",
  isDeleting = false,
  onConfirm,
  children,
}: DeleteConfirmDialogProps) {
  const displayConfirmText = confirmText || title

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
                Are you sure you want to delete{" "}
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
            disabled={isDeleting}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting...</span>
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
