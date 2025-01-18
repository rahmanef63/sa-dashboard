import { useCallback, useRef, useEffect } from 'react'
import { MenuItem, SubMenuItem, GroupLabel, NavUrl, NavGroup } from 'shared/types/navigation-types'
import { MenuItem as NavMainMenuItem, SubMenuItem as NavMainSubMenuItem, NavUrl as NavMainUrl } from '@/slices/menu/nav-main/types'
import { useMenu } from '@/slices/menu/context/MenuContext'
import { toast } from 'sonner'

// Helper function to convert shared MenuItem to NavMainMenuItem
const convertSharedToNavMain = (item: MenuItem): NavMainMenuItem => {
  const navMainItem: NavMainMenuItem = {
    id: item.id,
    title: item.title,
    icon: item.icon,
    url: item.url,
    isActive: item.isActive,
    groupId: item.groupId,
    order: item.order
  };

  if (item.items) {
    navMainItem.items = item.items.map(subItem => ({
      id: subItem.id,
      title: subItem.title,
      url: subItem.url,
      parentId: subItem.parentId,
      order: subItem.order
    }));
  }

  return navMainItem;
};

// Helper function to convert NavMainMenuItem to shared MenuItem
const convertNavMainToShared = (item: NavMainMenuItem): MenuItem => {
  const sharedItem: MenuItem = {
    id: item.id,
    title: item.title,
    icon: item.icon,
    url: item.url,
    isActive: item.isActive,
    groupId: item.groupId,
    order: item.order
  };

  if (item.items) {
    sharedItem.items = item.items.map(subItem => ({
      id: subItem.id,
      title: subItem.title,
      url: subItem.url,
      parentId: subItem.parentId,
      order: subItem.order
    }));
  }

  return sharedItem;
};

// Helper function to convert NavMainSubMenuItem to SubMenuItem
const convertNavMainSubToShared = (item: NavMainSubMenuItem): SubMenuItem => ({
  id: item.id,
  title: item.title,
  url: item.url,
  parentId: item.parentId,
  order: item.order
});

// Helper function to convert SubMenuItem to NavMainSubMenuItem
const convertSharedSubToNavMain = (item: SubMenuItem): NavMainSubMenuItem => ({
  id: item.id,
  title: item.title,
  url: item.url,
  parentId: item.parentId,
  order: item.order
});

// Basic validation functions
const validateMenuItem = (item: MenuItem): boolean => {
  return Boolean(item.id && item.title && item.url && item.icon);
};

const validateGroupLabel = (label: GroupLabel): boolean => {
  return Boolean(label.id && label.title);
};

const validateSubMenuItem = (item: SubMenuItem): boolean => {
  return Boolean(item.id && item.title && item.url);
};

