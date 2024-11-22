import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { KeyRound, Trash2 } from 'lucide-react'

interface ProfileActionsProps {
  onChangePassword: () => void
  onDeleteAccount: () => void
}

export function ProfileActions({ onChangePassword, onDeleteAccount }: ProfileActionsProps) {
  return (
    <Card>
      <CardContent className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6">
        <Button variant="outline" onClick={onChangePassword} className="w-full sm:w-auto">
          <KeyRound className="mr-2 h-4 w-4" />
          Change Password
        </Button>
        <Button variant="destructive" onClick={onDeleteAccount} className="w-full sm:w-auto">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
        </Button>
      </CardContent>
    </Card>
  )
}

