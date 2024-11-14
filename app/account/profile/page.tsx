'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, AlertCircle, AtSign, BadgeCheck, DollarSign, KeyRound, Trash2, User, BadgeX, Phone } from "lucide-react"
import { useEffect, useState } from "react"
import isAuth from "../../../components/isAuth"
import pb from "@/app/pocketbase"
import { RecordModel } from "pocketbase"
import { useRouter } from "next/navigation"
import Input46 from '@/components/orginui/phoneInput'
import { Alert, AlertDescription } from "@/components/ui/alert"

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<RecordModel | null>(null)
  const [isVenmoDialogOpen, setIsVenmoDialogOpen] = useState(false)
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newVenmo, setNewVenmo] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [error, setError] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isVerificationButtonDisabled, setIsVerificationButtonDisabled] = useState(false)
  const [verificationCooldown, setVerificationCooldown] = useState(0)
  const [oldPassword, setOldPassword] = useState("")

  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (pb.authStore.model == null) {
          throw new Error("User not found")
        }
        const user = await pb.collection('users').getOne(pb.authStore.model.id)
        setUser(user)
        setNewVenmo(user.venmo || "")
      } catch (error) {
        console.error('Failed to fetch user', error)
      }
    }

    fetchUser()
  }, [isVenmoDialogOpen])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (verificationCooldown > 0) {
      timer = setInterval(() => {
        setVerificationCooldown((prev) => prev - 1)
      }, 1000)
    } else {
      setIsVerificationButtonDisabled(false)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [verificationCooldown])

  const handleUpdateVenmo = async () => {
    try {
      if (user == null) {
        throw new Error("User not found")
      }
      await pb.collection('users').update(user.id, { venmo: newVenmo })
      console.log("Venmo updated successfully!")
      setUser(prev => (prev ? { ...prev, venmo: newVenmo } : prev))
      setIsVenmoDialogOpen(false)
    } catch (error) {
      console.error('Failed to update Venmo', error)
    }
  }

  const handleUpdatePhone = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const phoneRegex = /^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/

    if (!newPhone) {
      setError("Please enter a phone number.")
      return
    } 
    else if (phoneRegex.test(newPhone) == false || newPhone.length < 12)
    {
      setError("Please enter a valid phone number.")
      return
    }

    try {
      if (user == null) {
        throw new Error("User not found")
      }
      await pb.collection('users').update(user.id, { phone: newPhone })
      console.log("Phone updated successfully!")
      setUser(prev => (prev ? { ...prev, phone: newPhone } : prev))
      setIsPhoneDialogOpen(false)
    } catch (error) {
      console.error('Failed to update Phone', error)
    }
  }

  const handleChangePassword = async () => {
    try {
      if (user == null) {
        throw new Error("User not found")
      }
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match")
      }
      await pb.collection('users').update(user.id, {
        oldPassword: oldPassword, 
        password: newPassword,
        passwordConfirm: confirmPassword
      })
      await pb.collection('users').authRefresh()
      console.log("Password changed successfully")
      setIsPasswordDialogOpen(false)
      
    } catch (error) {
      console.error('Failed to change password', error)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      if (user == null) {
        throw new Error("User not found")
      }
      await pb.collection('users').delete(user.id)
      console.log("Account deleted")
      setIsDeleteDialogOpen(false)
      router.push("/")
    } catch (error) {
      console.error('Failed to delete account', error)
    }
  }

  const handleSendVerificationEmail = async () => {
    try {
      if (user == null) {
        throw new Error("User not found")
      }
      await pb.collection('users').requestVerification(user.email)
      console.log("Verification email sent")
      setIsVerificationButtonDisabled(true)
      setVerificationCooldown(60)
    } catch (error) {
      console.error('Failed to send verification email', error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary p-4 md:p-0">
      <Card className="w-full max-w-2xl mx-auto md:transform md:-translate-y-1/4">
        <CardHeader className="flex items-left justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl">User Profile</CardTitle>
            <CardDescription>Manage your account settings and preferences.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 md:space-y-4">
          <div className="space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <User className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground">Name</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <AtSign className="h-6 w-6 text-muted-foreground" />
              <div className="flex-grow">
                <p className="font-medium">{user?.email}</p>
                <p className="text-sm text-muted-foreground">Email</p>
              </div>
              {user?.verified ? (
                <BadgeCheck className="h-6 w-6 text-green-500" />
              ) : (
                <div className="flex items-center space-x-2 mt-2 md:mt-0">
                  <BadgeX className="h-6 w-6 text-destructive" />
                  <Button 
                    variant="secondary" 
                    onClick={handleSendVerificationEmail}
                    disabled={isVerificationButtonDisabled}
                    className="w-full md:w-auto"
                  >
                    {isVerificationButtonDisabled 
                      ? `Resend in ${verificationCooldown}s` 
                      : 'Verify Email'
                    }
                  </Button>
                </div>
              )}
            </div>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <Phone className="h-6 w-6 text-muted-foreground" />
              <div className="flex-grow">
                <p className="font-medium">{user?.phone}</p>
                <p className="text-sm text-muted-foreground">Phone (Optional)</p>
              </div>
              <Button variant="secondary" onClick={() => setIsPhoneDialogOpen(true)} className="w-full md:w-auto mt-2 md:mt-0">
                Update
              </Button>
            </div>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
              <DollarSign className="h-6 w-6 text-muted-foreground" />
              <div className="flex-grow">
                <p className="font-medium">{user?.venmo}</p>
                <p className="text-sm text-muted-foreground">Venmo Account</p>
              </div>
              <Button variant="secondary" onClick={() => setIsVenmoDialogOpen(true)} className="w-full md:w-auto mt-2 md:mt-0">
                Update
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <Button variant="secondary" onClick={() => setIsPasswordDialogOpen(true)} className="w-full md:w-auto">
            <KeyRound className="mr-2 h-4 w-4" />
            Change Password
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)} className="w-full md:w-auto">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isVenmoDialogOpen} onOpenChange={setIsVenmoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Venmo Account</DialogTitle>
            <DialogDescription>Enter your new Venmo account details below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="venmo" className="text-right">
                Venmo
              </Label>
              <Input
                id="venmo"
                value={newVenmo}
                onChange={(e) => setNewVenmo(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateVenmo}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPhoneDialogOpen} onOpenChange={setIsPhoneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Phone Number</DialogTitle>
            <DialogDescription>Enter your new phone number below.</DialogDescription>
          </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input46 value={newPhone} onChange={setNewPhone}/> {/* Pass state and handler */}
            </div>
            {error && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button onClick={handleUpdatePhone}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter your new password below.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="old-password" className="text-right">
                Old Password
              </Label>
              <Input
                id="old-password"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-password" className="text-right">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="confirm-password" className="text-right">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleChangePassword}>Change Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>Are you sure you want to delete your account? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-4">
            <AlertTriangle className="h-16 w-16 text-yellow-500" />
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default isAuth(ProfilePage)