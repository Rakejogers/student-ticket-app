"use client";

import { useRouter } from "next/navigation";
import pb from "@/app/pocketbase";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

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

    /* eslint-disable */
    useEffect(() => {
      const events = ['mousemove', 'keydown', 'click', 'scroll'];
      events.forEach(event => window.addEventListener(event, resetInactivityTimeout));
    
      resetInactivityTimeout(); // Initialize the timeout
    
      return () => {
        events.forEach(event => window.removeEventListener(event, resetInactivityTimeout));
        if (inactivityTimeout) clearTimeout(inactivityTimeout);
      };
    }, [resetInactivityTimeout]);
    /* eslint-enable */
    
    return (
      <Button onClick={handleLogout} className="text-white bg-red-500 hover:bg-red-600">
        Logout
      </Button>
    );
  };

export default LogoutButton;