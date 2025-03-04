import { useEffect, useState } from 'react'
import { usePwaInstall } from '@/hooks/use-pwa-install'
import { usePushNotifications } from '@/hooks/use-push-notifications'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Share, Plus, Bell } from "lucide-react"
import { useToast } from '@/hooks/use-toast'
import pb from '@/app/pocketbase'

export function NotificationEnrollment() {
  const [showInstallDialog, setShowInstallDialog] = useState(false)
  const [showNotificationDialog, setShowNotificationDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  
  const { 
    isSubscribed, 
    subscribeToNotifications
  } = usePushNotifications()
  
  const {
    isInstallable,
    isIOS,
    isStandalone,
    promptToInstall
  } = usePwaInstall()

  useEffect(() => {
    // Don't show any dialogs if they're not running in a browser environment
    if (typeof window === 'undefined') return

    // Check if user has previously dismissed the prompts
    const installPromptDismissed = localStorage.getItem('installPromptDismissed') === 'true'
    const notificationPromptDismissed = localStorage.getItem('notificationPromptDismissed') === 'true'
    
    // Check user's authentication status
    const isAuthenticated = pb.authStore.isValid
    
    // Check if user is already subscribed to notifications
    if (isSubscribed || notificationPromptDismissed) return
    
    // Check if the app is running in standalone mode (already installed)
    // If it's installed and user is authenticated, show notification prompt
    if (isStandalone && isAuthenticated) {
      setShowNotificationDialog(true)
      return
    }
    
    // If not standalone, not iOS, installable, not dismissed, and authenticated, show installation prompt
    if (!isStandalone && !isIOS && isInstallable && !installPromptDismissed && isAuthenticated) {
      setShowInstallDialog(true)
      return
    }
    
    // For iOS, show install prompt if authenticated but not standalone and not dismissed
    if (!isStandalone && isIOS && !installPromptDismissed && isAuthenticated) {
      setShowInstallDialog(true)
    }
  }, [isSubscribed, isStandalone, isInstallable, isIOS])

  const handleInstallApp = async () => {
    if (isIOS) {
      // iOS installation is handled through the dialog instructions
      return
    }

    setIsLoading(true)
    try {
      const installed = await promptToInstall()
      if (installed) {
        toast({
          title: "App installed",
          description: "You can now enable notifications"
        })
        setShowInstallDialog(false)
        // Show notification dialog after successful installation
        setShowNotificationDialog(true)
      }
    } catch (error) {
      console.error('Error installing app:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to install the app"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnableNotifications = async () => {
    setIsLoading(true)
    try {
      await subscribeToNotifications()
      toast({
        title: "Notifications enabled",
        description: "You will now receive push notifications for ticket updates"
      })
      setShowNotificationDialog(false)
    } catch (error) {
      console.error('Error subscribing to notifications:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to enable notifications"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDismissInstall = () => {
    localStorage.setItem('installPromptDismissed', 'true')
    setShowInstallDialog(false)
  }

  const handleDismissNotifications = () => {
    localStorage.setItem('notificationPromptDismissed', 'true')
    setShowNotificationDialog(false)
  }

  return (
    <>
      {/* PWA Installation Dialog */}
      <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Install Our App</DialogTitle>
            <DialogDescription>
              Get the best experience by installing our app on your device.
            </DialogDescription>
          </DialogHeader>
          
          {isIOS ? (
            <div className="space-y-4">
              <p className="text-sm">To install on your iOS device:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Tap the share button <Share className="h-4 w-4 inline mx-1" /></li>
                <li>Scroll down and tap &quot;Add to Home Screen&quot; <Plus className="h-4 w-4 inline mx-1" /></li>
                <li>Tap &quot;Add&quot; in the top right corner</li>
                <li>Open the app from your home screen for the best experience</li>
              </ol>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm">Click the button below to install the app on your device:</p>
              <Button 
                onClick={handleInstallApp}
                className="w-full"
                disabled={!isInstallable || isLoading}
              >
                {isLoading ? "Installing..." : "Install App"}
              </Button>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleDismissInstall}>
              Maybe Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Permission Dialog */}
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Notifications</DialogTitle>
            <DialogDescription>
              Stay updated on your ticket sales and purchases by enabling notifications.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm">
              Get real-time updates about:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>New ticket offers</li>
              <li>Messages from buyers or sellers</li>
              <li>Price changes for tickets you're watching</li>
              <li>Transaction confirmations</li>
            </ul>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={handleDismissNotifications}
              className="sm:order-1 order-2"
            >
              Not Now
            </Button>
            <Button 
              onClick={handleEnableNotifications}
              className="w-full sm:w-auto sm:order-2 order-1"
              disabled={isLoading}
            >
              <Bell className="h-4 w-4 mr-2" />
              {isLoading ? "Enabling..." : "Enable Notifications"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 