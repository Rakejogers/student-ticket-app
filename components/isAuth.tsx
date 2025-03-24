"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import pb from "../app/pocketbase";

export default function isAuth<P extends object>(Component: React.ComponentType<P>) {
  return function IsAuth(props: P) {
    const router = useRouter();
    const pathname = usePathname();
    pb.autoCancellation(false);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          if (pb.authStore.isValid) {
            await pb.collection('users').authRefresh();
          } else {
            const redirectPath = pathname ? `?redirect=${encodeURIComponent(pathname)}` : '';
            router.push(`/login${redirectPath}`);
          }
        } catch (error) {
          console.error('Authentication error:', error);
          const redirectPath = pathname ? `?redirect=${encodeURIComponent(pathname)}` : '';
          router.push(`/login${redirectPath}`);
        }
      };
      checkAuth();
    }, [router, pathname]);

    return <Component {...props as P} />;
  };
}