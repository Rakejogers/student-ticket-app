'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";
import LogoutButton from "../components/logoutButton";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next';


/// This is the layout for the entire app. It includes the header and the main content.
/// The header includes the navigation links and the user account dropdown.
/// The main content includes the children components passed to this layout.
/// The layout also includes the theme provider, analytics, and speed insights components.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <header className="bg-blue-100">
            <div className="container mx-auto px-4">
              <nav className="flex items-center justify-between h-16">
                <div className="text-xl font-bold">
                  <Link href="/browse/events">Student Ticket Marketplace</Link>
                </div>
                <div className="hidden md:flex items-center space-x-4">
                  <Button variant="ghost" asChild>
                    <Link href="/list-ticket">Sell</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href="/browse/events">Buy</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center">
                        Account <FaChevronDown className="ml-1 h-4 w-4" />
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
                        <LogoutButton />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="md:hidden">
                  <Button variant="ghost" onClick={toggleMobileMenu}>
                    {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                  </Button>
                </div>
              </nav>
            </div>
            {isMobileMenuOpen && (
              <div className="md:hidden bg-blue-50 py-2">
                <div className="container mx-auto px-4 space-y-2">
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/list-ticket">Sell</Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/browse/events">Buy</Link>
                  </Button>
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link href="/login">Login</Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="w-full justify-start">
                        Account <FaChevronDown className="ml-1 h-4 w-4" />
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
                        <LogoutButton />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
          </header>
          <main className="flex-grow">
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
              <Analytics />
              <SpeedInsights />
            </ThemeProvider>
          </main>
        </div>
      </body>
    </html>
  );
}