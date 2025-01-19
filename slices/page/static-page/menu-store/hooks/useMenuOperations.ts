import { useCallback } from 'react';
import { MenuItem, SubMenuItem, GroupLabel } from 'shared/types/navigation-types';
import { useToast } from "shared/components/ui/use-toast";
import { validateMenuItem } from '../utils/menuItemOperations';
import { useUserMenu } from './useUserMenu';

export const useMenuOperations = (
  onEditItem: (item: MenuItem) => void,
  onRemoveItem: (itemId: string) => void,
  onAddSubMenuItem: (parentId: string, subItem: SubMenuItem) => void,
) => {
  const { toast } = useToast();
  const { 
    handleEditItem: userMenuEditItem,
    handleDeleteItem: userMenuDeleteItem,
    handleSaveSubMenuItem: userMenuSaveSubItem,
  } = useUserMenu();

  const handleEditWithValidation = useCallback((item: MenuItem) => {
    const validation = validateMenuItem(item);
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }
    userMenuEditItem(item, onEditItem);
  }, [userMenuEditItem, onEditItem, toast]);

  const handleDeleteSubItem = useCallback((parentId: string, subItemId: string, parentItem: MenuItem) => {
    if (!parentItem?.items) return;
    
    const updatedItems = parentItem.items.filter(item => item.id !== subItemId);
    const updatedParentItem = {
      ...parentItem,
      items: updatedItems
    };
    
    userMenuEditItem(updatedParentItem, onEditItem);
  }, [userMenuEditItem, onEditItem]);

  const handleSaveSubMenuItemWrapper = useCallback((parentId: string, subItem: SubMenuItem) => {
    userMenuSaveSubItem(subItem, parentId, onAddSubMenuItem);
  }, [userMenuSaveSubItem, onAddSubMenuItem]);

  return {
    handleEditWithValidation,
    handleDeleteSubItem,
    handleSaveSubMenuItemWrapper,
  };
};
