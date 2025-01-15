import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
}

import { AppSidebar } from "shared/components/sidebar/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "shared/components/ui/sidebar"
import { MenuProvider } from "@/slices/menu/context/MenuContext"
import { BreadcrumbProvider, BreadcrumbNav } from "shared/components/sidebar/breadcrumb-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <MenuProvider>
          <SidebarProvider>
            <BreadcrumbProvider>
              <div className="flex h-screen w-screen">
                <AppSidebar />
                <SidebarInset className="flex-1 overflow-auto">
                  <header className="flex flex-row h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <BreadcrumbNav />
                  </header>
                  <main className="w-full p-4 sm:p-6 md:p-8 lg:p-10">{children}</main>
                </SidebarInset>
              </div>
            </BreadcrumbProvider>
          </SidebarProvider>
        </MenuProvider>
      </body>
    </html>
  )
}
