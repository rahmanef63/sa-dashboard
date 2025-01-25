"use client"

import * as React from "react"
import { type LucideIcon } from 'lucide-react'
import { getIconByName } from "@/shared/icon-picker/utils"
import { useMenu } from '@/slices/menu/context/MenuContext'
import { Sidebar } from "shared/components/ui/sidebar"
import { useSidebar } from '@/shared/hooks/useSidebar'
import { SidebarContentWrapper } from './sidebar-content'

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
  const { menuItems } = useMenu()
  const {
    mounted,
    isOpen,
    isSecondaryOpen,
    secondaryItems,
    handleNavItemClick,
    handleSecondaryClose,
    loadDashboardNavigation,
    setIsOpen
  } = useSidebar({
    initialMenuId: 'main',
    initialIsOpen: true
  })

  if (!mounted) {
    return <div className="sidebar-placeholder" style={{ width: '240px' }} />
  }

  const renderIcon = (icon: string | undefined): JSX.Element | null => {
    if (!icon) return null
    return <Icon icon={icon} />
  }

  return (
    <>
      <SidebarContentWrapper
        type="primary"
        menuItems={menuItems}
        isOpen={isOpen}
        onDashboardChange={(dashboard) => loadDashboardNavigation(dashboard.defaultMenuId || 'main')}
        onSecondaryClick={handleNavItemClick}
        onFocus={() => setIsOpen(true)}
        renderIcon={renderIcon}
        sidebarProps={props}
      />

      {isSecondaryOpen && secondaryItems && (
        <SidebarContentWrapper
          type="secondary"
          menuItems={secondaryItems}
          onDashboardChange={(dashboard) => loadDashboardNavigation(dashboard.defaultMenuId || 'main')}
          onSecondaryClose={handleSecondaryClose}
          renderIcon={renderIcon}
        />
      )}
    </>
  )
}
