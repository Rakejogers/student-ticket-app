'use client'

import LoginButton from "@/components/loginButton"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FaLock, FaMicrosoft, FaQuestionCircle } from 'react-icons/fa'
import { useEffect } from "react"
import pb from "@/app/pocketbase"
import { useRouter, useSearchParams } from "next/navigation"

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirectPath = searchParams?.get('redirect') || '/browse/events'
    
    useEffect(() => {
        const isAuthenticated = pb.authStore.isValid
        if (isAuthenticated) {
            router.push(redirectPath)
        }
    }, [redirectPath, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">

      <div className="container max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left side: University-themed content */}
        <div className="hidden md:flex flex-col items-center space-y-6">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl">
            <Image 
              src="/images/rupp-arena.jpg" 
              alt="University of Kentucky" 
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent flex items-end p-6">
              <p className="text-white text-lg font-medium">Rupp Arena - Home of the Wildcats</p>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white text-center">
            University of Kentucky Scholar Seats
          </h2>
          <p className="text-gray-300 text-center max-w-md">
            Easy access to tickets for UK athletic events.
          </p>
        </div>
        
        {/* Right side: Login card */}
        <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="w-16 h-16 bg-blue-600 mx-auto rounded-full flex items-center justify-center mb-4">
              <FaLock className="text-white text-2xl" />
            </div>
            <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-300">
              Sign in with your university account to continue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="grid gap-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-25"></div>
              <div className="relative bg-card border-0 p-6 rounded-lg">
                <h3 className="font-medium text-center mb-2 text-white">University of Kentucky Students</h3>
                <p className="text-sm text-gray-400 text-center mb-4">
                  Use your LinkBlue credentials for secure access
                </p>
                <LoginButton 
                buttonText="Sign in with Microsoft"
                redirectPath={redirectPath} 
                icon={<FaMicrosoft className="mr-2" />}
                className="w-full"
                />
              </div>
            </div>
            
            {/* Mobile-only university information */}
            <div className="md:hidden text-center space-y-4">
              <h3 className="text-lg font-medium text-white">UK Student Ticket Portal</h3>
              <p className="text-sm text-gray-400">
                Access exclusive tickets for UK athletic events, concerts, and campus activities
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 border-t border-white/10 pt-4">
            <div className="w-full flex items-center justify-center space-x-4 text-sm">
              <Link href="/contact" className="text-blue-400 hover:text-blue-300 flex items-center">
                <FaQuestionCircle className="mr-1" />
                <span>Help</span>
              </Link>
              {/* <div className="h-4 w-px bg-white/20"></div>
              <Link href="/about" className="text-blue-400 hover:text-blue-300 flex items-center">
                <FaInfoCircle className="mr-1" />
                <span>About</span>
              </Link>
               */}
            </div>
            <p className="text-xs text-center text-gray-500">
              &copy; {new Date().getFullYear()} University of Kentucky. All rights reserved.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
