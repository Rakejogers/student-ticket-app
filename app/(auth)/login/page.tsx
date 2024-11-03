'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CiAt, CiCircleAlert, CiLock } from "react-icons/ci";
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation'
import pb from '@/app/pocketbase'
import Link from 'next/link'
import { motion } from 'framer-motion'

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white">
    <motion.div
      className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

export default function Component() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isView, setIsView] = useState(false)
  const [isLoading, setIsLoading] = useState(false);


  const router = useRouter();

  // Function to handle login logic
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await pb.collection('users').authWithPassword(
        email,
        password
      );
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get('redirect') || '/browse/events';
      router.push(redirectPath);
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      setError('Invalid email or password');
      console.error('Login failed:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    // login
    login(email, password)
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <CiAt className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-8"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <CiLock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={isView ? "text" : "password"}
                    className="pl-8"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {isView ? (
                        <Eye
                          className="absolute right-4 top-2 z-10 cursor-pointer text-gray-500"
                          onClick={() => {
                            setIsView(!isView)
                          }}
                        />
                      ) : (
                        <EyeOff
                          className="absolute right-4 top-2 z-10 cursor-pointer text-gray-500"
                          onClick={() => setIsView(!isView)}
                        />
                  )}
                </div>
              </div>
              {error && (
                <Alert variant="destructive">
                  <CiCircleAlert className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full">Login</Button>
              <div className="flex items-center justify-center w-full">
                <Separator className="flex-grow" />
              </div>
              <Link href="/signup" className="block w-full">
                <Button variant="outline" className="w-full" type="button">
                  Create Account
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}