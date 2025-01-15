import { type LucideIcon } from 'lucide-react'

// Base URL type for consistent URL handling
export interface NavUrl {
  href: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
}

// Base item interface for shared properties
export interface BaseItem {
  id: string
  title: string
  order?: number
}

// Sub-menu item with simplified URL
export interface SubMenuItem extends BaseItem {
  url: string
  parentId?: string
}

// Main menu item with extended properties
export interface MenuItem extends BaseItem {
  url: NavUrl
  icon: string
  isActive?: boolean
  items?: SubMenuItem[]
  groupId?: string
}

// Group label type
export interface GroupLabel extends BaseItem {}

// Navigation data structure
export interface NavMainData {
  groups: {
    label: GroupLabel
    items: MenuItem[]
  }[]
}

// Form Props
export interface MenuItemFormProps {
  item?: MenuItem
  onSave: (item: MenuItem) => void
  onCancel?: () => void
}

export interface GroupLabelFormProps {
  label?: GroupLabel
  onSave: (label: GroupLabel) => void
  onCancel?: () => void
}

export interface SubMenuItemFormProps {
  item?: SubMenuItem
  parentId: string
  onSave: (item: SubMenuItem) => void
  onCancel?: () => void
}

// Component Props
export interface SidebarMenuItemProps {
  item: MenuItem
  onEdit?: (item: MenuItem) => void
  onDelete?: (id: string) => void
  className?: string
}

export interface SidebarMenuSubProps {
  items?: SubMenuItem[]
  parentId: string
  groupId: string
  className?: string
}

// Context Types
export interface MenuContextState {
  navData: NavMainData
  updateMenuItem: (item: MenuItem) => void
  deleteMenuItem: (groupId: string, itemId: string) => void
  updateSubMenuItem: (groupId: string, parentId: string, item: SubMenuItem) => void
  deleteSubMenuItem: (groupId: string, parentId: string, itemId: string) => void
  updateGroupLabel: (label: GroupLabel) => void
  deleteGroup: (groupId: string) => void
}
