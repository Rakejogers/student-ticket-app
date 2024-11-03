'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CiCircleCheck, CiCircleAlert } from "react-icons/ci"
import { motion } from 'framer-motion'
import pb from '@/app/pocketbase'

interface Params {
  token_id: string;
}

export default function VerifyEmailPage({ params }: { params: Params }) {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const router = useRouter()
  const { token_id } = params

  useEffect(() => {
    const confirmVerification = async () => {
      try {
        await pb.collection("users").confirmVerification(token_id)
        setStatus('success')
        // Redirect to browse/events after a short delay
        setTimeout(() => router.push('/browse/events'), 3000)
      } catch (error) {
        console.error('Confirm Verification failed:', error)
        setStatus('error')
      }
    }

    confirmVerification()
  }, [router, token_id])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="w-full mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Email Verification</CardTitle>
            <CardDescription>
              {status === 'verifying' ? 'Verifying your email...' : 
               status === 'success' ? 'Your email has been verified!' : 
               'Verification failed'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === 'verifying' && (
              <Alert>
                <AlertDescription>
                  Please wait while we verify your email address...
                </AlertDescription>
              </Alert>
            )}
            {status === 'success' && (
              <Alert>
                <CiCircleCheck className="h-4 w-4 text-green-500" />
                <AlertDescription>
                  Your email has been successfully verified. You will be redirected to the events page shortly.
                </AlertDescription>
              </Alert>
            )}
            {status === 'error' && (
              <Alert variant="destructive">
                <CiCircleAlert className="h-4 w-4" />
                <AlertDescription>
                  We encountered an error while verifying your email. Please try again.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            {status === 'error' && (
              <Button onClick={() => router.push('/')} className="w-full">
                Back to Home
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}