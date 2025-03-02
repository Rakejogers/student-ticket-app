'use client'

import { Button } from "@/components/ui/button"
import pb from '@/app/pocketbase'
import { useRouter } from 'next/navigation'
import { toast } from "@/hooks/use-toast";

interface LoginButtonProps {
  redirectPath?: string;
  buttonText?: string;
  icon?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
}

// This is the login button that is used to login with Microsoft that can have a custom button text set and icon defaulting to none and additional classes added
export default function LoginButton({ redirectPath = '/browse/events', buttonText = 'Sign in with Microsoft', icon = null, className = '', variant = 'default' }: LoginButtonProps) {
  const router = useRouter();

  const oauthLogin = async () => {
    const authData = await pb.collection('users').authWithOAuth2({ provider: 'microsoft' });
    console.log(authData)
    const email = authData.meta?.email;
    const emailDomain = email?.split('@')[1];


    if (emailDomain === 'uky.edu') {
      if (authData.meta?.isNew || authData.record.name === "") {
        router.push("/onboarding")
      } else {
        router.push(redirectPath);
      }
    } else {
      await pb.collection('users').delete(authData.record.id);
      toast({
        title: "Access Denied",
        description: "You must use a uky.edu email to access this application.",
        variant: "destructive",
      });
    }
  }

  return (
    <Button 
      variant={variant} 
      size="lg" 
      onClick={oauthLogin}
      onTouchEnd={(e) => {
        e.preventDefault();
        oauthLogin();
      }}
      className={`${className}`}
    >
      {icon}
      <span>{buttonText}</span>
    </Button>
  )
} 