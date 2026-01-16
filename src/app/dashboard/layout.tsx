import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import NavLinks from './components/nav-links'
import { UserNav } from './components/user-nav'
import Image from 'next/image'
import { HeaderInfo } from './components/header-info'
import ReactQueryProvider from '@/providers/react-query-provider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ReactQueryProvider>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader className="flex flex-col items-center gap-2 p-4">
            <Image
              src="https://www.tuya.com.co/sites/default/files/landings/alivios/logo-tuya-landing.png"
              alt="iCredito Logo"
              width={64}
              height={64}
              className="size-16 object-contain group-data-[collapsible=icon]:size-8 transition-all duration-200"
            />
            <h1 className="text-xl font-semibold group-data-[collapsible=icon]:hidden">
              iCredito
            </h1>
          </SidebarHeader>

          <SidebarContent>
            <NavLinks />
          </SidebarContent>

          <SidebarFooter className="flex p-2 mt-auto group-data-[collapsible=icon]:justify-end justify-start">
            <SidebarTrigger className="hidden md:flex" />
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:justify-end lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-4 ml-auto">
              <HeaderInfo />
              <ThemeToggle />
              <UserNav />
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ReactQueryProvider>
  )
}
