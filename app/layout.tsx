'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Menu, MoonStar, Sun, X } from "lucide-react"
import LogoutButton from "../components/logoutButton"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next'
import pb from '@/app/pocketbase'
import PageTheme from '@/components/layout-theme'
import Cookies from 'js-cookie';
import { usePathname } from 'next/navigation'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentTheme, setThemeState] = useState(Cookies.get('theme') || 'dark')
  // const [routeChangeTrigger, setRouteChangeTrigger] = useState(0); // New state for triggering re-renders
  const pathname = usePathname(); // Get the current pathname

  useEffect(() => {
    setIsAuthenticated(pb.authStore.isValid)
  }, [])

  // Use useEffect to detect pathname changes
  useEffect(() => {
    setIsAuthenticated(pb.authStore.isValid); // Check if user is authenticated
    setIsMobileMenuOpen(false); // Example: close mobile menu on route change
    // setRouteChangeTrigger(prev => prev + 1); // Increment to trigger re-render
  }, [pathname]); // Dependency array includes pathname

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setThemeState(newTheme);
  }

  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PageTheme theme={currentTheme}>
            <div className="min-h-screen flex flex-col">
              <header className="bg-background">
                <div className="container mx-auto px-4">
                  <nav className="flex items-center justify-between h-16">
                  {!isAuthenticated ? (
                        <Link href="/" className="text-2xl font-bold text-primary">
                          Scholar Seats
                        </Link>
                      ) : (
                        <Link href="/browse/events" className="text-2xl font-bold text-primary">
                          Scholar Seats
                        </Link>
                      )}
                    <div className="hidden md:flex items-center space-x-4">
                      <Button variant="ghost" asChild>
                        <Link href="/list-ticket">Sell</Link>
                      </Button>
                      <Button variant="ghost" asChild>
                        <Link href="/browse/events">Buy</Link>
                      </Button>
                      {!isAuthenticated ? (
                        <Button variant="default" asChild>
                          <Link href="/signup">Sign Up</Link>
                        </Button>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center">
                              Account <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                              <Link href="/account/profile">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="/account/my-tickets">My Tickets</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href="/account/sent-offers">Sent Offers</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <LogoutButton
                                className="w-full text-destructive-foreground hover:text-foreground hover:bg-destructive"
                              />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                      <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" suppressHydrationWarning>
                        {currentTheme === 'dark' ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
                      </Button>
                    </div>
                    <div className="md:hidden">
                      <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" suppressHydrationWarning>
                        {currentTheme === 'dark' ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                      </Button>
                    </div>
                  </nav>
                </div>
                {isMobileMenuOpen && (
                  <div className="md:hidden bg-background py-2">
                    <div className="container mx-auto px-4 space-y-2">
                      <Button variant="ghost" asChild className="w-full justify-start">
                        <Link href="/list-ticket">Sell</Link>
                      </Button>
                      <Button variant="ghost" asChild className="w-full justify-start">
                        <Link href="/browse/events">Buy</Link>
                      </Button>
                      {!isAuthenticated ? (
                        <Button variant="default" asChild className="w-full justify-start">
                          <Link href="/signup">Sign Up</Link>
                        </Button>
                      ) : (
                        <>
                          <Button variant="ghost" asChild className="w-full justify-start">
                            <Link href="/account/profile">Profile</Link>
                          </Button>
                          <Button variant="ghost" asChild className="w-full justify-start">
                            <Link href="/account/my-tickets">My Tickets</Link>
                          </Button>
                          <Button variant="ghost" asChild className="w-full justify-start">
                            <Link href="/account/sent-offers">Sent Offers</Link>
                          </Button>
                          <LogoutButton className="w-full justify-start" />
                        </>
                      )}
                    </div>
                  </div>
                )}
              </header>
              <main className="flex-grow">
                  {children}
                  <Toaster />
                  <Analytics />
                  <SpeedInsights />

              </main>
            </div>
          </PageTheme>
        </ThemeProvider>
      </body>
    </html>
  )
}