import { type LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'
import { type WithIcon } from '@/shared/icon-picker/types'

// Common Types
export type TargetType = '_blank' | '_self' | '_parent' | '_top'

// Group Label Type
export interface GroupLabel {
  id: string;
  name: string;
  icon?: string;
  isCollapsible?: boolean;
}

// Menu item database schema (snake_case)
export interface MenuItemSchema {
  id: string;
  dashboard_id: string;
  name: string;
  icon: string | null;
  url_href: string | null;
  parent_id: string | null;
  order_index: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Base URL type
export interface NavUrl {
  href: string;
  target?: TargetType;
  rel?: string;
}

// Menu Category Types
export type MenuCategory = 
  | 'main'
  | 'digital'
  | 'family'
  | 'finance'
  | 'health'
  | 'hobbies'
  | 'home'
  | 'personal'
  | 'professional'
  | 'study'
  | 'travel'
  | string; // Allow dynamic categories

// Base Navigation Types
export interface BaseMenuItem {
  id?: string;
  name: string;
  order?: number;
  icon?: LucideIcon | string;
  isActive?: boolean;
  isCollapsible?: boolean;
  url?: NavUrl;
}

// Frontend types (camelCase)
export interface MenuItem extends BaseMenuItem {
  id: string;
  name: string;
  icon?: string;
  href?: string;
  isActive?: boolean;
  parentId?: string;
  orderIndex?: number;
  dashboardId?: string;
  menuType?: MenuCategory;
  items?: MenuItem[];
  groupId?: string;
  children?: MenuItem[];
}

export interface SubMenuItem extends MenuItem {
  parentId: string;
}

export interface MenuItemWithChildren extends MenuItem {
  children?: MenuItemWithChildren[];
}

export interface MenuSwitcherItem extends MenuItem {
  menuList: MenuItemWithChildren[];
}

export interface MenuSwitcher extends MenuItem {
  menus: MenuSwitcherItem[];
}

export interface Menu extends BaseMenuItem {
  id: string;
  name: string;
  icon?: string;
  items: MenuItemWithChildren[];
  menuType: MenuCategory;
  isDefault?: boolean;
  isActive?: boolean;
}

// Navigation Main Data Type
export interface NavMainGroup {
  label: GroupLabel;
  items: MenuItem[];
}

export interface NavMainData {
  groups: NavMainGroup[];
}

// Transform functions
export function transformToCamelCase(item: MenuItemSchema): MenuItem {
  return {
    id: item.id,
    name: item.name,
    icon: item.icon || undefined,
    href: item.url_href || undefined,
    isActive: item.is_active,
    parentId: item.parent_id || undefined,
    orderIndex: item.order_index,
    dashboardId: item.dashboard_id
  };
}

export function transformToSnakeCase(item: MenuItem): Partial<MenuItemSchema> {
  return {
    id: item.id,
    name: item.name,
    icon: item.icon || null,
    url_href: item.href || null,
    parent_id: item.parentId || null,
    order_index: item.orderIndex || 0,
    is_active: item.isActive ?? true,
    dashboard_id: item.dashboardId
  };
}