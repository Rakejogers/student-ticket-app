'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AnimatedSignUpForm from '@/components/AnimatedSignUpForm'

export default function SignUpPage() {

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

