import { useState } from 'react'
import { UserMenuType } from '../types'

export function useUserMenu() {
  const [activeMenu, setActiveMenu] = useState<UserMenuType | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleMenuOpen = (type: UserMenuType) => {
    setActiveMenu(type)
    setDropdownOpen(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) setActiveMenu(null)
  }

  const handleDropdownChange = (open: boolean) => {
    setDropdownOpen(open)
  }

  return {
    activeMenu,
    dropdownOpen,
    handleMenuOpen,
    handleOpenChange,
    handleDropdownChange
  }
}
