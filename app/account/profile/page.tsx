'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RecordModel } from "pocketbase"
import pb from "@/app/pocketbase"
import isAuth from "@/components/isAuth"
import { ProfileHeader } from "./components/profile-header"
import { ProfileInfo } from "./components/profile-info"
import { ProfileActions } from "./components/profile-actions"
import { UpdateDialog } from "./components/update-dialog"
import { PasswordDialog } from "./components/password-dialog"
import { DeleteDialog } from "./components/delete-dialog"

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<RecordModel | null>(null)
  const [isVenmoDialogOpen, setIsVenmoDialogOpen] = useState(false)
  const [isPhoneDialogOpen, setIsPhoneDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [verificationCooldown, setVerificationCooldown] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (pb.authStore.model == null) {
          throw new Error("User not found")
        }
        const user = await pb.collection('users').getOne(pb.authStore.model.id)
        setUser(user)
      } catch (error) {
        console.error('Failed to fetch user', error)
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (verificationCooldown > 0) {
      timer = setInterval(() => {
        setVerificationCooldown((prev) => prev - 1)
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [verificationCooldown])

  const handleSendVerificationEmail = async () => {
    try {
      if (user == null) {
        throw new Error("User not found")
      }
      await pb.collection('users').requestVerification(user.email)
      console.log("Verification email sent")
      setVerificationCooldown(60)
    } catch (error) {
      console.error('Failed to send verification email', error)
    }
  }

  const handleUpdateUser = async (field: string, value: string) => {
    try {
      if (user == null) {
        throw new Error("User not found")
      }
      if (field === 'phone') {
        // Remove any non-digit characters from the phone number
        value = value.replace(/\D/g, '')
      }
      await pb.collection('users').update(user.id, { [field]: value })
      setUser(prev => (prev ? { ...prev, [field]: value } : prev))
      console.log(`${field} updated successfully!`)
    } catch (error) {
      console.error(`Failed to update ${field}`, error)
    }
  }

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    try {
      if (user == null) {
        throw new Error("User not found")
      }
      await pb.collection('users').update(user.id, {
        oldPassword: oldPassword,
        password: newPassword,
        passwordConfirm: newPassword
      })
      await pb.collection('users').authRefresh()
      console.log("Password changed successfully")
    } catch (error) {
      console.error('Failed to change password', error)
      throw error
    }
  }

  const handleDeleteAccount = async () => {
    try {
      if (user == null) {
        throw new Error("User not found")
      }
      await pb.collection('users').delete(user.id)
      console.log("Account deleted")
      router.push("/")
    } catch (error) {
      console.error('Failed to delete account', error)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <ProfileHeader user={user} />
        <ProfileInfo 
          user={user} 
          onUpdateVenmo={() => setIsVenmoDialogOpen(true)}
          onUpdatePhone={() => setIsPhoneDialogOpen(true)}
          onVerifyEmail={handleSendVerificationEmail}
          verificationCooldown={verificationCooldown}
        />
        <ProfileActions 
          onChangePassword={() => setIsPasswordDialogOpen(true)}
          onDeleteAccount={() => setIsDeleteDialogOpen(true)}
        />
      </div>

      <UpdateDialog 
        open={isVenmoDialogOpen}
        onOpenChange={setIsVenmoDialogOpen}
        title="Update Venmo Account"
        description="Enter your new Venmo account details below."
        field="venmo"
        currentValue={user.venmo}
        onUpdate={handleUpdateUser}
      />

      <UpdateDialog 
        open={isPhoneDialogOpen}
        onOpenChange={setIsPhoneDialogOpen}
        title="Update Phone Number"
        description="Enter your new phone number below."
        field="phone"
        currentValue={user.phone}
        onUpdate={handleUpdateUser}
      />

      <PasswordDialog 
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        onChangePassword={handleChangePassword}
      />

      <DeleteDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  )
}

export default isAuth(ProfilePage)