import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { usePushNotifications } from "@/hooks/use-push-notifications"
import { usePwaInstall } from "@/hooks/use-pwa-install"
import { Bell, BellOff, Trash2, Share2, Plus } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ProfileActionsProps {
  onDeleteAccount: () => void
}

export function ProfileActions({ onDeleteAccount }: ProfileActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showInstallDialog, setShowInstallDialog] = useState(false)
  const { toast } = useToast()
  const { 
    isSubscribed, 
    subscribeToNotifications, 
    unsubscribeFromNotifications 
  } = usePushNotifications()
  const {
    isInstallable,
    isIOS,
    isStandalone,
    promptToInstall
  } = usePwaInstall()

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
        // Check if we need to show PWA installation instructions
        if (!isStandalone) {
          setShowInstallDialog(true)
          setIsLoading(false)
          return
        }
        
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

  const handleInstallApp = async () => {
    if (isIOS) {
      // iOS installation is handled through the dialog instructions
      return
    }

    try {
      const installed = await promptToInstall()
      if (installed) {
        toast({
          title: "App installed",
          description: "You can now enable notifications"
        })
        setShowInstallDialog(false)
      }
    } catch (error) {
      console.error('Error installing app:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to install the app"
      })
    }
  }

  return (
    <>
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

      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install App to Enable Notifications</DialogTitle>
            <DialogDescription>
              To receive notifications, you need to install our app on your device first.
            </DialogDescription>
          </DialogHeader>
          
          {isIOS ? (
            <div className="space-y-4">
              <p className="text-sm">To install on your iOS device:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Tap the share button <Share2 className="h-4 w-4 inline mx-1" /></li>
                <li>Scroll down and tap &quot;Add to Home Screen&quot; <Plus className="h-4 w-4 inline mx-1" /></li>
                <li>Tap &quot;Add&quot; in the top right corner</li>
              </ol>
              <p className="text-sm">Once installed, return here to enable notifications.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm">Click the button below to install the app on your device:</p>
              <Button 
                onClick={handleInstallApp}
                className="w-full"
                disabled={!isInstallable}
              >
                Install App
              </Button>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInstallDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

