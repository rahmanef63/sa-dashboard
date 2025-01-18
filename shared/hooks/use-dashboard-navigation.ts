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
      setIsMainOpen(false)
    } else {
      // If clicking a main item without children, close secondary sidebar
      setIsSecondaryOpen(false)
      setActiveSubmenu(null)
      setIsMainOpen(true)
    }
  }

  const handleBack = () => {
    setIsSecondaryOpen(false)
    setIsMainOpen(true)
    setActiveSubmenu(null)
  }

  const handleMainSidebarToggle = (open: boolean) => {
    setIsMainOpen(open)
    if (open && isSecondaryOpen) {
      // When opening main sidebar, close secondary if it's open
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