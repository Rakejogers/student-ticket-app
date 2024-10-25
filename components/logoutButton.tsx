"use client";

import { useRouter } from "next/navigation";
import pb from "@/app/pocketbase";
import { useEffect } from "react";

const LogoutButton = () => {
    const router = useRouter();
    let inactivityTimeout: NodeJS.Timeout;

    const handleLogout = async () => {
      try {
        await pb.authStore.clear();;
        // Redirect to login page
        router.push('/login');
      } catch (error) {
        console.error('Logout failed', error);
      }
    };

    const resetInactivityTimeout = () => {
      if (inactivityTimeout) clearTimeout(inactivityTimeout);
      inactivityTimeout = setTimeout(handleLogout, 1800000); // 30 minutes
    };

    useEffect(() => {
      const events = ['mousemove', 'keydown', 'click', 'scroll'];
      events.forEach(event => window.addEventListener(event, resetInactivityTimeout));
    
      resetInactivityTimeout(); // Initialize the timeout
    
      return () => {
        events.forEach(event => window.removeEventListener(event, resetInactivityTimeout));
        if (inactivityTimeout) clearTimeout(inactivityTimeout);
      };
    }, []);
    
    return (
      <a onClick={handleLogout} className="block px-4 py-2 hover:bg-gray-200">
        Logout
      </a>
    );
  };

export default LogoutButton;