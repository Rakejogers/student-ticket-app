"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import pb from "../app/pocketbase"

export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = async () => {
        try {
          if (pb.authStore.isValid==true){
            setIsLoading(false);
            return;
          } else {
            router.push('/login');
          }
        } catch (error) {
          console.log(error)
        }
      };
      checkAuth();
    }, []);

    if (isLoading) {
      return null; // Render nothing while loading
    }

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 to-blue-900 text-gray-200">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
            <p className="mt-8 text-2xl font-semibold">Loading...</p>
          </div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .animate-spin {
              animation: spin 1s linear infinite;
            }
          `}</style>
      </div>
      );
    }

    return <Component {...props} />;
  };
}