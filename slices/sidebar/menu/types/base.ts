import { DashboardInfo } from '@/slices/sidebar/dashboard/types';

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
  children?: BaseNavigationItem[];
  isOpen?: boolean;
}

/**
 * Menu switch type for dashboard selection
 */
export interface MenuSwitch {
  id: string;
  name: string;
  icon?: string;
  dashboards: DashboardInfo[];
}
