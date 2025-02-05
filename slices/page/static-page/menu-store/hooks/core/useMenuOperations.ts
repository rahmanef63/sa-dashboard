import { useCallback } from 'react';
import { MenuItem, SubMenuItem } from '@/slices/sidebar/menu/types/';
import { toast } from 'sonner';
import { validateMenuItem, validateSubMenuItem } from '../../utils/validation';
import { useUserMenu } from './useUserMenu';

export const useMenuOperations = (
  onEditItem: (item: MenuItem) => void,
  onRemoveItem: (itemId: string) => void,
  onAddSubMenuItem: (parentId: string, subItem: SubMenuItem) => void,
) => {
  const { handleEditItem, handleDeleteItem, handleSaveSubMenuItem, navData } = useUserMenu();

  const handleEditWithValidation = useCallback((item: MenuItem) => {
    if (!validateMenuItem(item)) {
      toast.error("Invalid menu item");
      return;
    }

    try {
      handleEditItem(item, () => {
        onEditItem(item);
        toast.success("Menu item updated successfully");
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update menu item");
      console.error("Error updating menu item:", error);
    }
  }, [handleEditItem, onEditItem]);

  const handleDeleteWithConfirmation = useCallback((itemId: string) => {
    if (window.confirm('Are you sure you want to delete this menu item?')) {
      // Find the group ID for the item
      const group = navData.groups.find(g => g.items.some(item => item.id === itemId));
      if (!group) {
        toast.error("Menu item not found");
        return;
      }
      handleDeleteItem(itemId, group.label.id, () => {
        onRemoveItem(itemId);
        toast.success("Item deleted successfully");
      });
    }
  }, [handleDeleteItem, onRemoveItem, navData.groups]);

  const handleAddSubMenuItemWithValidation = useCallback((parentId: string, subItem: SubMenuItem) => {
    if (!validateSubMenuItem(subItem, parentId)) {
      return;
    }
    handleSaveSubMenuItem(subItem, parentId, () => {
      onAddSubMenuItem(parentId, subItem);
      toast.success("Sub-menu item added successfully");
    });
  }, [handleSaveSubMenuItem, onAddSubMenuItem]);

  return {
    handleEditItem: handleEditWithValidation,
    handleDeleteItem: handleDeleteWithConfirmation,
    handleAddSubMenuItem: handleAddSubMenuItemWithValidation,
  };
};
