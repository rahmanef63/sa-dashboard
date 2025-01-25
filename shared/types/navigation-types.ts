import { type LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'
import { type WithIcon } from '@/shared/icon-picker/types'

// Base URL type
export interface NavUrl {
  href: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
}

// Base Navigation Types
export interface BaseNavigationItem {
  id: string
  title: string
  order?: number
  icon?: LucideIcon | string
  isActive?: boolean
  isCollapsible?: boolean
}

// Modern Navigation System
export interface MenuItemWithChildren extends BaseNavigationItem {
  url?: NavUrl
  children?: MenuItemWithChildren[]
  parentId?: string
  dashboardId?: string
}

// Legacy Navigation System
export interface NavigationItem extends BaseNavigationItem {
  url?: NavUrl
  children?: NavigationItem[]
  groupId?: string
}

export interface MenuItem extends NavigationItem {
  url: NavUrl
  items?: SubMenuItem[]
}

export interface SubMenuItem extends NavigationItem {
  url: NavUrl
  parentId: string
}

export interface GroupLabel extends BaseNavigationItem {
  id: string
  title: string
}

export interface NavGroup {
  label: GroupLabel
  items: MenuItem[]
}

export interface NavMainData {
  groups: NavGroup[]
}

// Form Props Types
export interface BaseFormProps<T extends NavigationItem> {
  item?: T | null
  onSave: (item: T) => void
  onCancel?: () => void
}

export interface MenuItemFormProps extends BaseFormProps<MenuItem> {
  item: MenuItem | null
}

export interface SubMenuItemFormProps extends BaseFormProps<SubMenuItem> {
  item?: SubMenuItem | null
  parentId: string
}

export interface GroupLabelFormProps {
  label: GroupLabel | null
  onSave: (label: GroupLabel) => void
  onCancel?: () => void
}

// Menu Configuration Types
export interface MenuDisplayConfig {
  isCollapsed: boolean
  isSecondary: boolean
  showTitle: boolean
  showIcon: boolean
  showChevron: boolean
}

export interface MenuStateConfig {
  isExpanded: boolean
  isActive: boolean
  isHovered: boolean
}

export interface MenuThemeConfig {
  baseClasses: string
  activeClasses: string
  hoverClasses: string
  iconClasses: string
  textClasses: string
  chevronClasses: string
}

export interface MenuEventHandlers {
  onClick?: () => void
  onFocus?: () => void
  onHover?: () => void
  onLeave?: () => void
}

export interface MenuConfig {
  display: MenuDisplayConfig
  state: MenuStateConfig
  theme: MenuThemeConfig
  events: MenuEventHandlers
}

// Component Props Types
export interface MenuItemProps {
  item: MenuItemWithChildren
  isCollapsed?: boolean
  className?: string
  config?: Partial<MenuConfig>
}

export interface CollapsibleMenuProps extends Omit<MenuItemProps, 'config'> {
  onFocus?: () => void
}

export interface SecondaryMenuProps extends Omit<MenuItemProps, 'config'> {
  onItemClick: (item: MenuItemWithChildren) => void
}

export interface MenuSectionProps {
  items: MenuItemWithChildren[]
  title?: string
  isCollapsed?: boolean
  onSecondaryItemClick?: (item: MenuItemWithChildren) => void
  onFocus?: () => void
  className?: string
  config?: Partial<MenuConfig>
  renderIcon?: (icon: string | undefined) => JSX.Element | null
}

// Sidebar Menu Item Props
export interface SidebarMenuItemProps {
  item: MenuItem
  subItems?: SubMenuItem[]
  isActive?: boolean
  isCollapsed?: boolean
  onSubItemClick?: (subItem: SubMenuItem) => void
  onItemClick?: (item: MenuItem) => void
  onEdit?: (item: MenuItem) => void
  onDelete?: (item: MenuItem) => void
  className?: string
}

// User and Team Types (From menu/types.ts)
export interface User {
  name: string
  email: string
  avatar: string
  dashboardList?: dashboardList[]
}

export interface Dashboard {
  name: string
  logo: string
  plan: string
  dashboardId: string
  defaultMenuId?: string
  menu?: MenuItemWithChildren[]
}

export interface dashboardList {
  dashboard: Dashboard
  user: User
}

export type NavProjectsProps = {
  projects: MenuItem[]
}

// Props Types from userMenu.types.ts
export interface UserMenuItemsProps {
  onRemoveItem: (id: string) => void
  onEditItem: (editedItem: MenuItem) => void
  onAddLabel: (label: GroupLabel) => void
  onAddSubMenuItem: (parentId: string, subItem: SubMenuItem) => void
  onChangeGroup?: (itemId: string, groupId: string) => void
  isSubmenuAvailable?: boolean
}

// Helper Types
export type MenuItemType = MenuItem
export type SubMenuItemType = SubMenuItem
export type BaseMenuItem = BaseNavigationItem