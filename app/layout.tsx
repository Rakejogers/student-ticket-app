import Link from 'next/link'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaChevronDown } from "react-icons/fa6";
import LogoutButton from "../components/logoutButton";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
        <body>
            <div className="min-h-screen flex flex-col">
              <header className="bg-blue-100">
                <div className="container mx-auto px-4">
                  <nav className="flex items-center justify-between h-16">
                    <div className="text-xl font-bold">
                      <Link href="/">Student Ticket Marketplace</Link>
                    </div>
                    <div className="flex items-center space-x-4">
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
                            <Link href="/account/settings">Settings</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <LogoutButton />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </nav>
                </div>
              </header>
              <main>
              <ThemeProvider
                attribute="class"
                defaultTheme="light"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                <Toaster />
              </ThemeProvider>
              </main>
            </div>
        </body>
    </html>
  );
}