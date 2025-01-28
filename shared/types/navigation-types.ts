import { type LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'
import { type WithIcon } from '@/shared/icon-picker/types'

// Common Types
export type TargetType = '_blank' | '_self' | '_parent' | '_top'

// Base URL type
export interface NavUrl {
  href: string
  target?: TargetType
  rel?: string
}

// Base Navigation Types
export interface BaseMenuItem {
  id?: string
  title: string
  order?: number
  icon?: LucideIcon | string
  isActive?: boolean
  isCollapsible?: boolean
  url?: NavUrl
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
  | string // Allow dynamic categories

// Modern Navigation System
export interface MenuItemWithChildren extends BaseMenuItem {
  children?: MenuItemWithChildren[]
  parentId?: string
  dashboardId?: string
  menuType?: MenuCategory
}

// Menu Types
export interface MenuSwitcherItem extends BaseMenuItem {
  id: string
  title: string
  icon?: string
  dashboardId: string
  menuType: MenuCategory
  menuList: MenuItemWithChildren[]
}

export interface MenuSwitcher extends BaseMenuItem {
  id: string
  title: string
  icon?: string
  menus?: MenuSwitcherItem[]
  dashboardId?: string
  menuType?: MenuCategory
  children?: MenuItemWithChildren[]
}

export interface Menu extends BaseMenuItem {
  id: string
  title: string
  icon?: string
  dashboardId: string
  menuType: MenuCategory
  menuList: MenuItemWithChildren[]
  isDefault?: boolean
  isActive?: boolean
}

// Menu Collections
export type DigitalNavItems = MenuItemWithChildren[]
export type FamilyNavItems = MenuItemWithChildren[]
export type FinanceNavItems = MenuItemWithChildren[]
export type HealthNavItems = MenuItemWithChildren[]
export type HobbiesNavItems = MenuItemWithChildren[]
export type HomeNavItems = MenuItemWithChildren[]
export type MainNavItems = MenuItemWithChildren | MenuSwitcher
export type PersonalNavItems = MenuItemWithChildren[]
export type ProfessionalNavItems = MenuItemWithChildren[]
export type StudyNavItems = MenuItemWithChildren[]
export type TravelNavItems = MenuItemWithChildren[]

// Dashboard Types
export interface DashboardMenu {
  id: string
  name: string
  icon?: string
  logo?: string
  items: MenuItemWithChildren[]
  menuType: MenuCategory
  isDefault?: boolean
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
  createdBy?: string
  updatedBy?: string
}

export interface Dashboard {
  id?: string
  name: string
  icon?: string
  logo?: string
  plan?: string
  dashboardId: string
  description?: string
  menus?: DashboardMenu[]
  menuList?: MenuItemWithChildren[]
  defaultMenuId?: string
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
  createdBy?: string
  updatedBy?: string
}

// Dynamic Dashboard Types
export interface DashboardNavItem extends MenuItemWithChildren {
  dashboardId: string
  menuType: MenuCategory
}

export type DynamicNavItems = DashboardNavItem[]

// Legacy Navigation System
export type NavigationItem = BaseMenuItem & {
  children?: NavigationItem[]
  groupId?: string
}

export interface MenuItem extends NavigationItem {
  url: NavUrl
  items?: SubMenuItem[]
}

export interface SubMenuItem extends Omit<NavigationItem, 'children' | 'items'> {
  url: NavUrl
  parentId: string
}

export interface GroupLabel extends Pick<BaseMenuItem, 'id' | 'title'> {}

export interface NavGroup {
  label: GroupLabel
  items: MenuItem[]
}

export interface NavMainData {
  groups: NavGroup[]
}

// Form Props Types
export interface BaseFormProps<T extends NavigationItem> {
  item: T | null
  onSave: (item: T) => void
  onCancel?: () => void
}

export type MenuItemFormProps = BaseFormProps<MenuItem>

export interface SubMenuItemFormProps extends BaseFormProps<SubMenuItem> {
  parentId: string
}

export type GroupLabelFormProps = Omit<BaseFormProps<GroupLabel>, 'item'> & {
  label: GroupLabel | null
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
export interface BaseMenuProps {
  isCollapsed?: boolean
  className?: string
}

export interface MenuItemProps extends BaseMenuProps {
  item: MenuItemWithChildren
  config?: Partial<MenuConfig>
}

export type CollapsibleMenuProps = Omit<MenuItemProps, 'config'> & {
  onFocus?: () => void
}

export type SecondaryMenuProps = Omit<MenuItemProps, 'config'> & {
  onItemClick: (item: MenuItemWithChildren) => void
}

export interface MenuSectionProps extends BaseMenuProps {
  items: MenuItemWithChildren[]
  title?: string
  onSecondaryItemClick?: (item: MenuItemWithChildren) => void
  onFocus?: () => void
  config?: Partial<MenuConfig>
  renderIcon?: (icon: string | undefined) => JSX.Element | null
}

// Sidebar Menu Item Props
export interface SidebarMenuItemProps extends BaseMenuProps {
  item: MenuItem
  subItems?: SubMenuItem[]
  isActive?: boolean
  onSubItemClick?: (subItem: SubMenuItem) => void
  onItemClick?: (item: MenuItem) => void
  onEdit?: (item: MenuItem) => void
  onDelete?: (item: MenuItem) => void
}

// User and Team Types
export interface User {
  name: string
  email: string
  avatar: string
  dashboardList?: DashboardList[]
}

export interface DashboardList {
  dashboard: Dashboard
  user: User
}

export interface NavProjectsProps {
  projects: MenuItem[]
}

// User Menu Props Types
export interface UserMenuItemsProps {
  onRemoveItem: (id: string) => void
  onEditItem: (editedItem: MenuItem) => void
  onAddLabel: (label: GroupLabel) => void
  onAddSubMenuItem: (parentId: string, subItem: SubMenuItem) => void
  onChangeGroup?: (itemId: string, groupId: string) => void
  isSubmenuAvailable?: boolean
}

// Type aliases for backward compatibility
export type { MenuItem as MenuItemType }
export type { SubMenuItem as SubMenuItemType }