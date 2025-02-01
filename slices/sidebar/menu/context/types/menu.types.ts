import { MenuItem, MenuItemWithChildren, NavMainData, SubMenuItem, GroupLabel } from 'shared/types/navigation-types'

export type MenuContextType = {
  menuItems: MenuItem[]
  setMenuItems: (items: MenuItemWithChildren[] | ((prev: MenuItem[]) => MenuItem[])) => void
  addMenuItem: (item: MenuItemWithChildren) => void
  updateMenuItem: (item: MenuItemWithChildren) => void
  deleteMenuItem: (id: string) => void
  updateSubMenuItem: (groupId: string, parentId: string, subItem: SubMenuItem) => void
  deleteSubMenuItem: (groupId: string, parentId: string, subItemId: string) => void
  updateItemCollapsible: (itemId: string, isCollapsible: boolean) => void
  navData: NavMainData
  updateNavData: (newNavData: NavMainData) => void
  handleChangeGroup: (itemId: string, newGroupId: string) => void
  addGroupLabel: (label: GroupLabel) => void
  updateGroupLabel: (labelId: string, updatedLabel: GroupLabel) => void
  deleteGroupLabel: (labelId: string) => void
}

export type MenuProviderProps = {
  children: React.ReactNode
}
