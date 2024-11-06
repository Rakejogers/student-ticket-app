"use client";

import { useRouter } from "next/navigation";
import pb from "@/app/pocketbase";
import { useCallback, useEffect, useRef } from "react";

interface LogoutButtonProps {
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className }) => {
    const router = useRouter();
    const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleLogout = useCallback(async () => {
      try {
          await pb.authStore.clear();
          // Redirect to login page
          router.push('/login');
      } catch (error) {
          console.error('Logout failed', error);
      }
  }, [router]);

    const resetInactivityTimeout = useCallback(() => {
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
      inactivityTimeout.current = setTimeout(handleLogout, 1800000); // 30 minutes
  }, [handleLogout]);

  useEffect(() => {
      const events = ['mousemove', 'keydown', 'click', 'scroll'];
      events.forEach(event => window.addEventListener(event, resetInactivityTimeout));
  
      resetInactivityTimeout(); // Initialize the timeout
  
      return () => {
          events.forEach(event => window.removeEventListener(event, resetInactivityTimeout));
          if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
      };
  }, [resetInactivityTimeout]);
    
    return (
      <button
        onClick={handleLogout}
        className={`text-red-500 ${className}`}
      >
        Logout
      </button>
    );
  };

export default LogoutButton;