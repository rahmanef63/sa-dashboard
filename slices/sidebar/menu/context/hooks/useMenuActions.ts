import { useCallback } from 'react'
import { MenuItem, MenuItemWithChildren, NavMainData, SubMenuItem, GroupLabel } from 'shared/types/navigation-types'
import { saveMenuItems, saveNavData, removeDuplicateItems, convertToMenuItem } from '../utils/menu.utils'

export const useMenuActions = (
  menuItems: MenuItem[],
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>,
  navData: NavMainData,
  setNavData: React.Dispatch<React.SetStateAction<NavMainData>>,
  timeStampRef: React.MutableRefObject<{ [key: string]: number }>
) => {
  const addMenuItem = useCallback((item: MenuItemWithChildren) => {
    const convertedItem = convertToMenuItem(item)
    const updatedNavData: NavMainData = JSON.parse(JSON.stringify(navData))
    const defaultGroupIndex = updatedNavData.groups.findIndex(group => group.label.id === 'default')
    
    if (!convertedItem.groupId && defaultGroupIndex !== -1) {
      updatedNavData.groups[defaultGroupIndex].items.push({
        ...convertedItem,
        groupId: 'default'
      })
    } else {
      const groupIndex = updatedNavData.groups.findIndex(group => group.label.id === convertedItem.groupId)
      if (groupIndex !== -1) {
        updatedNavData.groups[groupIndex].items.push(convertedItem)
      } else {
        updatedNavData.groups[defaultGroupIndex].items.push({
          ...convertedItem,
          groupId: 'default'
        })
      }
    }
    
    setNavData(updatedNavData)
    const newItems: MenuItem[] = [...menuItems, convertedItem]
    setMenuItems(newItems)
    saveMenuItems([...menuItems, item])
  }, [menuItems, navData, setMenuItems, setNavData])

  const updateMenuItem = useCallback((updatedItem: MenuItemWithChildren) => {
    const convertedItem = convertToMenuItem(updatedItem)
    const newItems: MenuItem[] = menuItems.map((item) =>
      item.id === convertedItem.id ? convertedItem : item
    )
    setMenuItems(newItems)
    saveMenuItems(newItems.map(item => ({ ...item, url: item.url || { href: '/' } })))
    
    const updatedNavData = {
      ...navData,
      groups: navData.groups.map(group => ({
        ...group,
        items: group.items.map(item => 
          item.id === convertedItem.id ? { ...convertedItem, groupId: group.label.id } : item
        )
      }))
    }
    setNavData(updatedNavData)
    saveNavData(updatedNavData)
  }, [menuItems, navData, setMenuItems, setNavData])

  const deleteMenuItem = useCallback((id: string) => {
    const newItems = menuItems.filter(item => item.id !== id)
    setMenuItems(newItems)
    saveMenuItems(newItems.map(item => ({ ...item, url: item.url || { href: '/' } })))
    
    const updatedNavData = {
      ...navData,
      groups: navData.groups.map(group => ({
        ...group,
        items: group.items.filter(item => item.id !== id)
      }))
    }
    setNavData(updatedNavData)
    saveNavData(updatedNavData)
  }, [menuItems, navData, setMenuItems, setNavData])

  const handleChangeGroup = useCallback((itemId: string, newGroupId: string) => {
    const timestamp = Date.now()
    const lastTimestamp = timeStampRef.current[itemId] || 0
    
    if (timestamp - lastTimestamp < 500) {
      return
    }
    
    timeStampRef.current[itemId] = timestamp
    
    const item = menuItems.find(item => item.id === itemId)
    if (!item) return
    
    const updatedItem = { ...item, groupId: newGroupId }
    const updatedNavData = {
      ...navData,
      groups: navData.groups.map(group => ({
        ...group,
        items: group.label.id === newGroupId
          ? [...group.items, updatedItem]
          : group.items.filter(item => item.id !== itemId)
      }))
    }
    
    const cleanedNavData = removeDuplicateItems(updatedNavData)
    setNavData(cleanedNavData)
    saveNavData(cleanedNavData)
  }, [menuItems, navData, setNavData, timeStampRef])

  return {
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    handleChangeGroup
  }
}
