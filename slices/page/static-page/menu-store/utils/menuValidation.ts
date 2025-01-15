import { GroupLabel, MenuItem, SubMenuItem } from '@/slices/menu/nav-main/types'
import { MenuItemWithStringTarget, NavGroup } from '../types/userMenu.types'
import { toast } from 'sonner'

const VALID_TARGETS = ['_blank', '_self', '_parent', '_top'] as const;

export const validateMenuItem = (item: MenuItemWithStringTarget): boolean => {
  if (!item.title.trim()) {
    toast.error("Menu item title cannot be empty");
    return false;
  }
  if (!item.url.href.trim()) {
    toast.error("Menu item URL cannot be empty");
    return false;
  }
  if (item.url.target && !VALID_TARGETS.includes(item.url.target)) {
    toast.error("Invalid target value. Must be one of: _blank, _self, _parent, _top");
    return false;
  }
  return true;
};

export const validateGroupLabel = (label: GroupLabel, existingGroups: NavGroup[]): boolean => {
  if (!label.title.trim()) {
    toast.error("Group label title cannot be empty");
    return false;
  }
  if (existingGroups.some(g => g.label.id !== label.id && g.label.title === label.title)) {
    toast.error("A group with this title already exists");
    return false;
  }
  return true;
};

export const validateSubMenuItem = (subItem: SubMenuItem, parentId: string, groups: NavGroup[]): boolean => {
  if (!subItem.title.trim()) {
    toast.error("Sub-menu item title cannot be empty");
    return false;
  }
  if (!subItem.url.trim()) {
    toast.error("Sub-menu item URL cannot be empty");
    return false;
  }
  const parentItem = groups.flatMap(g => g.items).find(item => item.id === parentId);
  if (!parentItem) {
    toast.error("Parent menu item not found");
    return false;
  }
  if (parentItem.items?.some(si => si.id !== subItem.id && si.title === subItem.title)) {
    toast.error("A sub-menu item with this title already exists under this parent");
    return false;
  }
  return true;
};
