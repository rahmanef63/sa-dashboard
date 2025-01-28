import React from 'react'
import { DASHBOARDS } from "@/slices/menu/dashboard-switcher/constants/dashboard-constants"

import { DashboardSwitcher } from "slices/menu/dashboard-switcher/dashboard-switcher"
import { NavUser } from "slices/menu/nav-user/nav-user"
import { MenuSection } from "slices/menu/nav-main/components"
import { NavMain } from "slices/menu/nav-main/nav-main"
import { NavProjects } from "slices/menu/nav-projects/nav-projects"

import { navProjectsConfig } from "slices/menu/nav-projects/config"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuSkeleton,
  SidebarRail,
  SidebarSeparator,
} from "shared/components/ui/sidebar"
import { Dashboard, MenuItemWithChildren, type MenuSwitcher as MenuSwitcherType, Menu, MenuSwitcherItem } from '@/shared/types/navigation-types'
import { MenuSwitcher } from '@/slices/menu/menu-switcher/menu-switcher'
import { useSidebar } from '@/shared/hooks/useSidebar'

interface SidebarContentProps {
  type: 'default' | 'menuSwitcher'
  menuItems: MenuSwitcherType[] | MenuItemWithChildren[]
  isOpen?: boolean
  onDashboardChange: (dashboard: Dashboard) => void
  onMenuChange: (menu: MenuItemWithChildren) => void
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
  const { isMobile, currentMenuId } = useSidebar()
  const menuSwitcher = menuItems[0] as MenuSwitcherType
  const regularMenus = menuItems.slice(1)

  const [selectedMenu, setSelectedMenu] = React.useState<MenuSwitcherItem | null>(
    menuItems.length > 0 && menuSwitcher?.menus?.length ? menuSwitcher.menus[0] : null
  )

  const handleMenuChange = (menu: MenuSwitcherItem) => {
    setSelectedMenu(menu)
    // Pass the menuList items to parent component
    if (menu.menuList?.length) {
      onMenuChange(menu.menuList[0])
    }
  }

  return (
    <Sidebar collapsible="icon" {...sidebarProps}>
      <SidebarHeader>
        <DashboardSwitcher
          dashboards={DASHBOARDS}
          onDashboardChange={onDashboardChange}
          isMobile={isMobile}
          className="mb-2"
          defaultDashboardId={currentMenuId}
        />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            {menuSwitcher?.menus && (
              <MenuSwitcher 
                menuSwitcher={menuSwitcher}
                onMenuChange={handleMenuChange}
                isMobile={isMobile}
                className="mb-2"
              />
            )}
            {selectedMenu && selectedMenu.menuList?.length > 0 && (
              <MenuSection 
                items={selectedMenu.menuList}
                onSecondaryItemClick={onMenuChange}
                onFocus={onFocus}
                renderIcon={renderIcon}
              />
            )}
          </SidebarGroup>
          {regularMenus.length > 0 && (
            <MenuSection 
              items={regularMenus as MenuItemWithChildren[]}
              onSecondaryItemClick={onMenuChange}
              onFocus={onFocus}
              renderIcon={renderIcon}
            />
          )}
          <NavMain />
          <NavProjects projects={navProjectsConfig.projects} />
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      {type === 'default' && !isMobile && <SidebarRail />}
    </Sidebar>
  )
}