"use client"

import React from 'react'
import { useMenu } from '@/slices/sidebar/menu/nav-main/context/MenuContextStore'
import { useToast } from "shared/components/ui/use-toast"
import { useAvailableMenuItems } from './hooks'
import { AvailableMenuItems } from './components/AvailableMenuItems'
import { UserMenuItems } from './components/UserMenuItems'
import { CustomMenuItemForm } from './components/CustomMenuItemForm'
import { MenuItem, GroupLabel, SubMenuItem, NavMainData } from '@/slices/sidebar/menu/types/'
import { getIconByName } from '@/shared/icon-picker/utils'
import { Alert, AlertDescription } from "shared/components/ui/alert"
import { MenuItemWithIcon as SharedMenuItemWithIcon } from '@/shared/icon-picker/types';

// Define our extended version with additional properties needed for local use
interface MenuItemWithIcon extends SharedMenuItemWithIcon {
  name: string;  // Our local code needs name in addition to title
}

// Function to adapt shared MenuItemWithIcon to our local version
const adaptSharedToLocal = (item: SharedMenuItemWithIcon): MenuItemWithIcon => {
  return {
    ...item,
    name: item.title || 'Menu Item' // Use title as name if available
  };
};

export default function MenuStorePage() {
  const { menuItems, navData, updateNavData } = useMenu()
  const { toast } = useToast()
  const availableMenuItems = useAvailableMenuItems()

  const handleAddMenuItem = (item: MenuItemWithIcon) => {
    try {
      const existingItem = menuItems.find(menuItem => menuItem.name === item.name)
      if (existingItem) {
        throw new Error(`${item.name} is already in your menu.`);
      }
      
      // Convert the icon string to a Lucide component
      const IconComponent = getIconByName(item.icon)
      
      // Add the item with the default group and converted icon
      const newMenuItem: MenuItem = {
        id: item.id || crypto.randomUUID(),
        name: item.name,
        icon: item.icon,
        groupId: 'main',
        url: {
          path: '/',
          href: '/',
          label: item.name
        }
      };
      
      // We'll need to manually update menuItems since we removed addMenuItem
      if (navData && navData.groups && navData.groups.length > 0) {
        // Create a properly typed MenuItem
        const updatedMenuItem: MenuItem = {
          id: newMenuItem.id,
          name: newMenuItem.name,
          icon: newMenuItem.icon,
          groupId: navData.groups[0].label.id, // Use the first group's ID
          url: {
            path: '/',
            href: '/',
            label: newMenuItem.name
          }
        };
        
        // Create a deep copy of navData to avoid mutation
        const updatedNavData: NavMainData = {
          ...navData,
          groups: [...navData.groups]
        };
        
        // Add the new item to the first group
        if (updatedNavData.groups.length > 0) {
          updatedNavData.groups[0].items = [
            ...updatedNavData.groups[0].items,
            updatedMenuItem
          ];
          
          updateNavData(updatedNavData);
          
          toast({
            title: "Success",
            description: `${item.name} added to your menu.`
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add menu item.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMenuItem = (itemId: string) => {
    try {
      if (!navData) return;
      
      // We'll need to manually update menuItems since we removed deleteMenuItem
      const updatedItems = menuItems.filter(item => item.id !== itemId);
      const updatedNavData = {
        ...navData,
        items: updatedItems
      };
      updateNavData(updatedNavData as NavMainData);
      
      toast({
        title: "Success",
        description: "Menu item removed successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove menu item.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    try {
      if (!navData) return;
      
      // We'll need to manually update menuItems since we removed updateMenuItem
      const updatedItems = menuItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      );
      
      const updatedNavData = {
        ...navData,
        items: updatedItems
      };
      updateNavData(updatedNavData as NavMainData);
      
      toast({
        title: "Success",
        description: `${updatedItem.name} updated successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update menu item.",
        variant: "destructive"
      });
    }
  };

  if (!availableMenuItems || availableMenuItems.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <Alert>
          <AlertDescription>
            Loading available menu items...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Type adapter function to convert between incompatible MenuItemWithIcon types
  const adaptMenuItems = (items: MenuItem[]): MenuItemWithIcon[] => {
    if (!items) return [];
    
    return items.map(item => ({
      id: item.id || `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: item.name, // Use name as title for shared components
      name: item.name,  // Keep name for our local code
      icon: item.icon || 'file',
      url: { href: item.url?.href || '/' } // Ensure URL has href
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Available Menu Items</h2>
          <AvailableMenuItems 
            items={adaptMenuItems(availableMenuItems)} 
            onAddItem={(item) => handleAddMenuItem(adaptSharedToLocal(item))} 
          />
          
          <h2 className="text-2xl font-bold mt-8">Add Custom Menu Item</h2>
          <CustomMenuItemForm onAddItem={(item) => handleAddMenuItem(adaptSharedToLocal(item))} />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold">Your Menu Items</h2>
          <UserMenuItems 
            onRemoveItem={handleDeleteMenuItem}
            onEditItem={handleUpdateMenuItem}
            onAddLabel={(label) => console.log('Add label', label)}
            onAddSubMenuItem={(parentId, subItem) => console.log('Add submenu', parentId, subItem)}
          />
        </div>
      </div>
    </div>
  );
}
