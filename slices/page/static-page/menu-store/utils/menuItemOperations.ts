import { MenuItem, SubMenuItem } from 'shared/types/navigation-types';

export const findSubMenuItem = (parentItem: MenuItem | null, subItemId: string): SubMenuItem | null => {
  if (!parentItem?.items) return null;
  return parentItem.items.find(item => item.id === subItemId) || null;
};

export const validateMenuItem = (item: MenuItem): { isValid: boolean; error?: string } => {
  if (!item.icon) {
    return {
      isValid: false,
      error: "Menu item must have an icon. Please select an icon before proceeding."
    };
  }
  return { isValid: true };
};

export const createEmptySubMenuItem = (parentId: string): SubMenuItem => ({
  id: '',
  title: '',
  parentId,
  url: { href: '' }
});
