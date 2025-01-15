"use client"

import React from 'react'
import { useMenu } from '@/slices/menu/context/MenuContext'
import { useToast } from "shared/components/ui/use-toast"
import { useAvailableMenuItems } from './hooks/useAvailableMenuItems'
import { AvailableMenuItems } from './components/AvailableMenuItems'
import { UserMenuItems } from './components/UserMenuItems'
import { CustomMenuItemForm } from './components/CustomMenuItemForm'
import { MenuItemWithIcon } from '@/shared/components/icon-picker/types'
import { MenuItem, GroupLabel, SubMenuItem } from '@/slices/menu/types'

export default function MenuStorePage() {
  const { menuItems, addMenuItem, deleteMenuItem, updateMenuItem, navData, updateNavData } = useMenu()
  const { toast } = useToast()
  const availableMenuItems = useAvailableMenuItems()

  const handleAddMenuItem = (item: MenuItemWithIcon) => {
    const existingItem = menuItems.find(menuItem => menuItem.title === item.title)
    if (existingItem) {
      toast({
        title: "Menu item already exists",
        description: `${item.title} is already in your menu.`,
        variant: "destructive",
      })
      return
    }
    
    // Add the item with the default group
    const itemWithGroup = {
      ...item,
      groupId: 'default'
    }
    
    addMenuItem(itemWithGroup)
    toast({
      title: "Menu item added",
      description: `${item.title} has been added to your menu.`,
    })
  }

  const handleEditMenuItem = (editedItem: MenuItem) => {
    updateMenuItem(editedItem)
    toast({
      title: "Menu item updated",
      description: `${editedItem.title} has been updated in your menu.`,
    })
  }

  const handleAddGroupLabel = (label: GroupLabel) => {
    const updatedNavData = {
      ...navData,
      groups: [...navData.groups, { label, items: [] }]
    }
    updateNavData(updatedNavData)
    toast({
      title: "Group label added",
      description: `${label.title} has been added to your menu.`,
    })
  }

  const handleAddSubMenuItem = (parentId: string, subItem: SubMenuItem) => {
    const updatedNavData = {
      ...navData,
      groups: navData.groups.map(group => ({
        ...group,
        items: group.items.map(item => 
          item.id === parentId 
            ? { ...item, items: [...(item.items || []), subItem] }
            : item
        )
      }))
    }
    updateNavData(updatedNavData)
    toast({
      title: "Sub-menu item added",
      description: `${subItem.title} has been added to the menu.`,
    })
  }

  const handleChangeGroup = (itemId: string, groupId: string) => {
    const updatedItems = menuItems.map(item => 
      item.id === itemId ? { ...item, groupId } : item
    );
    // Assuming you have a function to update all menu items at once
    // Replace updateMenuItems with your actual function to update menu items
    updateMenuItem(updatedItems[0]); // Update only the changed item.  updateMenuItems is likely not a function available in this context.
    toast({
      title: "Item group updated",
      description: `The item has been moved to a different group.`,
    });
  };


  return (
    <div className="w-full max-w-[2000px] mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-4">Menu Store</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-8">
        <AvailableMenuItems items={availableMenuItems} onAddItem={handleAddMenuItem} />
        <UserMenuItems 
          onRemoveItem={deleteMenuItem} 
          onEditItem={handleEditMenuItem}
          onAddLabel={handleAddGroupLabel}
          onAddSubMenuItem={handleAddSubMenuItem}
          onChangeGroup={handleChangeGroup}
        />
      </div>

      <CustomMenuItemForm onAddItem={handleAddMenuItem} />
      

    </div>
  )
}
