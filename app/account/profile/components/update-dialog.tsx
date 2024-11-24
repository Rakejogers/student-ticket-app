import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

interface UpdateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  field: string
  currentValue: string
  onUpdate: (field: string, value: string) => Promise<void>
}

export function UpdateDialog({ open, onOpenChange, title, description, field, currentValue, onUpdate }: UpdateDialogProps) {
  const [value, setValue] = useState(currentValue)
  const [error, setError] = useState("")

  const handleUpdate = async () => {
    if (field === 'phone' && !isValidPhoneNumber(value)) {
      setError("Please enter a valid phone number")
      return
    }
    await onUpdate(field, value)
    onOpenChange(false)
  }

  const isValidPhoneNumber = (phoneNumber: string) => {
    const phoneNumberPattern = /^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/
    return phoneNumberPattern.test(phoneNumber)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor={field} className="text-right">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </Label>
            {field === 'phone' ? (
              <div className="col-span-3">
                <PhoneInput
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="US"
                  value={value}
                  onChange={(value) => setValue(value || "")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                {error && <p className="text-sm text-destructive mt-2">{error}</p>}
              </div>
            ) : (
              <Input
                id={field}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="col-span-3"
              />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdate}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}