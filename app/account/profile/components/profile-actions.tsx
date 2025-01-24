import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2 } from 'lucide-react'

interface ProfileActionsProps {
  onDeleteAccount: () => void
}

export function ProfileActions({ onDeleteAccount }: ProfileActionsProps) {
  return (
    <Card>
      <CardContent className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6">
        <Button variant="destructive" onClick={onDeleteAccount} className="w-full sm:w-auto ml-auto">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
        </Button>
      </CardContent>
    </Card>
  )
}

