"use client"

import React from 'react'
import { useMenu } from '@/slices/sidebar/menu/nav-main/context/MenuContextStore'
import * as hooks from './hooks'
import { SidebarGroupComponent } from './components/groups/MenuGroup'
import { GroupLabel, MenuItem, SubMenuItem, MenuGroup, NavMainGroup, NavMainData } from '@/slices/sidebar/menu/types/'
import { DialogType } from './hooks/dialogs/use-nav-main-dialog'

// Type guard to check if a MenuItem is a SubMenuItem
function isSubMenuItem(item: MenuItem | SubMenuItem): item is SubMenuItem {
  return 'parentId' in item && !('groupId' in item);
}

export function NavMain() {
  const { navData: contextNavData, updateNavData, currentDashboardId, menuItems } = useMenu()
  const {
    isOpen,
    dialogType,
    dialogState,
    openDialog,
    closeDialog
  } = hooks.useNavMainDialog()
  const [mounted, setMounted] = React.useState(false)

  // Cast the navData to our more specific type
  const navData = (contextNavData || { groups: [] }) as NavMainData

  // Handle edit operations - define all hooks before any conditionals
  const handleEditItem = React.useCallback((item: MenuItem) => {
    console.log('[NavMain] Edit item:', item)
    openDialog('menuItem' as DialogType, item)
  }, [openDialog])

  // Handle delete operations
  const handleDeleteItem = React.useCallback((itemId: string) => {
    console.log('[NavMain] Delete item:', itemId)
    // Create a minimal item object with just the ID
    openDialog('menuItem' as DialogType, { id: itemId } as MenuItem)
  }, [openDialog])

  React.useEffect(() => {
    setMounted(true)
    
    // Add debug logging
    console.log('[NavMain] Component mounted', {
      contextNavData,
      currentDashboardId,
      menuItemsCount: menuItems.length
    })
    
    // If there's no data or empty groups, log a warning
    if (!contextNavData || !contextNavData.groups || (contextNavData.groups && contextNavData.groups.length === 0)) {
      console.warn('[NavMain] No navigation data available', { currentDashboardId })
    }
  }, [contextNavData, currentDashboardId, menuItems])

  // Listen for dashboard changes
  React.useEffect(() => {
    if (currentDashboardId) {
      console.log('[NavMain] Dashboard ID changed:', currentDashboardId);
      
      // Force refresh nav data if needed
      if (contextNavData?.dashboardId !== currentDashboardId) {
        console.log('[NavMain] Dashboard ID mismatch, forcing refresh', {
          contextDataId: contextNavData?.dashboardId,
          currentId: currentDashboardId
        });
      }
    }
  }, [currentDashboardId, contextNavData]);

  // Debug placeholder to make missing content visible
  if (!mounted || !navData.groups || (navData.groups && navData.groups.length === 0)) {
    console.log('[NavMain] Rendering placeholder - No navigation data', { 
      mounted, 
      hasNavData: !!navData,
      groupsCount: navData?.groups?.length || 0
    })
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-md">
        <p className="text-sm font-medium text-yellow-800">Debug: NavMain Placeholder</p>
        <p className="text-xs text-yellow-700 mt-1">Dashboard ID: {currentDashboardId || 'None'}</p>
        <p className="text-xs text-yellow-700">Menu Items: {menuItems.length}</p>
        <p className="text-xs text-yellow-700">Nav Groups: {navData?.groups?.length || 0}</p>
      </div>
    )
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
      items: group.items || [],
      name: group.name,
      icon: group.icon
    }))
    .filter(group => group.items && group.items.length > 0)

  return (
    <div>
      {sidebarGroups.length > 0 ? (
        sidebarGroups.map(group => (
          <SidebarGroupComponent
            key={group.id}
            group={group}
            onEditItem={handleEditItem}
            onDeleteItem={handleDeleteItem}
          />
        ))
      ) : (
        <div className="p-4 border border-gray-200 rounded-md">
          <p className="text-sm text-gray-500">No menu groups available</p>
        </div>
      )}
    </div>
  )
}
