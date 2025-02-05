/**
 * Base types for dashboard items
 */
export interface BaseItem {
  id: string;
  name: string;
  order: number;
  icon?: string;
  dashboardId: string;
}

export interface DashboardInfo extends BaseItem {
  description?: string;
}

export interface Dashboard extends DashboardInfo {
  plan?: string;
  isPublic?: boolean;
  isActive?: boolean;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  logo?: string;
  menuItems?: import('@/slices/sidebar/menu/types').MenuItem[];
}

export type DashboardCreateInput = Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'> & {
  userId: string;
};

export type DashboardUpdateInput = Partial<Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>> & {
  id: string;
};
