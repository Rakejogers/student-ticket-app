import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { usePushNotifications } from "@/hooks/use-push-notifications"
import { Bell, BellOff, Trash2 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface ProfileActionsProps {
  onDeleteAccount: () => void
}

export function ProfileActions({ onDeleteAccount }: ProfileActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { 
    isSubscribed, 
    subscribeToNotifications, 
    unsubscribeFromNotifications 
  } = usePushNotifications()

  const handleNotificationToggle = async () => {
    setIsLoading(true)
    try {
      if (isSubscribed) {
        await unsubscribeFromNotifications()
        toast({
          title: "Notifications disabled",
          description: "You will no longer receive push notifications"
        })
      } else {
        await subscribeToNotifications()
        toast({
          title: "Notifications enabled",
          description: "You will now receive push notifications for ticket updates"
        })
      }
    } catch (error) {
      console.error('Error toggling notifications:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to toggle notifications"
      })
    } finally {
      setIsLoading(false)
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
              disabled={isLoading}
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

