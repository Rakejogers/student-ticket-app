'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AnimatedSignUpForm from '@/components/AnimatedSignUpForm'

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary">
    <motion.div
      className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
)

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Let&apos;s create your student ticket account</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatedSignUpForm />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

