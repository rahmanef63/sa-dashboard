"use client"

import React from 'react'
import { useMenu } from '../context/MenuContextStore'
import * as hooks from './hooks'
import { SidebarGroupComponent } from './components/groups/MenuGroup'
import { GroupLabel, MenuItem, SubMenuItem, NavMainData, NavMainGroup } from '@/shared/types/navigation-types'

// Type guard to check if a MenuItem is a SubMenuItem
function isSubMenuItem(item: MenuItem): item is SubMenuItem {
  return item.parentId !== undefined;
}

export function NavMain() {
  const { navData: contextNavData, updateNavData } = useMenu()
  const {
    isOpen,
    dialogType,
    dialogState,
    openDialog,
    closeDialog
  } = hooks.useNavMainDialog()
  const [mounted, setMounted] = React.useState(false)

  // Cast the navData to our more specific type
  const navData = contextNavData as NavMainData

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Return a placeholder with the same structure during SSR
  if (!mounted) {
    return <div className="nav-main-placeholder" />
  }

  if (!navData || navData.groups.length === 0) {
    return null;
  }

  const handleSaveGroupLabel = (label: GroupLabel) => {
    const updatedNavData: NavMainData = { ...navData }
    if (dialogState?.type === 'group' && dialogState.item) {
      const groupIndex = updatedNavData.groups.findIndex((g: NavMainGroup) => g.label.id === (dialogState.item as GroupLabel).id)
      if (groupIndex !== -1) {
        updatedNavData.groups[groupIndex].label = label
      }
    } else {
      updatedNavData.groups.push({ label, items: [] })
    }
    updateNavData(updatedNavData)
    closeDialog()
  }

  const handleDeleteGroupLabel = (id: string) => {
    const updatedNavData: NavMainData = {
      ...navData,
      groups: navData.groups.filter((g: NavMainGroup) => g.label.id !== id)
    }
    updateNavData(updatedNavData)
  }

  const handleSaveMenuItem = (item: MenuItem) => {
    const updatedNavData: NavMainData = { ...navData }
    if (dialogState?.type === 'menuItem' && dialogState.item) {
      const groupIndex = updatedNavData.groups.findIndex((g: NavMainGroup) => 
        g.items.some((i: MenuItem) => i.id === (dialogState.item as MenuItem).id)
      )
      if (groupIndex !== -1) {
        const itemIndex = updatedNavData.groups[groupIndex].items.findIndex((i: MenuItem) => i.id === (dialogState.item as MenuItem).id)
        if (itemIndex !== -1) {
          updatedNavData.groups[groupIndex].items[itemIndex] = item
        }
      }
    } else if (dialogState?.type === 'group') {
      const groupIndex = updatedNavData.groups.findIndex((g: NavMainGroup) => g.label.id === (dialogState.item as GroupLabel).id)
      if (groupIndex !== -1) {
        updatedNavData.groups[groupIndex].items.push(item)
      }
    }
    updateNavData(updatedNavData)
    closeDialog()
  }

  const handleDeleteMenuItem = (groupId: string, itemId: string) => {
    const updatedNavData: NavMainData = {
      ...navData,
      groups: navData.groups.map((group: NavMainGroup) => 
        group.label.id === groupId 
          ? { ...group, items: group.items.filter((item: MenuItem) => item.id !== itemId) }
          : group
      )
    }
    updateNavData(updatedNavData)
  }

  const handleSaveSubMenuItem = (item: SubMenuItem) => {
    const updatedNavData: NavMainData = { ...navData }
    if (dialogState?.type === 'subMenuItem' && dialogState.item) {
      const parentId = (dialogState.item as SubMenuItem).parentId
      if (parentId) {
        for (const group of updatedNavData.groups) {
          const parentItem = group.items.find((i: MenuItem) => i.id === parentId)
          if (parentItem && parentItem.items) {
            const subItems = parentItem.items.filter(isSubMenuItem)
            const itemIndex = subItems.findIndex((si: SubMenuItem) => si.id === item.id)
            if (itemIndex !== -1) {
              // Update existing item while preserving the array type
              parentItem.items = [
                ...parentItem.items.slice(0, itemIndex),
                item,
                ...parentItem.items.slice(itemIndex + 1)
              ]
            } else {
              parentItem.items.push(item)
            }
            break
          }
        }
      }
    }
    updateNavData(updatedNavData)
    closeDialog()
  }

  const handleDeleteSubMenuItem = (groupId: string, parentId: string, subItemId: string) => {
    const updatedNavData: NavMainData = {
      ...navData,
      groups: navData.groups.map((group: NavMainGroup) => 
        group.label.id === groupId
          ? {
              ...group,
              items: group.items.map((item: MenuItem) => 
                item.id === parentId
                  ? { 
                      ...item, 
                      items: item.items?.filter((menuItem: MenuItem) => {
                        if (isSubMenuItem(menuItem)) {
                          return menuItem.id !== subItemId;
                        }
                        return true;
                      })
                    }
                  : item
              )
            }
          : group
      )
    }
    updateNavData(updatedNavData)
  }

  const handleEditLabel = (label: GroupLabel) => {
    const updatedNavData: NavMainData = {
      ...navData,
      groups: navData.groups.map((g: NavMainGroup) => 
        g.label.id === label.id ? { ...g, label } : g
      )
    }
    updateNavData(updatedNavData)
  }

  const handleDeleteLabel = (id: string) => {
    const updatedNavData: NavMainData = {
      ...navData,
      groups: navData.groups.filter((g: NavMainGroup) => g.label.id !== id)
    }
    updateNavData(updatedNavData)
  }

  const handleEditItem = (item: MenuItem) => {
    const updatedNavData: NavMainData = {
      ...navData,
      groups: navData.groups.map((g: NavMainGroup) => ({
        ...g,
        items: g.items.map((i: MenuItem) => i.id === item.id ? item : i)
      }))
    }
    updateNavData(updatedNavData)
  }

  const handleDeleteItem = (itemId: string) => {
    const updatedNavData: NavMainData = {
      ...navData,
      groups: navData.groups.map((g: NavMainGroup) => ({
        ...g,
        items: g.items.filter((i: MenuItem) => i.id !== itemId)
      }))
    }
    updateNavData(updatedNavData)
  }

  return (
    <>
      {navData.groups.map((group: NavMainGroup) => (
        <SidebarGroupComponent
          key={group.label.id}
          group={group}
          onEditLabel={handleEditLabel}
          onDeleteLabel={handleDeleteLabel}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
        />
      ))}
    </>
  )
}
