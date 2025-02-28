import { BaseNavigationItem, NavUrl, BaseItem } from './base';

// Base menu item interface that others will extend
export interface BaseMenuItem extends BaseNavigationItem {
  url?: NavUrl;
  children?: BaseMenuItem[];
  orderIndex?: number;
  order?: number;
  groupId?: string;
}

export interface MenuItem extends BaseMenuItem {
  id: string;
  groupId: string;
  parentId?: string;
  orderIndex?: number;
  order?: number;
  items?: SubMenuItem[]; 
}

export interface SubMenuItem extends BaseMenuItem {
  id: string;
  parentId: string;
  path: string;
  groupId?: string; 
}

export interface MenuGroup extends BaseItem {
  id: string;
  name: string;
  icon?: string;
  items: MenuItem[];
  isCollapsed?: boolean;
  label: GroupLabel; 
}

export interface MenuCategory extends BaseItem {
  name: string;
}

export interface GroupLabel extends BaseItem {
  id: string;
  name: string;
  icon?: string;
}

export interface NavMainGroup {
  id: string;
  label: GroupLabel;
  items: MenuItem[];
  name: string;
  icon?: string;
  isCollapsed?: boolean;
}

export interface MenuSwitcherItem extends BaseItem {
  id: string;
  name: string;
}

export interface NavMainData {
  dashboardId?: string;
  groups: NavMainGroup[];
  items: MenuItem[];
  subItems: SubMenuItem[];
}

// Input types for creation/updates
export interface SubMenuItemInput extends Partial<SubMenuItem> {}
export interface MenuGroupInput extends Partial<MenuGroup> {}

export interface CollapsibleMenuProps {
  item: MenuItem;
  level?: number;
}
