import { MenuItem, SubMenuItem } from '@/slices/sidebar/menu/types/';

// Find operations
export const findSubMenuItem = (parentItem: MenuItem | null, subItemId: string): SubMenuItem | null => {
  if (!parentItem?.items) return null;
  return parentItem.items.find(item => item.id === subItemId) || null;
};

export const findParentMenuItem = (menuItems: MenuItem[], subItemId: string): MenuItem | null => {
  for (const item of menuItems) {
    if (item.items?.some(si => si.id === subItemId)) {
      return item;
    }
  }
  return null;
};

// Create operations
export const createEmptyMenuItem = (): MenuItem => ({
  id: '',
  title: '',
  icon: '',
  url: { href: '' },
  isActive: true,
  items: []
});

export const createEmptySubMenuItem = (parentId: string): SubMenuItem => ({
  id: '',
  title: '',
  parentId,
  url: { href: '' }
});