export function useUserMenu() {
  const context = useMenu();
  if (!context) {
    throw new Error('useUserMenu must be used within a MenuProvider');
  }

  const {
    navData, 
    updateNavData, 
    handleChangeGroup: contextHandleChangeGroup,
    addGroupLabel: contextAddGroupLabel,
    updateGroupLabel: contextUpdateGroupLabel,
    deleteGroupLabel: contextDeleteGroupLabel,
    updateItemCollapsible: contextUpdateItemCollapsible
  } = context;

  const timeStampRef = useRef<{ [key: string]: number }>({});

  const handleEditItem = useCallback((item: MenuItem, onEditItem: (item: MenuItem) => void) => {
    try {
      if (!validateMenuItem(item)) return;
      const navMainItem = convertSharedToNavMain(item);
      onEditItem(navMainItem);
      toast.success("Menu item updated successfully");
    } catch (error) {
      toast.error("Failed to update menu item");
      console.error("Error updating menu item:", error);
    }
  }, []);

  const handleDeleteItem = useCallback((itemId: string, groupId: string, onRemoveItem: (id: string) => void) => {
    try {
      const updatedNavData = { ...navData };
      const groupIndex = updatedNavData.groups.findIndex(g => g.label.id === groupId);
      
      if (groupIndex === -1) {
        toast.error("Group not found");
        return;
      }

      const itemExists = updatedNavData.groups[groupIndex].items.some(item => item.id === itemId);
      if (!itemExists) {
        toast.error("Menu item not found");
        return;
      }

      updatedNavData.groups[groupIndex].items = updatedNavData.groups[groupIndex].items.filter(
        item => item.id !== itemId
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
      if (!validateGroupLabel(label)) return;
      
      if (isEdit && selectedLabelId) {
        contextUpdateGroupLabel(selectedLabelId, label);
        toast.success("Label updated successfully");
      } else {
        contextAddGroupLabel(label);
        toast.success("Label added successfully");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save label");
      console.error("Error saving label:", error);
    }
  }, [contextAddGroupLabel, contextUpdateGroupLabel, navData.groups]);

  const handleSaveMenuItem = useCallback((editedItem: MenuItem) => {
    try {
      if (!validateMenuItem(editedItem)) return;
      
      const updatedNavData = { ...navData };
      const groupIndex = updatedNavData.groups.findIndex(g => g.label.id === editedItem.groupId);
      
      if (groupIndex !== -1) {
        const itemIndex = updatedNavData.groups[groupIndex].items.findIndex(item => item.id === editedItem.id);
        if (itemIndex !== -1) {
          updatedNavData.groups[groupIndex].items[itemIndex] = editedItem;
        } else {
          updatedNavData.groups[groupIndex].items.push(editedItem);
        }
        updateNavData(updatedNavData);
      }
      
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

      const navGroups = navData.groups as NavGroup[];
      if (!validateSubMenuItem(subItem)) return;
      
      onAddSubMenuItem(selectedItemId, subItem);
      toast.success("Sub-menu item added successfully");
    } catch (error) {
      toast.error("Failed to add sub-menu item");
      console.error("Error adding sub-menu item:", error);
    }
  }, [navData.groups]);

  const handleGroupChange = useCallback((itemId: string, newGroupId: string) => {
    try {
      contextHandleChangeGroup(itemId, newGroupId);
      toast.success("Item moved to new group successfully");
    } catch (error) {
      toast.error("Failed to move item to new group");
      console.error("Error moving item:", error);
    }
  }, [contextHandleChangeGroup]);

  const handleSaveToNavMain = useCallback(() => {
    try {
      const updatedNavData = { ...navData };
      
      updatedNavData.groups = updatedNavData.groups.map(group => ({
        ...group,
        items: group.items.map(item => ({
          ...item,
          groupId: group.label.id
        }))
      }));

      updateNavData(updatedNavData);
      toast.success("Changes saved successfully");
    } catch (error) {
      toast.error("Failed to save changes");
      console.error("Error saving changes:", error);
    }
  }, [navData, updateNavData]);

  const findMenuItem = useCallback((itemId: string): MenuItem | undefined => {
    const item = navData.groups.flatMap(g => g.items).find(item => item.id === itemId);
    return item ? convertNavMainToShared(item) : undefined;
  }, [navData.groups]);

  const updateItemCollapsible = useCallback((itemId: string, isCollapsible: boolean) => {
    try {
      const updatedNavData = { ...navData };
      const groupIndex = updatedNavData.groups.findIndex(g => g.items.some(item => item.id === itemId));
      
      if (groupIndex !== -1) {
        const itemIndex = updatedNavData.groups[groupIndex].items.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
          updatedNavData.groups[groupIndex].items[itemIndex].isCollapsible = isCollapsible;
          updateNavData(updatedNavData);
        }
      }
      
      toast.success("Item collapsible state updated successfully");
    } catch (error) {
      toast.error("Failed to update item collapsible state");
      console.error("Error updating item collapsible state:", error);
    }
  }, [navData, updateNavData]);

  useEffect(() => {
    navData.groups.forEach(group => {
      group.items.forEach(item => {
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
    handleGroupChange,
    handleSaveToNavMain,
    findMenuItem,
    deleteGroupLabel: contextDeleteGroupLabel,
    updateItemCollapsible: contextUpdateItemCollapsible
  };
};
