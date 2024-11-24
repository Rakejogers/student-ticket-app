'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Menu, MoonStar, Sun, X } from 'lucide-react'
import LogoutButton from "../components/logoutButton"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next'
import pb from '@/app/pocketbase'
import PageTheme from '@/components/layout-theme'
import Cookies from 'js-cookie'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MenuIcon } from '@/components/icons/menu'
import { UserNav } from '@/components/user-nav'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentTheme, setThemeState] = useState(Cookies.get('theme') || 'dark')
  const pathname = usePathname()

  useEffect(() => {
    setIsAuthenticated(pb.authStore.isValid)
  }, [])

  useEffect(() => {
    setIsAuthenticated(pb.authStore.isValid)
    setIsMobileMenuOpen(false)
  }, [pathname])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleTheme = () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    setThemeState(newTheme)
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
              <header className="bg-background sticky top-0 z-50 shadow-sm">
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
                    <div className="hidden md:flex items-center space-x-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/list-ticket">Sell</Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/browse/events">Buy</Link>
                      </Button>
                      {!isAuthenticated ? (
                        <>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href="/login">Login</Link>
                          </Button>
                          <Button variant="default" size="sm" asChild>
                            <Link href="/signup">Sign Up</Link>
                          </Button>
                        </>
                      ) : (
                        <UserNav/>
                        // <DropdownMenu>
                        //   <DropdownMenuTrigger asChild>
                        //     <Button variant="ghost" size="sm" className="flex items-center">
                        //       Account <ChevronDown className="ml-1 h-4 w-4" />
                        //     </Button>
                        //   </DropdownMenuTrigger>
                        //   <DropdownMenuContent align="end" className="w-48">
                            // <DropdownMenuItem asChild>
                            //   <Link href="/account/profile">Profile</Link>
                            // </DropdownMenuItem>
                            // <DropdownMenuItem asChild>
                            //   <Link href="/account/my-tickets">My Tickets</Link>
                            // </DropdownMenuItem>
                            // <DropdownMenuItem asChild>
                            //   <Link href="/account/sent-offers">Sent Offers</Link>
                            // </DropdownMenuItem>
                            // <DropdownMenuItem asChild>
                            //   <Link href="/contact">Help</Link>
                            // </DropdownMenuItem>
                        //     <DropdownMenuSeparator />
                            // <DropdownMenuItem asChild>
                            //   <LogoutButton
                            //     className="w-full text-destructive hover:text-destructive-foreground hover:bg-destructive"
                            //   />
                            // </DropdownMenuItem>
                        //   </DropdownMenuContent>
                        // </DropdownMenu>
                      )}
                      <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" suppressHydrationWarning>
                        {currentTheme === 'dark' ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="md:hidden flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme" suppressHydrationWarning>
                        {currentTheme === 'dark' ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                        {/* {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />} */}
                        <MenuIcon/>
                      </Button>
                    </div>
                  </nav>
                </div>
                <AnimatePresence>
                  {isMobileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="md:hidden bg-background border-t overflow-hidden"
                    >
                      <div className="container mx-auto px-4 py-4 space-y-2">
                        <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                          <Link href="/list-ticket">Sell</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                          <Link href="/browse/events">Buy</Link>
                        </Button>
                        <DropdownMenuSeparator />
                        {!isAuthenticated ? (
                          <>
                            <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                              <Link href="/login">Login</Link>
                            </Button>
                            <Button variant="default" size="sm" asChild className="w-full justify-start">
                              <Link href="/signup">Sign Up</Link>
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                              <Link href="/account/profile">Profile</Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                              <Link href="/account/my-tickets">My Tickets</Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                              <Link href="/account/sent-offers">Sent Offers</Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                              <Link href="/contact">Help</Link>
                            </Button>
                            <DropdownMenuSeparator />
                            <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                              <LogoutButton />
                            </Button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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