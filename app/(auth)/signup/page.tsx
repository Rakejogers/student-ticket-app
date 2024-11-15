'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CiAt, CiCircleAlert, CiLock, CiUser } from "react-icons/ci";
import { useRouter } from 'next/navigation'
import pb from '@/app/pocketbase'
import { motion } from 'framer-motion'
import Input46 from '@/components/orginui/phoneInput'

// Loading spinner component
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
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const [inviteCode, setInviteCode] = useState('')
  const [phone, setPhone] = useState('')

  const router = useRouter();

  // Function to handle login logic
  const login = async (email: string, password: string) => {
    try {
      // Login with email and password
      await pb.collection('users').authWithPassword(email, password);
      await pb.collection('users').requestVerification(email);
      setIsLoading(false)
      router.push('/signup/verify'); // Ensure this is called after successful login
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error (e.g., show error message to user)
    }
  };

  const register = async () => {
    setIsLoading(true)
    try {
      const data = {
        "email": email,
        "emailVisibility": true,
        "password": password,
        "passwordConfirm": password,
        "name": name,
        "seller_rating": 100,
        "details": inviteCode,
        "phone": phone
      };

      //create a new user record
      await pb.collection('users').create(data);
      await login(email, password); // Ensure login is called after registration
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle registration error (e.g., show error message to user)
    }
  };

  useEffect(() => {
    setPasswordsMatch(password === confirmPassword)
  }, [password, confirmPassword])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const phoneRegex = /^\+?1?\s*\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (!email.endsWith('@uky.edu')) {
      setError('Please use a valid uky.edu email address')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!inviteCode) {
      setError('Please enter an invite code')
      return
    }

    if (inviteCode !== 'UKY2024-Beta-1') {
      setError('Invalid invite code')
      return
    }

    if (!phone) {
      setError('Please enter a phone number')
      return
    }
    
    if (phoneRegex.test(phone) == false || phone.length < 12)
    {
      setError("Please enter a valid phone number.")
      return
    }

    register()
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
        className="w-full max-w-md"
      >
        <Card className="mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>Create your student ticket account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <CiUser className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Your Name"
                    className="pl-8"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Student Email</Label>
                <div className="relative">
                  <CiAt className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.name@uky.edu"
                    className="pl-8"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input46 value={phone} onChange={setPhone} /> {/* Pass state and handler */}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <CiLock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    className={`pl-8 ${!passwordsMatch && password ? 'border-destructive' : ''}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <CiLock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type="password"
                    className={`pl-8 ${!passwordsMatch && confirmPassword ? 'border-destructive' : ''}`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inviteCode">Invite Code</Label>
                <Input
                  id="inviteCode"
                  type="text"
                  placeholder="Enter your invite code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                />
              </div>
              {!passwordsMatch && password && confirmPassword && (
                <Alert variant="destructive">
                  <CiCircleAlert className="h-4 w-4" />
                  <AlertDescription>Passwords do not match</AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive">
                  <CiCircleAlert className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={!passwordsMatch}>Sign Up</Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}