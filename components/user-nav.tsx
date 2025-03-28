"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import pb from '@/app/pocketbase'
import LogoutButton from "./logoutButton"
import { PWASafeLink } from "./PWASafeLink"

interface UserData {
  name: string
  email: string
}

export function UserNav() {
  const userData = pb.authStore.model as UserData
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:ring-2 hover:ring-ring ring-offset-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{userData?.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userData?.name || 'username'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userData?.email || 'u@example.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
            <DropdownMenuItem asChild>
                <PWASafeLink href="/account/profile">Profile</PWASafeLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <PWASafeLink href="/account/my-tickets">My Tickets</PWASafeLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <PWASafeLink href="/account/sent-offers">Sent Offers</PWASafeLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <PWASafeLink href="/contact">Help</PWASafeLink>
            </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
            <LogoutButton
                className="w-full text-destructive hover:text-destructive-foreground hover:bg-destructive"
            />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}