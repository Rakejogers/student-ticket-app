import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { usePushNotifications } from "@/hooks/use-push-notifications"
import { Bell, BellOff, Trash2 } from "lucide-react"

interface ProfileActionsProps {
  onDeleteAccount: () => void
}

export function ProfileActions({ onDeleteAccount }: ProfileActionsProps) {
  const { 
    isSubscribed, 
    subscribeToNotifications, 
    unsubscribeFromNotifications 
  } = usePushNotifications()

  const handleNotificationToggle = async () => {
    try {
      if (isSubscribed) {
        await unsubscribeFromNotifications()
      } else {
        await subscribeToNotifications()
      }
    } catch (error) {
      console.error('Error toggling notifications:', error)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        {/* <h2 className="text-2xl font-bold mb-4">Account Actions</h2> */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={handleNotificationToggle}
          >
            {isSubscribed ? (
              <>
                <BellOff className="h-4 w-4" />
                Disable Notifications
              </>
            ) : (
              <>
                <Bell className="h-4 w-4" />
                Enable Notifications
              </>
            )}
          </Button>
          
          <Button
            variant="destructive"
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={onDeleteAccount}
          >
            <Trash2 className="h-4 w-4" />
            Delete Account
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

