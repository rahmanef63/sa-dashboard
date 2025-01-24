import { MenuItem, SubMenuItem, GroupLabel } from 'shared/types/navigation-types'

import { MenuItemWithStringTarget, NavGroup } from '../types/userMenu.types'
import { toast } from 'sonner'

const VALID_TARGETS = ['_blank', '_self', '_parent', '_top'] as const;

// Core validation functions
const validateMenuItemStructure = (item: MenuItem): boolean => {
  return !!(item.id && item.title && typeof item.isActive === 'boolean');
};

const validateGroupLabelStructure = (label: GroupLabel): boolean => {
  return !!(label.id && label.title);
};

const validateSubMenuItemStructure = (item: SubMenuItem): boolean => {
  return !!(item.id && item.title && item.parentId);
};

// UI validation functions with toast notifications
export const validateMenuItem = (item: MenuItemWithStringTarget): boolean => {
  if (!validateMenuItemStructure(item)) {
    toast.error("Invalid menu item structure");
    return false;
  }
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
  if (!validateGroupLabelStructure(label)) {
    toast.error("Invalid group label structure");
    return false;
  }
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

export const validateSubMenuItem = (subItem: SubMenuItem, parentId: string): boolean => {
  if (!validateSubMenuItemStructure(subItem)) {
    toast.error("Invalid sub-menu item structure");
    return false;
  }
  if (!subItem.title.trim()) {
    toast.error("Sub-menu item title cannot be empty");
    return false;
  }
  if (!subItem.url.href.trim()) {
    toast.error("Sub-menu item URL cannot be empty");
    return false;
  }
  if (subItem.parentId !== parentId) {
    toast.error("Invalid parent ID for sub-menu item");
    return false;
  }
  return true;
};
