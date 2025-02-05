'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MoonStar, Sun } from 'lucide-react'
import LogoutButton from "./logoutButton"
import LoginButton from "./loginButton"
import pb from '@/app/pocketbase'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MenuIcon } from '@/components/icons/menu'
import { UserNav } from '@/components/user-nav'

interface ClientLayoutProps {
  theme: string;
  onThemeChange: (theme: string) => void;
}

export function ClientLayout({ theme, onThemeChange }: ClientLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

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
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    onThemeChange(newTheme)
  }

  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
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
          <div className="hidden md:flex items-center space-x-2" suppressHydrationWarning>
            {!isAuthenticated ? (
              <>
                <LoginButton />
              </>
            ) : (
              <>
                <motion.a
                    href="https://www.buymeacoffee.com/jakerogers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-foreground bg-muted hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-foreground"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                  <span className="mr-2">☕</span>
                  Buy Us a Coffee
                </motion.a>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/list-ticket">Sell</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/browse/events">Buy</Link>
                </Button>
                <UserNav/>
              </>
            )}
            {mounted && (
              <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              </Button>
            )}
          </div>
          <div className="md:hidden flex items-center space-x-2" suppressHydrationWarning>
            {mounted && (
              <>
                {isAuthenticated && (
                  <motion.a
                    href="https://www.buymeacoffee.com/jakerogers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md shadow-sm text-white bg-muted hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-foreground"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>☕</span>
                  </motion.a>
                )}
                <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              <MenuIcon isOpen={isMobileMenuOpen} toggleMenu={toggleMobileMenu} />
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
              {!isAuthenticated ? (
                <>
                  <LoginButton />
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                    <Link href="/list-ticket">Sell</Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                    <Link href="/browse/events">Buy</Link>
                  </Button>
                  <DropdownMenuSeparator />
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
  )
} 