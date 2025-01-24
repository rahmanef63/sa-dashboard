"use client"

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { MenuItem, MenuItemWithChildren, NavMainData, SubMenuItem, GroupLabel } from 'shared/types/navigation-types'
import { MenuContextType } from './types/menu.types'
import { useMenuActions } from './hooks/useMenuActions'
import { loadMenuItems, loadNavData, getDefaultGroup, saveNavData, saveMenuItems, convertToMenuItem } from './utils/menu.utils'

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [navData, setNavData] = useState<NavMainData>({ groups: [] })
  const timeStampRef = useRef<{ [key: string]: number }>({})

  const {
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    handleChangeGroup
  } = useMenuActions(menuItems, setMenuItems, navData, setNavData, timeStampRef)

  useEffect(() => {
    const storedItems = loadMenuItems()
    const storedNavData = loadNavData()
    const defaultGroup = getDefaultGroup()
    
    let initialNavData: NavMainData = { groups: [defaultGroup] }
    
    if (storedNavData) {
      try {
        initialNavData = storedNavData
      } catch (error) {
        console.error('Error parsing stored nav data:', error)
      }
    }
    
    if (storedItems) {
      setMenuItems(storedItems)
      
      storedItems.forEach((item: MenuItem) => {
        if (!item.groupId) {
          initialNavData.groups[0].items.push(item)
        } else {
          const groupIndex = initialNavData.groups.findIndex(group => group.label.id === item.groupId)
          if (groupIndex !== -1) {
            initialNavData.groups[groupIndex].items.push(item)
          } else {
            initialNavData.groups[0].items.push(item)
          }
        }
      })
    }
    
    setNavData(initialNavData)
  }, [])

  // Wrapper for setMenuItems that handles conversion
  const handleSetMenuItems = useCallback((items: MenuItemWithChildren[] | ((prev: MenuItem[]) => MenuItem[])) => {
    if (typeof items === 'function') {
      setMenuItems(items)
    } else {
      setMenuItems(items.map(item => convertToMenuItem(item)))
    }
  }, [])

  const updateSubMenuItem = (groupId: string, parentId: string, subItem: SubMenuItem) => {
    const updatedNavData = {
      ...navData,
      groups: navData.groups.map(group => {
        if (group.label.id === groupId) {
          return {
            ...group,
            items: group.items.map(item => {
              if (item.id === parentId) {
                return {
                  ...item,
                  items: item.items?.map((sub: SubMenuItem) =>
                    sub.id === subItem.id ? subItem : sub
                  ) || []
                }
              }
              return item
            })
          }
        }
        return group
      })
    }

    setNavData(updatedNavData)
    saveNavData(updatedNavData)
  }

  const deleteSubMenuItem = (groupId: string, parentId: string, subItemId: string) => {
    const updatedNavData = {
      ...navData,
      groups: navData.groups.map(group => {
        if (group.label.id === groupId) {
          return {
            ...group,
            items: group.items.map(item => {
              if (item.id === parentId) {
                return {
                  ...item,
                  items: item.items?.filter((sub: SubMenuItem) => sub.id !== subItemId) || []
                }
              }
              return item
            })
          }
        }
        return group
      })
    }

    setNavData(updatedNavData)
    saveNavData(updatedNavData)
  }

  const updateItemCollapsible = (itemId: string, isCollapsible: boolean) => {
    const updatedNavData = {
      ...navData,
      groups: navData.groups.map(group => ({
        ...group,
        items: group.items.map(item =>
          item.id === itemId ? { ...item, isCollapsible } : item
        )
      }))
    }

    setNavData(updatedNavData)
    saveNavData(updatedNavData)
  }

  const updateNavData = (newNavData: NavMainData) => {
    setNavData(newNavData)
    saveNavData(newNavData)
    
    const allItems = newNavData.groups.flatMap(group => 
      group.items.map(item => ({
        ...item,
        groupId: group.label.id
      }))
    )
    setMenuItems(allItems)
    saveMenuItems(allItems)
  }

  const addGroupLabel = (label: GroupLabel) => {
    const updatedNavData = {
      ...navData,
      groups: [...navData.groups, { label, items: [] }]
    }
    setNavData(updatedNavData)
    saveNavData(updatedNavData)
  }

  const updateGroupLabel = (labelId: string, updatedLabel: GroupLabel) => {
    const updatedNavData = {
      ...navData,
      groups: navData.groups.map(group =>
        group.label.id === labelId ? { ...group, label: updatedLabel } : group
      )
    }
    setNavData(updatedNavData)
    saveNavData(updatedNavData)
  }

  const deleteGroupLabel = (labelId: string) => {
    const updatedNavData = {
      ...navData,
      groups: navData.groups.filter(group => group.label.id !== labelId)
    }
    setNavData(updatedNavData)
    saveNavData(updatedNavData)
  }

  const value = {
    menuItems,
    setMenuItems: handleSetMenuItems,
    navData,
    updateNavData,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updateSubMenuItem,
    deleteSubMenuItem,
    updateItemCollapsible,
    handleChangeGroup,
    addGroupLabel,
    updateGroupLabel,
    deleteGroupLabel
  }

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

export const useMenu = () => {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider')
  }
  return context
}
