import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle } from 'lucide-react'

interface DeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDeleteAccount: () => Promise<void>
}

export function DeleteDialog({ open, onOpenChange, onDeleteAccount }: DeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] mx-auto rounded-lg">
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>Are you sure you want to delete your account? This action cannot be undone.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-4">
          <AlertTriangle className="h-16 w-16 text-yellow-500" />
        </div>
        <DialogFooter className="flex flex-col gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDeleteAccount}>
            Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

