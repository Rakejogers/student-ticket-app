'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { MoonStar, Sun } from 'lucide-react'
import LogoutButton from "./logoutButton"
import LoginButton from "./loginButton"
import pb from '@/app/pocketbase'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MenuIcon } from '@/components/icons/menu'
import { UserNav } from '@/components/user-nav'
import { InstallButton } from '@/components/InstallButton'

interface ClientLayoutProps {
  theme: string;
  onThemeChange: (theme: string) => void;
}

export function ClientLayout({ theme, onThemeChange }: ClientLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

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

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToFAQ = () => {
    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Determine if we're on the landing page
  const isLandingPage = pathname === '/'

  return (
    <header className={`${isLandingPage ? 'bg-background/80' : 'bg-background/80'} backdrop-blur-sm sticky top-0 z-50 shadow-sm`}>
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

          {/* Landing page navigation for non-authenticated users */}
          {isLandingPage && !isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <Button variant="ghost" className="rounded-md px-3 py-2" onClick={scrollToFeatures}>Features</Button>
                <Button variant="ghost" className="rounded-md px-3 py-2" onClick={scrollToHowItWorks}>How it works</Button>
                <Button variant="ghost" className="rounded-md px-3 py-2" onClick={scrollToFAQ}>FAQ</Button>
              </div>
              
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" className="text-muted-foreground font-medium" onClick={() => router.push('/login')}>
                  Login
                </Button>
                <Button className="bg-primary text-primary-foreground font-semibold" onClick={() => router.push('/list-ticket')}>
                  Sell Tickets
                </Button>
                {mounted && (
                  <>
                    <InstallButton />
                    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                    </Button>
                  </>
                )}
              </div>
            </>
          ) : (
            // Regular navigation for authenticated users or non-landing pages
            <div className="hidden md:flex items-center space-x-2" suppressHydrationWarning>
              {!isAuthenticated ? (
                <>
                  <LoginButton buttonText="Login" variant="ghost"/>
                  {mounted && <InstallButton />}
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
                  {mounted && <InstallButton />}
                  <UserNav/>
                </>
              )}
              {mounted && (
                <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
                </Button>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2" suppressHydrationWarning>
            {mounted && (
              <>
                {isAuthenticated && (
                  <motion.a
                    href="https://www.buymeacoffee.com/jakerogers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-md shadow-sm text-foreground bg-muted hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-foreground"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>☕</span>
                  </motion.a>
                )}
                <InstallButton size="icon" />
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

      {/* Mobile menu */}
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
              {isLandingPage && !isAuthenticated ? (
                <>
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={scrollToHowItWorks}>
                    How it works
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={scrollToFeatures}>
                    Features
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={scrollToFAQ}>
                    FAQ
                  </Button>
                  <DropdownMenuSeparator />
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={() => router.push('/login')}>
                    Login
                  </Button>
                  <Button className="w-full justify-start bg-primary text-primary-foreground" onClick={() => router.push('/list-ticket')}>
                    Sell Tickets
                  </Button>
                </>
              ) : !isAuthenticated ? (
                <>
                  <LoginButton buttonText="Login" />
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