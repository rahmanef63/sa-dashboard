import { useState, useCallback } from 'react'
import { MenuSwitch, MenuSwitcherItem } from '@/slices/sidebar/menu/types/'

export function useMenuSwitcher(menuSwitcher: MenuSwitch) {
  const initialMenu: MenuSwitcherItem = {
    id: 'default',
    name: 'Default Menu',
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
