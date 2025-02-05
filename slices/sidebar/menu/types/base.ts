import { DashboardInfo } from '@/slices/sidebar/dashboard/types';
import { MenuGroup, MenuItem, SubMenuItem } from './menu-items';

/**
 * Base item interface
 */
export interface BaseItem {
  id?: string;
  name: string;
  icon?: string;
}

/**
 * Base navigation URL type
 */
export interface NavUrl {
  path: string;
  label: string;
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * Base navigation item type
 */
export interface BaseNavigationItem extends BaseItem {
  url?: NavUrl;
  path?: string;
  isActive?: boolean;
  isCollapsible?: boolean;
  className?: string;
  onFocus?: () => void;
}

export interface MenuSwitch {
  id: string;
  name: string;
  icon?: string;
  dashboards: DashboardInfo[];
}

export interface NavMainData {
  dashboardId: string;
  groups: MenuGroup[];
  items: MenuItem[];
  subItems: SubMenuItem[];
}


