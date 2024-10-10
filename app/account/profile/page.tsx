"use client";

import { useEffect, useState } from "react";
import { account } from "../../appwrite";
import isAuth from "../../../components/isAuth";

const ProfilePage = () => {
  const [user, setUser] = useState<any | null>(null);
  const [venmo, setVenmo] = useState<string>("");  
  const [isUpdatingVenmo, setIsUpdatingVenmo] = useState(false); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setUser(user);
        setVenmo(user.prefs.venmo || ""); // NEED TO CREATE THIS IN APPWRITE (I think)
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };

    fetchUser();
  }, []);

  // ADD VENMO VALIDATION?
  const handleUpdateVenmo = async () => {
    try {
      await account.updatePrefs({ venmo });
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

  return (
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
  );
};

export default isAuth(ProfilePage);

