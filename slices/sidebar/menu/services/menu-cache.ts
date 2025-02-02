import { MenuItem, MenuItemWithChildren } from '@/shared/types/navigation-types';

export class MenuCache {
  private static instance: MenuCache;
  private cache = new Map<string, MenuItem[]>();
  private treeCache = new Map<string, MenuItemWithChildren[]>();

  private constructor() {}

  static getInstance(): MenuCache {
    if (!MenuCache.instance) {
      MenuCache.instance = new MenuCache();
    }
    return MenuCache.instance;
  }

  getItems(dashboardId: string): MenuItem[] | undefined {
    return this.cache.get(dashboardId);
  }

  setItems(dashboardId: string, items: MenuItem[]): void {
    this.cache.set(dashboardId, items);
    // Clear tree cache for this dashboard since items changed
    this.treeCache.delete(dashboardId);
  }

  getTree(dashboardId: string): MenuItemWithChildren[] | undefined {
    return this.treeCache.get(dashboardId);
  }

  setTree(dashboardId: string, tree: MenuItemWithChildren[]): void {
    this.treeCache.set(dashboardId, tree);
  }

  clear(dashboardId?: string): void {
    if (dashboardId) {
      this.cache.delete(dashboardId);
      this.treeCache.delete(dashboardId);
    } else {
      this.cache.clear();
      this.treeCache.clear();
    }
  }

  invalidate(dashboardId: string): void {
    this.clear(dashboardId);
  }
}
