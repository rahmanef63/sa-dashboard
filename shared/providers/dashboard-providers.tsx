"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger, SidebarMenu } from "shared/components/ui/sidebar"
import { MenuProvider } from "@/slices/sidebar/menu/context/MenuContextStore"
import { BreadcrumbProvider } from "@/slices/sidebar/breadcrumb-provider"
import { getIconByName } from "@/shared/icon-picker/utils"
import { Dashboard } from "@/slices/sidebar/dashboard/types"
import { MenuItemWithChildren } from "@/shared/types/navigation-types"
import { AppSidebar } from "@/slices/sidebar/app-sidebar"

interface SidebarContentProps {
  menuItems: MenuItemWithChildren[];
  onDashboardChange: (dashboard: Dashboard) => void;
  onMenuChange: (menu: MenuItemWithChildren) => void;
  renderIcon: (icon: string | undefined) => React.ReactNode;
}

function SidebarContent({ menuItems, onDashboardChange, onMenuChange, renderIcon }: SidebarContentProps) {
  return (
    <SidebarMenu>
      <SidebarTrigger />
      <SidebarInset>
        {/* Your existing menu content */}
      </SidebarInset>
    </SidebarMenu>
  );
}

export function DashboardProviders({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const renderIcon = React.useCallback((icon?: string) => {
    if (!icon) return null;
    const IconComponent = getIconByName(icon);
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
  }, []);

  const handleDashboardChange = React.useCallback((dashboard: Dashboard) => {
    console.log('Dashboard changed:', dashboard);
  }, []);

  const handleMenuChange = React.useCallback((menu: MenuItemWithChildren) => {
    console.log('Menu changed:', menu);
  }, []);

  return (
    <MenuProvider>
      <SidebarProvider>
        <BreadcrumbProvider>
          <div className="flex h-screen w-screen overflow-hidden">
            <div className="sidebar-container">
              <AppSidebar className="sidebar-default" />
            </div>
            <SidebarInset className="flex-1 overflow-auto">
              <header className="flex flex-row h-16 shrink-0 items-center gap-2 border-b px-4">
                {/* Header content */}
              </header>
              <main className="p-4 sm:p-6 md:p-8 lg:p-10">{children}</main>
            </SidebarInset>
          </div>
        </BreadcrumbProvider>
      </SidebarProvider>
    </MenuProvider>
  );
}
