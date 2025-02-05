import { MenuGroup, MenuItem, SubMenuItem } from './menu-items';

export interface MenuContextData {
  items: MenuItem[];
  groups: MenuGroup[];
}

export interface MenuContextState {
  navData: MenuContextData | null;
  isLoading: boolean;
  error: Error | null;
}

export interface MenuContextActions {
  updateNavData: (data: MenuContextData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

export interface MenuContextType extends MenuContextState, MenuContextActions {
  groups: MenuGroup[];
  items: MenuItem[];
  subItems: SubMenuItem[];
  addGroup: (group: MenuGroup) => void;
  updateGroup: (group: MenuGroup) => void;
  deleteGroup: (groupId: string) => void;
  addItem: (item: MenuItem) => void;
  updateItem: (item: MenuItem) => void;
  deleteItem: (itemId: string) => void;
  addSubItem: (item: SubMenuItem) => void;
  updateSubItem: (item: SubMenuItem) => void;
  deleteSubItem: (itemId: string) => void;
  menuItems: MenuItem[];
  setMenuItems: (items: MenuItem[] | ((prev: MenuItem[]) => MenuItem[])) => void;
  updateSubMenuItem: (groupId: string, parentId: string, subItem: SubMenuItem) => void;
  deleteSubMenuItem: (groupId: string, parentId: string, subItemId: string) => void;
  updateItemCollapsible: (itemId: string, isCollapsible: boolean) => void;
  handleChangeGroup: (itemId: string, newGroupId: string) => void;
}

export interface MenuProviderProps {
  children: React.ReactNode;
}

export type MenuAction = 
  | { type: 'SET_DASHBOARD'; payload: string }
  | { type: 'ADD_GROUP'; payload: MenuGroup }
  | { type: 'UPDATE_GROUP'; payload: MenuGroup }
  | { type: 'DELETE_GROUP'; payload: string }
  | { type: 'ADD_ITEM'; payload: MenuItem }
  | { type: 'UPDATE_ITEM'; payload: MenuItem }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'ADD_SUB_ITEM'; payload: SubMenuItem }
  | { type: 'UPDATE_SUB_ITEM'; payload: SubMenuItem }
  | { type: 'DELETE_SUB_ITEM'; payload: string }
  | { type: 'TOGGLE_GROUP_COLLAPSE'; payload: string };
