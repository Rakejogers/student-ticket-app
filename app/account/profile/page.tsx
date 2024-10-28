"use client"

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
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, AtSign, DollarSign, KeyRound, Trash2, User } from "lucide-react"
import { useEffect, useState } from "react";
import isAuth from "../../../components/isAuth";
import pb from "@/app/pocketbase";
import { RecordModel } from "pocketbase"
import { useRouter } from "next/navigation"

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<RecordModel | null>(null);

  const [isVenmoDialogOpen, setIsVenmoDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const [newVenmo, setNewVenmo] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if(pb.authStore.model == null){
          throw new Error("User not found");
        }
        const user = await pb.collection('users').getOne(pb.authStore.model.id);
        setUser(user);
        setNewVenmo(user.venmo || ""); 
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };

    fetchUser();
  }, [isVenmoDialogOpen]);

  const handleUpdateVenmo = async () => {
    try {
      if(user == null){
        throw new Error("User not found");
      }
      await pb.collection('users').update(user.id, { venmo: newVenmo });
      console.log("Venmo updated successfully!");
      setUser(prev => (prev ? { ...prev, venmo: newVenmo } : prev)); // Update the local user state
      setIsVenmoDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error('Failed to update Venmo', error);
    }
  };

  const handleChangePassword = () => {
    // Here you would typically send a request to your backend to update the password
    console.log("Password changed")
    setIsPasswordDialogOpen(false)
  }

  const router = useRouter();

  const handleDeleteAccount = async () => {
    
    // delete account logic
    if(user == null){
      throw new Error("User not found");
    }
    await pb.collection('users').delete(user.id);
    console.log("Account deleted")
    setIsDeleteDialogOpen(false)
    router.push("/")
  }
/*
const ProfilePage = () => {
  const [user, setUser] = useState<any | null>(null);
  const [venmo, setVenmo] = useState<string>("");  
  const [isUpdatingVenmo, setIsUpdatingVenmo] = useState(false); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if(pb.authStore.model == null){
          throw new Error("User not found");
        }
        const user = await pb.collection('users').getOne(pb.authStore.model.id);
        setUser(user);
        setVenmo(user.venmo || ""); 
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };

    fetchUser();
  }, []);

  // ADD VENMO VALIDATION?
  const handleUpdateVenmo = async () => {
    try {
      await pb.collection('users').update(user.id, 
        { venmo: venmo }
      );
      console.log("Venmo updated successfully!");
      setIsUpdatingVenmo(false);
    } catch (error) {
      console.error('Failed to update Venmo', error);
    }
  };

  const handleChangePassword = () => {
    // Logic to change password
    console.log("Change password clicked");
  };

  const handleDeleteAccount = () => {
    // Logic to delete account
    console.log("Delete account clicked");
  };
  */
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
  /*
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        {user ? (
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Venmo:</strong> {venmo}</p>
            {isUpdatingVenmo ? (
              <div className="mt-4">
                <input
                  type="text"
                  value={venmo}
                  onChange={(e) => setVenmo(e.target.value)}
                  placeholder="Enter your new Venmo link"
                  className="p-2 border rounded"
                />
                <button onClick={handleUpdateVenmo} className="ml-2 p-2 bg-blue-500 text-white rounded">
                  Save Venmo
                </button>
                <button onClick={() => setIsUpdatingVenmo(false)} className="ml-2 p-2 bg-red-500 text-white rounded">
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setIsUpdatingVenmo(true)} className="mt-4 mb-2 p-2 bg-blue-500 text-white rounded">
                Update Venmo
              </button>
            )}
            <button onClick={handleChangePassword} className="mt-4 mb-2 p-2 bg-blue-500 text-white rounded">
              Change Password
            </button>
            <button onClick={handleDeleteAccount} className="mt-4 mb-2 p-2 bg-red-500 text-white rounded">
              Delete Account
            </button>
          </div>

          
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};
*/
export default isAuth(ProfilePage);

