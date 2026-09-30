'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

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

  // Backend has been shut down; all sign up / sign in attempts go to the sunset page.
  const oauthLogin = () => {
    router.push('/sunset');
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