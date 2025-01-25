import React from 'react'
import { DASHBOARDS } from "slices/menu/context/dashboard-constants"

import { DashboardSwitcher } from "slices/menu/dashboard-switcher/dashboard-switcher"
import { NavUser } from "slices/menu/nav-user/nav-user"
import { MenuSection } from "slices/menu/nav-main/components"
import { NavMain } from "slices/menu/nav-main/nav-main"
import { NavProjects } from "slices/menu/nav-projects/nav-projects"

import { navProjectsConfig } from "slices/menu/nav-projects/config"
import { ChevronLeft } from 'lucide-react'
import Link from "next/link"
import { cn } from "shared/lib/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
  SidebarSeparator,
} from "shared/components/ui/sidebar"
import { Dashboard, MenuItemWithChildren } from '@/shared/types/navigation-types'

interface SidebarContentProps {
  type: 'primary' | 'secondary'
  menuItems: MenuItemWithChildren[]
  isOpen?: boolean
  onDashboardChange: (dashboard: Dashboard) => void
  onSecondaryClick?: (item: MenuItemWithChildren) => void
  onSecondaryClose?: () => void
  onFocus?: () => void
  renderIcon: (icon: string | undefined) => JSX.Element | null
  className?: string
  sidebarProps?: React.ComponentProps<typeof Sidebar>
}

export function SidebarContentWrapper({
  type,
  menuItems,
  isOpen = true,
  onDashboardChange,
  onSecondaryClick,
  onSecondaryClose,
  onFocus,
  renderIcon,
  className,
  sidebarProps
}: SidebarContentProps) {
  const isPrimary = type === 'primary'

  return (
    <Sidebar 
      collapsible="icon" 
      className={cn(className, { 'secondary-sidebar': !isPrimary })}
      {...sidebarProps}
    >
      <SidebarHeader>
        <DashboardSwitcher 
          dashboards={DASHBOARDS} 
          onDashboardChange={onDashboardChange}
        />
      </SidebarHeader>
      <SidebarSeparator />
      
      {!isPrimary && onSecondaryClose && (
        <>
          <SidebarMenuButton onClick={onSecondaryClose}>
            <div className="flex w-full items-center px-3 my-auto">
              <span className="mr-2"><ChevronLeft /></span>
              <span>Back</span>
            </div>
          </SidebarMenuButton>
          <SidebarSeparator />
        </>
      )}

      <SidebarContent>
        <SidebarMenu>
          {isPrimary ? (
            <>
              <MenuSection 
                items={menuItems}
                onSecondaryItemClick={onSecondaryClick}
                onFocus={onFocus}
                title="Navigation"
                renderIcon={renderIcon}
                isCollapsed={!isOpen}
              />
              <NavMain />
              <NavProjects projects={navProjectsConfig} />
            </>
          ) : (
            menuItems.map((item) => (
              <li key={item.id} className="flex items-center px-2 py-1">
                <Link
                  href={item.url?.href || '#'}
                  className={cn(
                    "flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md",
                    "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    "transition-colors duration-200"
                  )}
                >
                  {item.icon && typeof item.icon === 'string' && (
                    <span className="h-4 w-4 shrink-0">{renderIcon(item.icon)}</span>
                  )}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))
          )}
        </SidebarMenu>
      </SidebarContent>

      <SidebarSeparator />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      {isPrimary && <SidebarRail />}
    </Sidebar>
  )
}
