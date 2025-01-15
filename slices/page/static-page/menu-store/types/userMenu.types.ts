import { GroupLabel, MenuItem, SubMenuItem, NavUrl } from '@/slices/menu/nav-main/types'

export type UserMenuItemsProps = {
  onRemoveItem: (id: string) => void
  onEditItem: (editedItem: MenuItem) => void
  onAddLabel: (label: GroupLabel) => void
  onAddSubMenuItem: (parentId: string, subItem: SubMenuItem) => void
  onChangeGroup?: (itemId: string, groupId: string) => void
  isSubmenuAvailable?: boolean
}

export type MenuItemWithStringTarget = MenuItem

export type NavGroup = {
  label: GroupLabel
  items: MenuItem[]
}
