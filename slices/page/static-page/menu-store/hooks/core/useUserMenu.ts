import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useMenu } from '@/slices/sidebar/menu/nav-main/hooks';
import { 
  MenuItem, 
  GroupLabel, 
  SubMenuItem, 
  NavUrl, 
  NavMainData, 
  NavMainGroup, 
  BaseMenuItem 
} from '@/slices/sidebar/menu/types/';

import {
  convertSharedToNavMain,
  convertNavMainToShared,
  convertNavMainSubToShared,
  convertSharedSubToNavMain
} from '../../utils/converters';

import {
  validateMenuItem,
  validateGroupLabel,
  validateSubMenuItem,
} from '../../utils/validation';

// Forward declare some types that may be used in the hook
export interface MenuItemWithStringTarget {
  id: string;
  name: string;
  title?: string;
  icon?: string;
  url: {
    href: string;
    target?: string;
  };
}

export function useUserMenu() {
  const context = useMenu();
  if (!context) {
    throw new Error('useUserMenu must be used within a MenuProvider');
  }

  const {
    navData, 
    updateNavData
  } = context;

  const timeStampRef = useRef<{ [key: string]: number }>({});

  const handleEditItem = useCallback((item: MenuItem, onEditItem: (item: MenuItem) => void) => {
    try {
      const itemWithUrl: MenuItem = {
        ...item,
        url: item.url || { href: '', path: '' } as NavUrl
      };
      
      if (!validateMenuItem(itemWithUrl)) return;
      const navMainItem = convertSharedToNavMain(itemWithUrl);
      
      // Create a NavMainData structure to pass to updateNavData
      if (navData) {
        const updatedNavData = { ...navData };
        
        // Find the group this item belongs to
        if (updatedNavData.groups) {
          const groupIndex = updatedNavData.groups.findIndex((g: NavMainGroup) => 
            g.items.some((i: MenuItem) => i.id === item.id)
          );
          
          if (groupIndex !== -1) {
            const itemIndex = updatedNavData.groups[groupIndex].items.findIndex(i => i.id === item.id);
            if (itemIndex !== -1) {
              updatedNavData.groups[groupIndex].items[itemIndex] = navMainItem;
              updateNavData(updatedNavData);
              onEditItem(navMainItem);
              return;
            }
          }
        }
      }
      
      // If we didn't find and update the item in the existing data
      toast.error("Could not find item to update");
    } catch (error) {
      console.error("Error updating menu item:", error);
      throw error;
    }
  }, [navData, updateNavData]);

  const handleDeleteItem = useCallback((itemId: string, groupId: string, onRemoveItem: (id: string) => void) => {
    try {
      if (!navData) {
        toast.error("Navigation data not available");
        return;
      }

      const updatedNavData = { ...navData } as NavMainData;
      
      if (!updatedNavData.groups) {
        updatedNavData.groups = [];
      }
      
      const groupIndex = updatedNavData.groups.findIndex((g: NavMainGroup) => g.label.id === groupId);
      
      if (groupIndex === -1) {
        toast.error("Group not found");
        return;
      }

      const itemExists = updatedNavData.groups[groupIndex].items.some((item: MenuItem) => item.id === itemId);
      if (!itemExists) {
        toast.error("Menu item not found");
        return;
      }

      updatedNavData.groups[groupIndex].items = updatedNavData.groups[groupIndex].items.filter(
        (item: MenuItem) => item.id !== itemId
      );
      updateNavData(updatedNavData);
      onRemoveItem(itemId);
      delete timeStampRef.current[`${groupId}-${itemId}`];
      toast.success("Menu item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete menu item");
      console.error("Error deleting menu item:", error);
    }
  }, [navData, updateNavData]);

  const handleSaveLabel = useCallback((label: GroupLabel, isEdit: boolean, selectedLabelId: string | null) => {
    try {
      // Safely check if navData and groups exist
      if (!navData?.groups) {
        toast.error("Navigation data is not available");
        return;
      }

      if (!validateGroupLabel(label, navData.groups)) return;
      
      // Create a proper NavMainData structure
      const updatedNavData: NavMainData = { 
        ...navData, 
        groups: [...navData.groups] 
      };
      
      if (isEdit && selectedLabelId) {
        // Find the group with the selected label ID
        const groupIndex = updatedNavData.groups.findIndex(g => g.label.id === selectedLabelId);
        if (groupIndex !== -1) {
          // Update the group label
          updatedNavData.groups[groupIndex].label = label;
          updateNavData(updatedNavData);
          toast.success("Label updated successfully");
        } else {
          toast.error("Could not find group to update");
        }
      } else {
        // Add a new group with the label and a unique ID
        const newGroup: NavMainGroup = {
          label,
          items: [],
          id: `group-${Date.now()}`,
          name: label.name
        };
        updatedNavData.groups.push(newGroup);
        updateNavData(updatedNavData);
        toast.success("Label added successfully");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save label");
      console.error("Error saving label:", error);
    }
  }, [updateNavData, navData]);

  const handleSaveMenuItem = useCallback((editedItem: MenuItem) => {
    try {
      if (!navData || !navData.groups) {
        toast.error("Navigation data is not available");
        return;
      }
      
      const itemWithUrl: MenuItem = {
        ...editedItem,
        url: editedItem.url || { href: '', path: '' } as NavUrl
      };
      
      if (!validateMenuItem(itemWithUrl)) return;
      
      const updatedNavData: NavMainData = { 
        ...navData,
        groups: [...navData.groups]
      };
      
      // Find the group that contains this item
      const groupIndex = updatedNavData.groups.findIndex((g: NavMainGroup) => {
        // Check if the item exists in this group
        return g.items.some(item => item.id === editedItem.id);
      });
      
      if (groupIndex === -1) {
        toast.error("Group not found");
        return;
      }

      const itemIndex = updatedNavData.groups[groupIndex].items.findIndex((item: MenuItem) => item.id === editedItem.id);
      if (itemIndex !== -1) {
        updatedNavData.groups[groupIndex].items[itemIndex] = {
          ...itemWithUrl,
          groupId: updatedNavData.groups[groupIndex].label.id
        };
      } else {
        updatedNavData.groups[groupIndex].items.push({
          ...itemWithUrl,
          groupId: updatedNavData.groups[groupIndex].label.id
        });
      }
      updateNavData(updatedNavData);
      
      toast.success("Menu item saved successfully");
    } catch (error) {
      toast.error("Failed to save menu item");
      console.error("Error saving menu item:", error);
    }
  }, [navData, updateNavData]);

  const handleSaveSubMenuItem = useCallback((subItem: SubMenuItem, selectedItemId: string | null, onAddSubMenuItem: (parentId: string, subItem: SubMenuItem) => void) => {
    try {
      if (!selectedItemId) {
        toast.error("No parent item selected");
        return;
      }

      if (!navData) {
        toast.error("Navigation data is not available");
        return;
      }
      
      if (!validateSubMenuItem(subItem, selectedItemId)) return;
      
      onAddSubMenuItem(selectedItemId, subItem);
      toast.success("Sub-menu item added successfully");
    } catch (error) {
      toast.error("Failed to add sub-menu item");
      console.error("Error adding sub-menu item:", error);
    }
  }, [navData]);

  const handleChangeGroup = useCallback((groupId: string) => {
    try {
      if (!navData || !navData.groups) {
        toast.error("Navigation data is not available");
        return;
      }
      
      const updatedNavData: NavMainData = { 
        ...navData,
        groups: [...navData.groups].map((group: NavMainGroup) => ({
          ...group,
          items: group.items.map((item: MenuItem) => ({
            ...item,
            groupId: group.label.id
          }))
        }))
      };
      
      updateNavData(updatedNavData);
    } catch (error) {
      console.error("Error changing group:", error);
      toast.error("Failed to change group");
    }
  }, [navData, updateNavData]);

  const handleSaveToNavMain = useCallback(() => {
    try {
      if (!navData || !navData.groups) {
        toast.error("Navigation data is not available");
        return;
      }
      
      const updatedNavData: NavMainData = { 
        ...navData,
        groups: [...navData.groups].map((group: NavMainGroup) => ({
          ...group,
          items: group.items.map((item: MenuItem) => ({
            ...item,
            groupId: group.label.id
          }))
        }))
      };

      updateNavData(updatedNavData);
      toast.success("Changes saved successfully");
    } catch (error) {
      toast.error("Failed to save changes");
      console.error("Error saving changes:", error);
    }
  }, [navData, updateNavData]);

  const findMenuItem = useCallback((itemId: string): MenuItem | undefined => {
    if (!navData || !navData.groups) return undefined;
    
    const item = navData.groups.flatMap((g: NavMainGroup) => g.items).find((item: MenuItem) => item.id === itemId);
    return item ? convertNavMainToShared(item) : undefined;
  }, [navData]);

  const updateItemCollapsible = useCallback((itemId: string, isCollapsible: boolean) => {
    try {
      if (!navData || !navData.groups) {
        toast.error('Navigation data not available');
        return;
      }

      const updatedNavData: NavMainData = { 
        ...navData,
        groups: [...navData.groups]
      };
      
      const groupIndex = updatedNavData.groups.findIndex((g: NavMainGroup) => 
        g.items.some((item: MenuItem) => item.id === itemId)
      );
      
      if (groupIndex !== -1) {
        const itemIndex = updatedNavData.groups[groupIndex].items.findIndex((item: MenuItem) => item.id === itemId);
        if (itemIndex !== -1) {
          updatedNavData.groups[groupIndex].items[itemIndex].isCollapsible = isCollapsible;
          updateNavData(updatedNavData);
          toast.success('Item collapsible state updated');
        }
      } else {
        toast.error('Item not found');
      }
    } catch (error) {
      console.error('Error updating item collapsible state:', error);
      toast.error('Failed to update item');
    }
  }, [navData, updateNavData]);

  const addItem = useCallback((item: Partial<MenuItem>, onAddItem: Function) => {
    try {
      // Ensure item has an id and required fields
      const itemWithRequiredFields = {
        ...item,
        id: item.id || `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        groupId: item.groupId || 'default', // Ensure groupId is always present
        name: item.name || 'New Menu Item', // Ensure name is always present
        url: item.url || { href: '', path: '', label: item.name || 'Menu Item' } as NavUrl
      };

      if (!validateMenuItem(itemWithRequiredFields)) return;
      
      // Convert to NavMain format
      const navMainItem = convertSharedToNavMain(itemWithRequiredFields) as MenuItem;
      
      // Create or use existing NavMainData structure
      if (!navData) {
        // Create a new NavMainData if none exists
        const newNavData: NavMainData = {
          dashboardId: 'default',
          groups: [{
            id: itemWithRequiredFields.groupId || 'default',
            name: 'Default Group',
            icon: 'Settings',
            label: {
              id: itemWithRequiredFields.groupId || 'default',
              name: 'Default Group',
              icon: 'Settings'
            },
            items: [navMainItem]
          }],
          items: [navMainItem],
          subItems: []
        };
        updateNavData(newNavData);
        onAddItem(itemWithRequiredFields);
      } else {
        // Add to existing NavMainData
        const updatedNavData = { ...navData } as NavMainData;
        
        if (!updatedNavData.groups) {
          updatedNavData.groups = [];
        }
        
        // Check if group exists
        const groupIndex = updatedNavData.groups.findIndex(
          g => g.id === (itemWithRequiredFields.groupId || 'default')
        );
        
        if (groupIndex >= 0) {
          // Add to existing group
          updatedNavData.groups[groupIndex].items.push(navMainItem);
        } else {
          // Create new group
          updatedNavData.groups.push({
            id: itemWithRequiredFields.groupId || 'default',
            name: 'Default Group',
            icon: 'Settings',
            label: {
              id: itemWithRequiredFields.groupId || 'default',
              name: 'Default Group',
              icon: 'Settings'
            },
            items: [navMainItem]
          });
        }
        
        // Update items list
        if (!updatedNavData.items) {
          updatedNavData.items = [];
        }
        updatedNavData.items.push(navMainItem);
        
        updateNavData(updatedNavData);
        onAddItem(itemWithRequiredFields);
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
      toast.error("Failed to add menu item");
    }
  }, [navData, updateNavData]);

  const addGroupLabel = useCallback((label: GroupLabel) => {
    if (!navData) {
      toast.error('Navigation data not available');
      return false;
    }

    try {
      // Validate group label data
      if (!navData || !navData.groups) {
        if (!validateGroupLabel(label, [])) {
          toast.error('Invalid group label data');
          return false;
        }
      } else {
        if (!validateGroupLabel(label, navData.groups)) {
          toast.error('Invalid group label data');
          return false;
        }
      }

      const updatedNavData = { 
        ...navData, 
        dashboardId: navData.dashboardId,
        items: navData.items,
        subItems: navData.subItems,
        groups: [...(navData.groups || [])]
      };

      // Create a new group with the label
      const newGroup: NavMainGroup = {
        id: label.id,
        name: label.name,
        icon: label.icon,
        label: label,
        items: []
      };

      updatedNavData.groups.push(newGroup);
      
      // Update context with new data
      updateNavData(updatedNavData as NavMainData);
      toast.success(`Group "${label.name}" added successfully`);
      return true;
    } catch (error) {
      console.error('Error adding group label:', error);
      toast.error('Failed to add group');
      return false;
    }
  }, [navData, updateNavData]);

  const updateGroupLabel = useCallback((id: string, label: GroupLabel) => {
    if (!navData) {
      toast.error('Navigation data not available');
      return false;
    }

    try {
      // Validate updated group label
      if (!navData || !navData.groups) {
        if (!validateGroupLabel(label, [])) {
          toast.error('Invalid group label data');
          return false;
        }
      } else {
        if (!validateGroupLabel(label, navData.groups)) {
          toast.error('Invalid group label data');
          return false;
        }
      }

      const updatedNavData = { 
        ...navData,
        dashboardId: navData.dashboardId,
        items: navData.items,
        subItems: navData.subItems,
        groups: [...(navData.groups || [])]
      };

      // Find and update the target group
      const groupIndex = updatedNavData.groups.findIndex(g => g.id === id);
      
      if (groupIndex === -1) {
        toast.error(`Group with ID "${id}" not found`);
        return false;
      }

      // Update group properties
      updatedNavData.groups[groupIndex] = {
        ...updatedNavData.groups[groupIndex],
        name: label.name,
        icon: label.icon,
        label: label
      };

      // Update context with modified data
      updateNavData(updatedNavData as NavMainData);
      toast.success(`Group "${label.name}" updated successfully`);
      return true;
    } catch (error) {
      console.error('Error updating group label:', error);
      toast.error('Failed to update group');
      return false;
    }
  }, [navData, updateNavData]);

  const deleteGroupLabel = useCallback((id: string) => {
    if (!navData) {
      toast.error('Navigation data not available');
      return false;
    }

    try {
      const updatedNavData = { 
        ...navData,
        dashboardId: navData.dashboardId,
        items: navData.items,
        subItems: navData.subItems,
        groups: (navData.groups || []).filter(g => g.id !== id)
      };

      // Update context with filtered data
      updateNavData(updatedNavData as NavMainData);
      toast.success('Group deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting group label:', error);
      toast.error('Failed to delete group');
      return false;
    }
  }, [navData, updateNavData]);

  const updateMenuItem = useCallback((item: MenuItem) => {
    if (!navData) {
      toast.error('Navigation data not available');
      return false;
    }

    try {
      // Validate the updated menu item
      if (!validateMenuItem(item)) {
        toast.error('Invalid menu item data');
        return false;
      }

      const updatedNavData = { 
        ...navData,
        dashboardId: navData.dashboardId,
        items: navData.items.map(i => i.id === item.id ? item : i),
        subItems: navData.subItems,
        groups: [...(navData.groups || [])]
      };

      // Update the item in its group
      updatedNavData.groups.forEach(group => {
        const itemIndex = group.items.findIndex(i => i.id === item.id);
        if (itemIndex !== -1) {
          group.items[itemIndex] = item;
        }
      });

      // Update context with modified data
      updateNavData(updatedNavData as NavMainData);
      toast.success(`Menu item "${item.name}" updated successfully`);
      return true;
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast.error('Failed to update menu item');
      return false;
    }
  }, [navData, updateNavData]);

  const toggleCollapse = useCallback((itemId: string) => {
    try {
      if (!navData || !navData.groups) {
        toast.error("Navigation data is not available");
        return;
      }

      const updatedNavData: NavMainData = { ...navData, groups: [...navData.groups] };
      
      // Find the item
      for (const group of updatedNavData.groups) {
        const itemIndex = group.items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
          const item = group.items[itemIndex];
          // Toggle the isCollapsible state
          group.items[itemIndex] = {
            ...item,
            isCollapsible: !item.isCollapsible
          };
          updateNavData(updatedNavData);
          return;
        }
      }
      
      toast.error("Item not found");
    } catch (error) {
      console.error("Error toggling collapse:", error);
      toast.error("Failed to toggle item collapse state");
    }
  }, [navData, updateNavData]);

  useEffect(() => {
    if (!navData || !navData.groups) return;
    
    navData.groups.forEach((group: NavMainGroup) => {
      group.items.forEach((item: MenuItem) => {
        if (!timeStampRef.current[`${group.label.id}-${item.id}`]) {
          timeStampRef.current[`${group.label.id}-${item.id}`] = Date.now();
        }
      });
    });
  }, [navData]);

  return {
    navData,
    handleEditItem,
    handleDeleteItem,
    handleSaveLabel,
    handleSaveMenuItem,
    handleSaveSubMenuItem,
    handleChangeGroup,
    handleSaveToNavMain,
    findMenuItem,
    addGroupLabel,
    updateGroupLabel,
    deleteGroupLabel,
    updateItemCollapsible,
    updateMenuItem,
    addItem,
    toggleCollapse
  };
};
