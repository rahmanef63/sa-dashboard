"use client"

import React from 'react'
import { useMenu } from '../context/MenuContext'
import { useNavMainDialog } from './hooks/useNavMainDialog'
import { SidebarGroupComponent } from './components/groups/MenuGroup'
import { GroupLabel, MenuItem, SubMenuItem, NavMainData } from './types'


export function NavMain() {
  const { navData: contextNavData, updateNavData } = useMenu()
  const {
    dialogState,
    openDialog,
    closeDialog
  } = useNavMainDialog()
  const [mounted, setMounted] = React.useState(false)

  // Cast the navData to our more specific type
  const navData = contextNavData as unknown as NavMainData

  React.useLayoutEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null; // Return null on server-side and first client render
  }

  if (!navData || navData.groups.length === 0) {
    return null;
  }

  const handleSaveGroupLabel = (label: GroupLabel) => {
    const updatedNavData = { ...navData }
    if (dialogState.type === 'group' && dialogState.item) {
      const groupIndex = updatedNavData.groups.findIndex(g => g.label.id === label.id)
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
    if (dialogState.type === 'menuItem' && dialogState.item) {
      updatedNavData.groups = updatedNavData.groups.map(group => ({
        ...group,
        items: group.items.map(i => i.id === item.id ? item : i)
      }))
    } else {
      const lastGroup = updatedNavData.groups[updatedNavData.groups.length - 1]
      lastGroup.items.push(item)
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

  const handleSaveSubMenuItem = (groupId: string, parentId: string, subItem: SubMenuItem) => {
    const updatedNavData = { ...navData }
    updatedNavData.groups = updatedNavData.groups.map(group => 
      group.label.id === groupId
        ? {
            ...group,
            items: group.items.map(item => {
              if (item.id === parentId) {
                return {
                  ...item,
                  items: dialogState.type === 'subMenuItem' && dialogState.item
                    ? (item.items || []).map(si => si.id === subItem.id ? subItem : si)
                    : [...(item.items || []), subItem]
                }
              }
              return item
            })
          }
        : group
    )
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
