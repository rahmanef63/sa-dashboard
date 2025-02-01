"use client"

import React from 'react'
import { useMenu } from '../context/MenuContextStore'
import * as hooks from './hooks'
import { SidebarGroupComponent } from './components/groups/MenuGroup'
import { GroupLabel, MenuItem, SubMenuItem, NavMainData } from 'shared/types/navigation-types'


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
  const navData = contextNavData as unknown as NavMainData

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
    const updatedNavData = { ...navData }
    if (dialogState?.type === 'group' && dialogState.item) {
      const groupIndex = updatedNavData.groups.findIndex(g => g.label.id === (dialogState.item as GroupLabel).id)
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
    const updatedNavData = {
      ...navData,
      groups: navData.groups.filter(g => g.label.id !== id)
    }
    updateNavData(updatedNavData)
  }

  const handleSaveMenuItem = (item: MenuItem) => {
    const updatedNavData = { ...navData }
    if (dialogState?.type === 'menuItem' && dialogState.item) {
      const groupIndex = updatedNavData.groups.findIndex(g => g.items.some(i => i.id === (dialogState.item as MenuItem).id))
      if (groupIndex !== -1) {
        const itemIndex = updatedNavData.groups[groupIndex].items.findIndex(i => i.id === (dialogState.item as MenuItem).id)
        if (itemIndex !== -1) {
          updatedNavData.groups[groupIndex].items[itemIndex] = item
        }
      }
    } else if (dialogState?.type === 'group') {
      const groupIndex = updatedNavData.groups.findIndex(g => g.label.id === (dialogState.item as GroupLabel).id)
      if (groupIndex !== -1) {
        updatedNavData.groups[groupIndex].items.push(item)
      }
    }
    updateNavData(updatedNavData)
    closeDialog()
  }

  const handleDeleteMenuItem = (groupId: string, itemId: string) => {
    const updatedNavData = {
      ...navData,
      groups: navData.groups.map(group => 
        group.label.id === groupId 
          ? { ...group, items: group.items.filter(item => item.id !== itemId) }
          : group
      )
    }
    updateNavData(updatedNavData)
  }

  const handleSaveSubMenuItem = (item: SubMenuItem) => {
    const updatedNavData = { ...navData }
    if (dialogState?.type === 'subMenuItem' && dialogState.item) {
      const parentId = (dialogState.item as SubMenuItem).parentId
      if (parentId) {
        for (const group of updatedNavData.groups) {
          const parentItem = group.items.find(i => i.id === parentId)
          if (parentItem && parentItem.items) {
            const itemIndex = parentItem.items.findIndex(i => i.id === item.id)
            if (itemIndex !== -1) {
              parentItem.items[itemIndex] = item
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
    const updatedNavData = {
      ...navData,
      groups: navData.groups.map(group => 
        group.label.id === groupId
          ? {
              ...group,
              items: group.items.map(item => 
                item.id === parentId
                  ? { ...item, items: item.items?.filter(si => si.id !== subItemId) }
                  : item
              )
            }
          : group
      )
    }
    updateNavData(updatedNavData)
  }

  const handleEditLabel = (label: GroupLabel) => {
    const updatedNavData = {
      ...navData,
      groups: navData.groups.map(g => 
        g.label.id === label.id ? { ...g, label } : g
      )
    }
    updateNavData(updatedNavData)
  }

  const handleDeleteLabel = (id: string) => {
    const updatedNavData = {
      ...navData,
      groups: navData.groups.filter(g => g.label.id !== id)
    }
    updateNavData(updatedNavData)
  }

  const handleEditItem = (item: MenuItem) => {
    const updatedNavData = {
      ...navData,
      groups: navData.groups.map(g => ({
        ...g,
        items: g.items.map(i => i.id === item.id ? item : i)
      }))
    }
    updateNavData(updatedNavData)
  }

  const handleDeleteItem = (itemId: string) => {
    const updatedNavData = {
      ...navData,
      groups: navData.groups.map(g => ({
        ...g,
        items: g.items.filter(i => i.id !== itemId)
      }))
    }
    updateNavData(updatedNavData)
  }

  return (
    <>
      {navData.groups.map((group) => (
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
