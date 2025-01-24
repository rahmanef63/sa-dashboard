"use client"

import * as React from "react"
import type { LucideIcon } from 'lucide-react'
import Link from "next/link"

import { NavMain } from "@/slices/menu/nav-main/nav-main"
import { NavProjects } from "@/slices/menu/nav-projects/nav-projects"
import { NavUser } from "@/slices/menu/nav-user/nav-user"
import { DashboardSwitcher } from "@/slices/menu/dashboard-switcher/dashboard-switcher"
import { DASHBOARDS } from "@/slices/menu/context/dashboard-constants"
import { menuConfigs } from "@/slices/menu/context/menu-configs"
import { navProjectsConfig } from "@/slices/menu/nav-projects/config"
import { type MenuItemWithChildren } from 'shared/types/navigation-types'
import { getIconByName } from "@/shared/icon-picker/utils"
import { cn } from "shared/lib/utils"
import { useMenu } from '@/slices/menu/context/MenuContext'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
} from "shared/components/ui/sidebar"

import { MenuSection } from "slices/menu/nav-main/components"

// Helper component for rendering icons
function Icon({ icon }: { icon?: string | LucideIcon }) {
  if (!icon) return null
  if (typeof icon === 'string') {
    const IconComponent = getIconByName(icon)
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null
  }
  const IconComponent = icon
  return <IconComponent className="h-4 w-4" />
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [mounted, setMounted] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(true)
  const [isSecondaryOpen, setIsSecondaryOpen] = React.useState(false)
  const [secondaryItems, setSecondaryItems] = React.useState<MenuItemWithChildren[] | null>(null)
  const [currentMenuId, setCurrentMenuId] = React.useState<string>(DASHBOARDS[0].defaultMenuId || 'main')
  const { setMenuItems, menuItems } = useMenu()
  const initialLoadRef = React.useRef(false)

  // Function to load navigation based on dashboard
  const loadDashboardNavigation = React.useCallback((menuId: string) => {
    const navigationItems = menuConfigs[menuId] || menuConfigs.main
    setMenuItems(navigationItems)
  }, [setMenuItems])

  // Load navigation when menuId changes
  React.useEffect(() => {
    loadDashboardNavigation(currentMenuId)
  }, [currentMenuId, loadDashboardNavigation])

  const handleNavItemClick = (item: MenuItemWithChildren) => {
    if (item.children) {
      setSecondaryItems(item.children)
      setIsSecondaryOpen(true)
    }
  }

  const handleSecondaryClose = () => {
    setIsSecondaryOpen(false)
    setSecondaryItems(null)
  }

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="sidebar-placeholder" style={{ width: '240px' }} />
  }

  return (
    <>
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <DashboardSwitcher 
            dashboards={DASHBOARDS} 
            onDashboardChange={(dashboard) => loadDashboardNavigation(dashboard.defaultMenuId || 'main')}
          />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <MenuSection 
              items={menuItems}
              onSecondaryItemClick={handleNavItemClick}
              onFocus={() => setIsOpen(true)}
              title="Navigation"
              renderIcon={(iconName?: string) => <Icon icon={iconName} />}
              isCollapsed={!isOpen}
            />
          </SidebarMenu>
          <NavMain />
          <NavProjects projects={navProjectsConfig} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      {isSecondaryOpen && secondaryItems && (
        <Sidebar collapsible="icon" className="secondary-sidebar">
          <SidebarContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <li key={item.id} className="flex items-center px-2 py-1">
                  <Link
                    href={item.url?.href || '#'}
                    className={cn(
                      "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md",
                      "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      "transition-colors duration-200"
                    )}
                  >
                    {item.icon && <span className="h-4 w-4 shrink-0"><Icon icon={item.icon} /></span>}
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenuButton onClick={handleSecondaryClose}>
              Back
            </SidebarMenuButton>
          </SidebarFooter>
        </Sidebar>
      )}
    </>
  )
}
