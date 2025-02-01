"use client"

import { AppSidebar } from "@/slices/sidebar/app-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "shared/components/ui/sidebar"
import { MenuProvider } from "@/slices/sidebar/menu/context/MenuContextStore"
import { BreadcrumbProvider, BreadcrumbNav } from "@/slices/sidebar/breadcrumb-provider"
import { getIconByName } from "@/shared/icon-picker/utils"
import { Dashboard } from "@/slices/sidebar/dashboard/types"
import { MenuItemWithChildren } from "@/shared/types/navigation-types"

export function DashboardProviders({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const handleDashboardChange = (dashboard: Dashboard) => {
    // Handle dashboard change
    console.log('Dashboard changed:', dashboard)
  }

  const handleMenuChange = (menu: MenuItemWithChildren) => {
    // Handle menu change
    console.log('Menu changed:', menu)
  }

  const renderIcon = (icon: string | undefined) => {
    if (!icon) return null
    const IconComponent = getIconByName(icon)
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null
  }

  return (
    <MenuProvider>
      <SidebarProvider>
        <BreadcrumbProvider>
          <div className="flex h-screen w-screen overflow-hidden">
            <div className="sidebar-container">
              <AppSidebar 
                type="default"
                menuItems={[]}
                onDashboardChange={handleDashboardChange}
                onMenuChange={handleMenuChange}
                renderIcon={renderIcon}
              />
            </div>
            <SidebarInset className="flex-1 overflow-auto">
              <header className="flex flex-row h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
                <BreadcrumbNav />
              </header>
              <main className="p-4 sm:p-6 md:p-8 lg:p-10">{children}</main>
            </SidebarInset>
          </div>
        </BreadcrumbProvider>
      </SidebarProvider>
    </MenuProvider>
  )
}
