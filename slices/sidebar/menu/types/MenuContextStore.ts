import { MenuItem, NavMainData } from './menu-items';

export interface MenuContextStore {
  navData: NavMainData | null;
  updateNavData: (data: NavMainData) => void;
}

export { useMenu } from '../hooks';
