"use client"

import * as React from "react"
import { type LucideIcon } from 'lucide-react'
import { getIconByName } from "@/shared/icon-picker/utils"
import { useMenu } from '@/slices/menu/context/MenuContextStore'
import { Sidebar } from "@/shared/components/ui/sidebar"
import { useSidebar } from '@/shared/hooks/useSidebar'
import { SidebarContentWrapper } from './sidebar-content'
import { cn } from "@/shared/lib/utils"
import { Dashboard, MenuItemWithChildren } from '@/shared/types/navigation-types'

interface IconProps {
  icon?: string | LucideIcon
  className?: string
}

// Helper component for rendering icons
function Icon({ icon, className }: IconProps) {
  if (!icon) return null
  if (typeof icon === 'string') {
    const IconComponent = getIconByName(icon)
    return IconComponent ? <IconComponent className={cn("h-4 w-4", className)} /> : null
  }
  const IconComponent = icon
  return <IconComponent className={cn("h-4 w-4", className)} />
}

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof SidebarContentWrapper>) {
  const { menuItems } = useMenu()
  const {
    mounted,
    isOpen,
    handleNavItemClick,
    loadDashboardNavigation,
    setIsOpen
  } = useSidebar({
    initialMenuId: 'main',
    initialIsOpen: true
  })

  if (!mounted) {
    return <div className="sidebar-placeholder" style={{ width: '240px' }} />
  }

  return (
    <SidebarContentWrapper
      type="default"
      menuItems={menuItems}
      isOpen={isOpen}
      onDashboardChange={(dashboard: Dashboard) => {
        // Pass dashboard to load its navigation
        loadDashboardNavigation(
          dashboard.defaultMenuId || 'main',
          dashboard.menus?.[0]?.items || dashboard.menuList || []
        )
      }}
      onMenuChange={handleNavItemClick}
      renderIcon={(icon: string | undefined) => icon ? <Icon icon={icon} className={cn(!isOpen && "w-6 h-6")} /> : null}
      onFocus={() => setIsOpen(true)}
      className={cn(
        'transition-all duration-200',
        '[&_[data-sidebar=menu-button]>div:first-child]:!flex [&_[data-sidebar=menu-button]>div:first-child]:!items-center [&_[data-sidebar=menu-button]>div:first-child]:!justify-center',
        !isOpen && "w-[50px]",
        { '[&_[data-sidebar=menu-button]>div:last-child]:hidden': !isOpen },
        className
      )}
      sidebarProps={props}
    />
  )
}