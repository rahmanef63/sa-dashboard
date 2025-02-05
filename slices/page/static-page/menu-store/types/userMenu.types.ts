import { GroupLabel, MenuItem, SubMenuItem } from '@/slices/sidebar/menu/types/'

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



export type MenuItemFormProps = {
  item: MenuItem | null
  onSave: (item: MenuItem) => void
}

