import { type LucideIcon, type LucideProps } from 'lucide-react'
import { type ReactNode, type ElementType, type ComponentType } from 'react'

// Base URL type
export interface NavUrl {
  href: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
}

// Base item interface for all menu items
export interface BaseNavigationItem {
  id: string
  title: string
  order?: number
}

// Dashboard Navigation Types
export interface NavItem {
  id: string
  title: string
  icon?: ReactNode
  href?: string
  isCollapsible?: boolean
  children?: NavItem[]
}

export interface TeamType {
  id: string
  name: string
  logo: ElementType<LucideProps>
  plan: string
  members?: UserType[]
}

export interface ProjectType {
  id: string
  name: string
  url: string
  icon: ElementType<LucideProps>
  status?: 'active' | 'archived'
  description?: string
  teamId?: string
  members?: UserType[]
}

export interface UserType {
  id: string
  name: string
  email: string
  avatar: string
  role?: string
  teamId?: string
}

// Modern Types (New System)
export interface MenuItemWithChildren extends BaseNavigationItem {
  icon?: ReactNode
  children?: MenuItemWithChildren[]
  isCollapsible?: boolean
  href?: string
  isActive?: boolean
}

export interface NavigationItem extends BaseNavigationItem {
  url?: NavUrl | string
  isActive?: boolean
  children?: NavigationItem[]
  isCollapsible?: boolean
  groupId?: string
}

// Legacy Types (For Backward Compatibility)
export interface GroupLabel extends BaseNavigationItem {}

export interface MenuItem extends BaseNavigationItem {
  id: string
  title: string
  url: NavUrl
  icon: string | LucideIcon
  isActive?: boolean
  isCollapsible?: boolean
  items?: SubMenuItem[]
  groupId?: string
}

export interface SubMenuItem extends BaseNavigationItem {
  id: string
  title: string
  url: NavUrl
  parentId?: string
}

export interface NavMainData {
  groups: NavGroup[]
}

export interface NavGroup {
  label: GroupLabel
  items: MenuItem[]
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

export interface CollapsibleMenuProps extends MenuItemProps {
  onFocus?: () => void
}

export interface SecondaryMenuProps extends MenuItemProps {
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
}

// Form Props Types
export interface MenuItemFormProps {
  item: MenuItem | null
  onSave: (item: MenuItem) => void
  onCancel?: () => void
}

export interface SubMenuItemFormProps {
  item?: SubMenuItem | null
  parentId: string
  onSave: (item: SubMenuItem) => void
  onCancel?: () => void
}

export interface GroupLabelFormProps {
  label: GroupLabel | null
  onSave: (label: GroupLabel) => void
  onCancel?: () => void
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
}

export interface Team {
  name: string
  logo: LucideIcon
  plan: string
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
export type MenuItemType = MenuItemWithChildren
export type SubMenuItemType = SubMenuItem
export type BaseMenuItem = BaseNavigationItem