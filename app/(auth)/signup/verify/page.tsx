'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CiMail } from "react-icons/ci"
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import pb from '@/app/pocketbase'

export default function Component() {
  const router = useRouter();
  const [isInCooldown, setIsInCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(60);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isInCooldown && cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((prevTime) => prevTime - 1);
      }, 1000);
    }

    if (cooldownTime === 0) {
      setIsInCooldown(false);
      setCooldownTime(60);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isInCooldown, cooldownTime]);

  const handleResendEmail = async () => {
    // Resend the verification email
    await pb.collection('users').requestVerification(pb.authStore.model?.email);
    
    // Start the cooldown
    setIsInCooldown(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Email Verification</CardTitle>
            <CardDescription>Please verify your email address</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CiMail className="h-4 w-4" />
              <AlertDescription>
                An email has been sent to your address. Please check your inbox and click the verification link.
              </AlertDescription>
            </Alert>
            <p className="text-center text-sm text-muted-foreground">
              If you don&apos;t see the email, check your spam folder or click the button below to resend.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button 
              onClick={handleResendEmail} 
              variant="outline" 
              className="w-full"
              disabled={isInCooldown}
            >
              {isInCooldown 
                ? `Resend in ${cooldownTime}s` 
                : 'Resend Verification Email'
              }
            </Button>
            <Button onClick={() => router.push('/')} variant="ghost" className="w-full">
              Back to Home
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}