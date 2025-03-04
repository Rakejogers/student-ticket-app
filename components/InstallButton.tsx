import { useState } from 'react'
import { usePwaInstall } from '@/hooks/use-pwa-install'
import { Button } from "@/components/ui/button"
import { Download, Share, Plus } from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from '@/hooks/use-toast'

export function InstallButton({ variant = "ghost", size = "sm" }: { variant?: "ghost" | "outline" | "secondary" | "default", size?: "sm" | "default" | "lg" | "icon" }) {
  const [showInstallDialog, setShowInstallDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  
  const {
    isInstallable,
    isIOS,
    isStandalone,
    promptToInstall
  } = usePwaInstall()

  // If the app is already installed or not installable, don't show the button
  if (isStandalone || (!isInstallable && !isIOS)) {
    return null
  }

  const handleOpenDialog = () => {
    setShowInstallDialog(true)
  }

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

  return (
    <>
      <Button 
        variant={variant}
        size={size}
        className="flex items-center gap-1"
        onClick={handleOpenDialog}
      >
        <Download className={size === "icon" ? "h-4 w-4" : "h-4 w-4 mr-1"} />
        {size !== "icon" && "Install App"}
      </Button>

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
            <Button variant="outline" onClick={() => setShowInstallDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 