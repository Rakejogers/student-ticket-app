"use client";

import { account } from "../app/appwrite";
import { useRouter } from "next/navigation";



const LogoutButton = () => {
    const router = useRouter();

    const handleLogout = async () => {
      try {
        await account.deleteSession('current');
        // Redirect to login page
        router.push('/login');
      } catch (error) {
        console.error('Logout failed', error);
      }
    };
    
    return (
      <a onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-200">
        Logout
      </a>
    );
  };

export default LogoutButton;