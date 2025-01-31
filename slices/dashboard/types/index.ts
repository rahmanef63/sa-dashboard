// Dashboard Types

import { MenuCategory, MenuItemWithChildren } from "@/shared/types/navigation-types"
import { User } from "@/shared/types/global"

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

export interface DashboardList {
  dashboard: Dashboard
  user: User
}

export interface DashboardFormValues {
  name: string;
  description?: string;
  logo?: string;
  plan?: string;
  isPublic?: boolean;
}

export interface DashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: 'create' | 'edit' | 'delete';
  dashboardId?: string;
}

export interface DashboardCreateInput {
  name: string;
  description?: string;
  logo?: string;
  plan?: string;
  user_id?: string;
}

export interface DashboardUpdateInput extends Partial<DashboardCreateInput> {
  is_active?: boolean;
}

export interface DashboardWithId extends DashboardFormValues {
  id?: string;
}

export type DashboardMutationVariables = {
  create: DashboardFormValues;
  edit: DashboardFormValues & { id: string };
  delete: { id: string };
};

export type DashboardMutationResult = {
  create: Dashboard;
  edit: Dashboard;
  delete: void;
};

export const DASHBOARD_SWITCHER_LABELS = {
  DASHBOARDS: 'Dashboards',
  ADD_DASHBOARD: 'Add dashboard',
} as const

export const DASHBOARD_SWITCHER_SHORTCUTS = {
  BASE: '⌘',
} as const

export interface UseDashboardSwitcherProps {
  initialDashboards: Dashboard[]
  onDashboardChange?: (dashboard: Dashboard) => void
  defaultDashboardId?: string
}


export interface DashboardSwitcherProps {
  dashboards: Dashboard[]
  onDashboardChange: (dashboard: Dashboard) => void
  className?: string
  isMobile?: boolean
  defaultDashboardId?: string
}