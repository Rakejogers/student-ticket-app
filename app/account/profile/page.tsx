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
import { AlertTriangle, AtSign, BadgeCheck, DollarSign, KeyRound, Trash2, User, BadgeX } from "lucide-react"
import { useEffect, useState } from "react"
import isAuth from "../../../components/isAuth"
import pb from "@/app/pocketbase"
import { RecordModel } from "pocketbase"
import { useRouter } from "next/navigation"

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<RecordModel | null>(null)
  const [isVenmoDialogOpen, setIsVenmoDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newVenmo, setNewVenmo] = useState("")
  const [newPassword, setNewPassword] = useState("")
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <Card className="w-full max-w-2xl mx-auto transform -translate-y-1/4">
        <CardHeader>
          <CardTitle className="text-2xl">User Profile</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <User className="h-6 w-6 text-gray-500" />
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-gray-500">Name</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <AtSign className="h-6 w-6 text-gray-500" />
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-sm text-gray-500">Email</p>
            </div>
            {user?.verified ? (
              <BadgeCheck className="h-6 w-6 text-green-500" />
            ) : (
              <>
                <BadgeX className="h-6 w-6 text-red-500" />
                <Button 
                  variant="outline" 
                  onClick={handleSendVerificationEmail}
                  disabled={isVerificationButtonDisabled}
                >
                  {isVerificationButtonDisabled 
                    ? `Resend in ${verificationCooldown}s` 
                    : 'Send Verification Email'
                  }
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <DollarSign className="h-6 w-6 text-gray-500" />
            <div>
              <p className="font-medium">{user?.venmo}</p>
              <p className="text-sm text-gray-500">Venmo Account</p>
            </div>
            <Button variant="outline" onClick={() => setIsVenmoDialogOpen(true)}>
              Update
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)}>
            <KeyRound className="mr-2 h-4 w-4" />
            Change Password
          </Button>
          <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
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
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
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