import React from 'react'
import { DashboardSwitcher } from "@/slices/menu/dashboard-switcher/dashboard-switcher"
import { NavUser } from "@/slices/menu/nav-user/nav-user"
import { MenuSection } from "@/slices/menu/nav-main/components"
import { NavMain } from "@/slices/menu/nav-main/nav-main"
import { NavProjects } from "@/slices/menu/nav-projects/nav-projects"
import { navProjectsConfig } from "@/slices/menu/nav-projects/config"
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
} from "@/shared/components/ui/sidebar"
import { 
  Dashboard, 
  MenuItemWithChildren, 
  MenuSwitcher as MenuSwitcherType, 
  Menu, 
  MenuSwitcherItem 
} from '@/shared/types/navigation-types'
import { MenuSwitcher } from '@/slices/menu/menu-switcher/menu-switcher'
import { useSidebar } from '@/shared/hooks/useSidebar'
import { DashboardConstants } from '@/slices/menu/dashboard-switcher/constants'

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
  const regularMenus = menuItems.slice(1) as MenuItemWithChildren[]

  const [selectedMenu, setSelectedMenu] = React.useState<MenuSwitcherItem | null>(
    menuItems.length > 0 && menuSwitcher?.menus?.length ? menuSwitcher.menus[0] : null
  )

  const handleMenuChange = React.useCallback((menu: MenuSwitcherItem) => {
    setSelectedMenu(menu)
    // Pass the menuList items to parent component
    if (menu.menuList?.length) {
      onMenuChange(menu.menuList[0])
    }
  }, [onMenuChange])

  return (
    <Sidebar collapsible="icon" {...sidebarProps}>
      <SidebarHeader>
        <DashboardSwitcher
          dashboards={DashboardConstants.DASHBOARDS}
          onDashboardChange={onDashboardChange}
          isMobile={isMobile}
          className="mb-2"
          defaultDashboardId={currentMenuId}
        />
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {/* sidebar menu from dashboard switcher */}
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
              items={regularMenus}
              onSecondaryItemClick={onMenuChange}
              onFocus={onFocus}
              renderIcon={renderIcon}
            />
          )}
          <NavMain />
          <NavProjects projects={navProjectsConfig.projects} />
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      {type === 'default' && !isMobile && <SidebarRail />}
    </Sidebar>
  )
}