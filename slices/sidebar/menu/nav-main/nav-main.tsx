"use client"

import React from 'react'
import { useMenu } from '../types/MenuContextStore'
import * as hooks from './hooks'
import { SidebarGroupComponent } from './components/groups/MenuGroup'
import { GroupLabel, MenuItem, SubMenuItem, MenuGroup, NavMainGroup, NavMainData } from '@/slices/sidebar/menu/types/'

// Type guard to check if a MenuItem is a SubMenuItem
function isSubMenuItem(item: MenuItem | SubMenuItem): item is SubMenuItem {
  return 'parentId' in item && !('groupId' in item);
}

export function NavMain() {
  const { navData: contextNavData, updateNavData } = useMenu()
  const {
    isOpen,
    dialogType,
    dialogState,
    openDialog,
    closeDialog,
    DialogComponent
  } = hooks.useNavMainDialog()
  const [mounted, setMounted] = React.useState(false)

  // Cast the navData to our more specific type
  const navData = (contextNavData || { groups: [] }) as NavMainData

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Filter and transform groups for the sidebar
  const sidebarGroups = navData.groups
    .map((group: MenuGroup): NavMainGroup => ({
      id: group.id,
      label: {
        id: group.id,
        name: group.name,
        icon: group.icon
      },
      items: group.items || []
    }))
    .filter(group => group.items && group.items.length > 0)

  return (
    <div className="nav-main">
      {sidebarGroups.map((group) => (
        <SidebarGroupComponent
          key={group.id}
          group={group}
          onOpenDialog={openDialog}
        />
      ))}
      {isOpen && dialogType && DialogComponent && (
        <DialogComponent
          type={dialogType}
          state={dialogState}
          onClose={closeDialog}
          onSave={(data: NavMainData) => {
            updateNavData(data)
            closeDialog()
          }}
        />
      )}
    </div>
  )
}
