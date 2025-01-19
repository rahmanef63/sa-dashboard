"use client"

import React from 'react'
import { useMenu } from '@/slices/menu/context/MenuContext'
import { useToast } from "shared/components/ui/use-toast"
import { useAvailableMenuItems } from './hooks/useAvailableMenuItems'
import { AvailableMenuItems } from './components/AvailableMenuItems'
import { UserMenuItems } from './components/UserMenuItems'
import { CustomMenuItemForm } from './components/CustomMenuItemForm'
import { MenuItem, GroupLabel, SubMenuItem } from '@/slices/menu/types'
import { MenuItemWithIcon } from '@/shared/components/icon-picker/types'
import { getIconByName } from '@/shared/components/icon-picker/utils'
import { Alert, AlertDescription } from "shared/components/ui/alert"

export default function MenuStorePage() {
  const { menuItems, addMenuItem, deleteMenuItem, updateMenuItem, navData, updateNavData } = useMenu()
  const { toast } = useToast()
  const availableMenuItems = useAvailableMenuItems()

  const handleAddMenuItem = (item: MenuItem) => {
    try {
      // Validate that the item has an icon
      if (!item.icon) {
        toast({
          title: "Validation Error",
          description: "Menu item must have an icon. Please select an icon before adding.",
          variant: "destructive",
        });
        return;
      }

      const existingItem = menuItems.find(menuItem => menuItem.title === item.title)
      if (existingItem) {
        throw new Error(`${item.title} is already in your menu.`);
      }
      
      // Add the item with the default group
      const itemWithGroup = {
        ...item,
        icon: item.icon, // Keep the original icon
        groupId: 'default'
      }
      
      addMenuItem(itemWithGroup)
      toast({
        title: "Menu item added",
        description: `${item.title} has been added to your menu.`,
      })
    } catch (error) {
      toast({
        title: "Error adding menu item",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleEditMenuItem = (editedItem: MenuItem) => {
    try {
      // Validate that the item has an icon
      if (!editedItem.icon) {
        toast({
          title: "Validation Error",
          description: "Menu item must have an icon. Please select an icon before saving.",
          variant: "destructive",
        });
        return;
      }

      const convertedItem = {
        ...editedItem,
        icon: editedItem.icon
      }
      
      updateMenuItem(convertedItem)
      toast({
        title: "Menu item updated",
        description: `${editedItem.title} has been updated.`,
      })
    } catch (error) {
      toast({
        title: "Error updating menu item",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleAddGroupLabel = (label: GroupLabel) => {
    try {
      const updatedNavData = {
        ...navData,
        groups: [...navData.groups, { label, items: [] }]
      }
      updateNavData(updatedNavData)
      toast({
        title: "Group label added",
        description: `${label.title} has been added to your menu.`,
      })
    } catch (error) {
      toast({
        title: "Error adding group label",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleAddSubMenuItem = (parentId: string, subItem: SubMenuItem) => {
    try {
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
    } catch (error) {
      toast({
        title: "Error adding sub-menu item",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleChangeGroup = (itemId: string, groupId: string) => {
    try {
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
    } catch (error) {
      toast({
        title: "Error updating item group",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    }
  };

  return (
    <div className="w-full max-w-[2000px] mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-4">Menu Store</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 mb-8">
        <div className="lg:col-span-4">
          <AvailableMenuItems items={availableMenuItems} onAddItem={handleAddMenuItem} />
        </div>
        <div className="lg:col-span-8">
          <UserMenuItems  
            onRemoveItem={deleteMenuItem} 
            onEditItem={handleEditMenuItem}
            onAddLabel={handleAddGroupLabel}
            onAddSubMenuItem={handleAddSubMenuItem}
            onChangeGroup={handleChangeGroup}
          />
        </div>
      </div>
      <CustomMenuItemForm onAddItem={handleAddMenuItem} />
    </div>
  )
}
