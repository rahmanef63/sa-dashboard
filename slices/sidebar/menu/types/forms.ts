import { MenuItem, SubMenuItem, GroupLabel } from './menu-items';
import { NavUrl } from './base';

export interface NavigationItem extends Omit<MenuItem, 'url' | 'groupId'> {
  url?: NavUrl;
  groupId?: string;
}

export interface GroupLabelFormProps {
  label?: GroupLabel | null;
  onSave: (label: GroupLabel) => void;
  onCancel: () => void;
}

export interface MenuItemFormProps {
  item?: NavigationItem | null;
  onSave: (item: NavigationItem) => void;
  onCancel: () => void;
}

export interface SubMenuItemFormProps {
  item?: SubMenuItem | null;
  parentId?: string;
  onSave: (item: SubMenuItem) => void;
  onCancel: () => void;
}
