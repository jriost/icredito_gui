
'use client'

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  CreditCard,
  Users,
  User,
  Landmark,
  ArrowLeftRight,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const links = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/dashboard/cards',
    label: 'Tarjetas',
    icon: CreditCard,
  },
  {
    href: '/dashboard/payments',
    label: 'Pagos',
    icon: Landmark,
  },
  {
    href: '/dashboard/transactions',
    label: 'Transacciones',
    icon: ArrowLeftRight,
  },
  {
    href: '/dashboard/profile',
    label: 'Perfil',
    icon: User,
  },
];

export default function NavLinks() {
  const pathname = usePathname()

  return (
    <SidebarMenu className="p-2">
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <Link href={link.href} className="w-full">
            <SidebarMenuButton
              isActive={pathname.startsWith(link.href) && (link.href === '/dashboard' ? pathname === link.href : true)}
              tooltip={link.label}
              className="justify-start"
            >
              <link.icon className="size-5" />
              <span className="group-data-[collapsible=icon]:hidden">{link.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
