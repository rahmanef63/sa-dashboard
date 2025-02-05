import { useState, useEffect } from 'react'
import { MenuItem } from '@/slices/sidebar/menu/types/'

export function useMenuItems() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  useEffect(() => {
    const storedMenuItems = localStorage.getItem("navMainItems")
    if (storedMenuItems) {
      setMenuItems(JSON.parse(storedMenuItems))
    }
  }, [])

  const saveMenuItems = (items: MenuItem[]) => {
    setMenuItems(items)
    localStorage.setItem("navMainItems", JSON.stringify(items))
    localStorage.setItem("userMenuItems", JSON.stringify(items))
  }

  const addMenuItem = (item: MenuItem) => {
    const newItems = [...menuItems, item]
    saveMenuItems(newItems)
  }

  const updateMenuItem = (updatedItem: MenuItem) => {
    const newItems = menuItems.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    )
    saveMenuItems(newItems)
  }

  const deleteMenuItem = (id: string) => {
    const newItems = menuItems.filter((item) => item.id !== id)
    saveMenuItems(newItems)
  }

  return {
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem
  }
}
