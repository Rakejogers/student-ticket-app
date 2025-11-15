'use client'

import LoginButton from "@/components/loginButton"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FaLock, FaMicrosoft, FaQuestionCircle } from 'react-icons/fa'
import { useEffect } from "react"
import pb from "@/app/pocketbase"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"

// Create a separate client component for the login content
function LoginContent() {
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
                    <h2 className="text-2xl font-bold text-foreground text-center">
                        University of Kentucky Scholar Seats
                    </h2>
                    <p className="text-muted-foreground text-center max-w-md">
                        Easy access to tickets for UK athletic events.
                    </p>
                </div>
                
                {/* Right side: Login card */}
                <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-sm border shadow-xl">
                    <CardHeader className="space-y-1 text-center">
                        <div className="w-16 h-16 bg-primary mx-auto rounded-full flex items-center justify-center mb-4">
                            <FaLock className="text-primary-foreground text-2xl" />
                        </div>
                        <CardTitle className="text-3xl font-bold text-card-foreground">Welcome Back</CardTitle>
                        <CardDescription>
                            Sign in with your university account to continue
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="grid gap-6">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-25"></div>
                            <div className="relative bg-card border-0 p-6 rounded-lg">
                                <h3 className="font-medium text-center mb-2 text-card-foreground">University of Kentucky Students</h3>
                                <p className="text-sm text-muted-foreground text-center mb-4">
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
                            <h3 className="text-lg font-medium text-foreground">UK Student Ticket Portal</h3>
                            <p className="text-sm text-muted-foreground">
                                Access exclusive tickets for UK athletic events, concerts, and campus activities
                            </p>
                        </div>
                    </CardContent>
                    
                    <CardFooter className="flex flex-col space-y-4 border-t border-border pt-4">
                        <div className="w-full flex items-center justify-center space-x-4 text-sm">
                            <Link href="/contact" className="text-primary hover:text-primary/80 flex items-center">
                                <FaQuestionCircle className="mr-1" />
                                <span>Help</span>
                            </Link>
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                            &copy; {new Date().getFullYear()} University of Kentucky. All rights reserved.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

// Main page component with Suspense boundary
export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    )
}
