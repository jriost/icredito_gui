
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { logout } from '@/lib/actions'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type UserData = {
  fullName: string
  email: string
  image?: string
}

function getInitials(name: string) {
  if (!name) return '?'
  const names = name.split(' ')
  if (names.length === 1) return names[0].charAt(0).toUpperCase()
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
}

function parseCookie(name: string) {
  if (typeof window === 'undefined') return null;
  const cookie = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
  if (!cookie) return null;
  const value = cookie.split('=')[1];
  try {
    // URL-decode the cookie value and then parse it
    return JSON.parse(decodeURIComponent(value));
  } catch (e) {
    console.error("Failed to parse user data from cookie", e);
    return null;
  }
}

export function UserNav() {
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    const userData = parseCookie('user_data')
    if (userData) {
      setUser(userData)
    }
  }, [])

  if (!user) {
    return (
       <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
        </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image} alt={user.fullName} />
            <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/dashboard/profile">
            <DropdownMenuItem>
                Perfil
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form action={logout}>
            <button type="submit" className="w-full">
                <DropdownMenuItem>
                    Cerrar Sesión
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
