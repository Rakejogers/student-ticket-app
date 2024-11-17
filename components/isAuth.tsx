"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import pb from "../app/pocketbase";

export default function isAuth<P extends object>(Component: React.ComponentType<P>) {
  return function IsAuth(props: P) {
    const router = useRouter();
    pb.autoCancellation(false);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          if (pb.authStore.isValid) {
            await pb.collection('users').authRefresh();
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

    return <Component {...props as P} />;
  };
}