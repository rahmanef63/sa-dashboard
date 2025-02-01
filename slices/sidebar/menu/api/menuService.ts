import { MenuItem, MenuItemSchema, transformToCamelCase } from '@/shared/types/navigation-types';

class MenuService {
  async getMenuItems(dashboardId: string): Promise<MenuItem[]> {
    const response = await fetch(`/api/menu?dashboardId=${dashboardId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch menu items');
    }
    const { data } = await response.json();
    return (data as MenuItemSchema[]).map(transformToCamelCase);
  }
}

export const menuService = new MenuService();
