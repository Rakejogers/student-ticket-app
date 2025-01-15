'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CiAt, CiLock } from "react-icons/ci";
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation'
import pb from '@/app/pocketbase'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toast } from '@/hooks/use-toast'

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary">
    <motion.div
      className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  </div>
);

export default function Component() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isView, setIsView] = useState(false)
  const [isLoading, setIsLoading] = useState(false);


  const router = useRouter();

  // Function to handle login logic
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      if (pb.authStore.isValid){
        await pb.authStore.clear();
      }
      await pb.collection('users').authWithPassword(
        email,
        password
      );
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get('redirect') || '/browse/events';
      router.push(redirectPath);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Login failed:', error)
      const errorData = Object.values(error?.response?.data || {})[0] as { message: string } | undefined
      if (error.message === "Failed to authenticate."){
        toast({
          title: "Login failed",
          description: "Incorrect email or password",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login failed",
          description: errorData?.message || "An unexpected error occurred",
          variant: "destructive",
        });
      }
      setIsLoading(false)
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Enter a valid email address",
        variant: "destructive",
      });
      return
    }

    if (password.length < 8) {
      toast({
        title: "Password must be 8 characters long",
        variant: "destructive",
      });
      return
    }

    // login
    login(email, password)
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary">
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