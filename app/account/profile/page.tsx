"use client";

import { useEffect, useState } from "react";
import { account } from "../../appwrite";
import isAuth from "../../../components/isAuth";

const ProfilePage = () => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await account.get();
        setUser(user);
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };

    fetchUser();
  }, []);

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

