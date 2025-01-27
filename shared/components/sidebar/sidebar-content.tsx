import React from 'react'
import { DASHBOARDS } from "slices/menu/context/dashboard-constants"

import { DashboardSwitcher } from "slices/menu/dashboard-switcher/dashboard-switcher"
import { NavUser } from "slices/menu/nav-user/nav-user"
import { MenuSection } from "slices/menu/nav-main/components"
import { NavMain } from "slices/menu/nav-main/nav-main"
import { NavProjects } from "slices/menu/nav-projects/nav-projects"

import { navProjectsConfig } from "slices/menu/nav-projects/config"
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
import { Dashboard, MenuItemWithChildren, type MenuSwitcher as MenuSwitcherType, Menu, MenuSwitcherItem } from '@/shared/types/navigation-types'
import { MenuSwitcher } from '@/slices/menu/menu-switcher/menu-switcher'

interface SidebarContentProps {
  type: 'default' | 'menuSwitcher'
  menuItems: MenuSwitcherType[] | MenuItemWithChildren[]
  isOpen?: boolean
  onDashboardChange: (dashboard: Dashboard) => void
  onMenuChange: (menu: MenuSwitcherType | MenuItemWithChildren) => void
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
  onMenuChange,
  onFocus,
  renderIcon,
  className,
  sidebarProps
}: SidebarContentProps) {
  const menuSwitcher = menuItems[0] as MenuSwitcherType
  const regularMenus = menuItems.slice(1)

  const [selectedMenu, setSelectedMenu] = React.useState<MenuSwitcherItem | null>(
    menuSwitcher?.menus?.[0] || null
  )

  const handleMenuChange = (menu: MenuSwitcherItem | MenuItemWithChildren) => {
    if ('menuList' in menu) {
      setSelectedMenu(menu as MenuSwitcherItem)
    }
    onMenuChange(menu as MenuItemWithChildren)
  }

  return (
    <Sidebar 
      className={cn(className, { 'menu-switcher-sidebar': type !== 'default' })}
      {...sidebarProps}
    >
      <SidebarHeader>
        <DashboardSwitcher
          dashboards={DASHBOARDS}
          onDashboardChange={onDashboardChange}
        />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          {menuSwitcher?.menus && (
            <MenuSwitcher 
              menus={menuSwitcher.menus}
              onMenuChange={handleMenuChange}
              className={cn('menu-switcher', className)}
            />
          )}
          {selectedMenu && (
            <MenuSection 
              items={selectedMenu.menuList}
              onSecondaryItemClick={onMenuChange}
              onFocus={onFocus}
              renderIcon={renderIcon}
            />
          )}
          <MenuSection 
            items={regularMenus as MenuItemWithChildren[]}
            onSecondaryItemClick={onMenuChange}
            onFocus={onFocus}
            renderIcon={renderIcon}
          />
          <NavMain />
          <NavProjects projects={navProjectsConfig.projects} />
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      {type === 'default' && <SidebarRail />}
    </Sidebar>
  )
}