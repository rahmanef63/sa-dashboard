"use client"

import { useState } from "react"
import type { MenuItemWithChildren } from "shared/types/navigation-types"

export function useDashboardNavigation() {
  const [isMainOpen, setIsMainOpen] = useState(true)
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(false)
  const [activeSubmenu, setActiveSubmenu] = useState<MenuItemWithChildren[] | null>(null)

  const handleNavItemClick = (item: MenuItemWithChildren) => {
    if (item.children) {
      setActiveSubmenu(item.children)
      setIsSecondaryOpen(true)
      // Keep main menu visible only for submenu navigation
      setIsMainOpen(true)
    } else {
      setIsSecondaryOpen(false)
      setActiveSubmenu(null)
      // For dashboard navigation, hide main menu
      setIsMainOpen(false)
    }
  }

  const handleBack = () => {
    setIsSecondaryOpen(false)
    setActiveSubmenu(null)
    // Show main menu when going back
    setIsMainOpen(true)
  }

  const handleMainSidebarToggle = (open: boolean) => {
    setIsMainOpen(open)
    if (!open) {
      setIsSecondaryOpen(false)
      setActiveSubmenu(null)
    }
  }

  return {
    isMainOpen,
    isSecondaryOpen,
    activeSubmenu,
    setIsMainOpen: handleMainSidebarToggle,
    setIsSecondaryOpen,
    setActiveSubmenu,
    handleNavItemClick,
    handleBack,
  }
}