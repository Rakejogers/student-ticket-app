"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import pb from "../app/pocketbase";
import { motion } from "framer-motion";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary">
    <motion.div
      className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

export default function isAuth<P extends object>(Component: React.ComponentType<P>) {
  return function IsAuth(props: P) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    pb.autoCancellation(false);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          if (pb.authStore.isValid) {
            await pb.collection('users').authRefresh();
            setIsLoading(false);
          } else {
            const currentPath = window.location.pathname;
            router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
          }
        } catch (error) {
          console.error('Authentication error:', error);
          const currentPath = window.location.pathname;
          router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
        }
      };
      checkAuth();
    }, [router]);

    // if (isLoading) {
    //   return <LoadingSpinner />;
    // }

    return <Component {...props as P} />;
  };
}