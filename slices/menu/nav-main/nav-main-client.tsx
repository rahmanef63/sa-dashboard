"use client"

import React from 'react'
import { useMenu } from '../context/MenuContext'
import { useNavMainDialog } from './hooks/useNavMainDialog'
import { SidebarGroupComponent } from './components/groups/MenuGroup'
import { GroupLabel, MenuItem, SubMenuItem, NavMainData } from 'shared/types/navigation-types'

export function NavMainClient() {
  const { navData: contextNavData, updateNavData } = useMenu()
  const {
    dialogState,
    openDialog,
    closeDialog
  } = useNavMainDialog()

  // Cast the navData to our more specific type
  const navData = contextNavData as unknown as NavMainData

  if (!navData || navData.groups.length === 0) {
    return null;
  }

  const handleEditLabel = (label: GroupLabel) => {
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

  const handleDeleteLabel = (id: string) => {
    const updatedNavData = {
      ...navData,
      groups: navData.groups.filter(g => g.label.id !== id)
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
        />
      ))}
    </>
  )
}
