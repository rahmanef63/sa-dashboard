import { useState, useCallback } from 'react'
import { MenuSwitcher, MenuSwitcherItem } from '@/shared/types/navigation-types'

export function useMenuSwitcher(menuSwitcher: MenuSwitcher) {
  const initialMenu: MenuSwitcherItem = menuSwitcher.menus?.[0] || {
    id: 'default',
    title: 'Default Menu',
    dashboardId: menuSwitcher.dashboardId || 'default',
    menuType: menuSwitcher.menuType || 'main',
    menuList: []
  }
  const [activeMenu, setActiveMenu] = useState<MenuSwitcherItem>(initialMenu)

  const handleMenuChange = useCallback((menu: MenuSwitcherItem) => {
    setActiveMenu(menu)
  }, [])

  return {
    activeMenu,
    setActiveMenu,
    handleMenuChange,
  }
}
