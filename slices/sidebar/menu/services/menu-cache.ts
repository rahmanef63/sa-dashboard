import { MenuItem } from '@/slices/sidebar/menu/types/';

const MENU_CACHE_KEY = 'menu_cache';
const TREE_CACHE_KEY = 'tree_cache';

interface CacheData {
  [key: string]: MenuItem[];
}

export class MenuCache {
  private static instance: MenuCache;
  private menuCache: CacheData = {};
  private treeCache: CacheData = {};

  private constructor() {
    this.initializeCache();
  }

  static getInstance(): MenuCache {
    if (!MenuCache.instance) {
      MenuCache.instance = new MenuCache();
    }
    return MenuCache.instance;
  }

  private initializeCache(): void {
    try {
      const menuData = localStorage.getItem(MENU_CACHE_KEY);
      const treeData = localStorage.getItem(TREE_CACHE_KEY);
      
      if (menuData) {
        this.menuCache = JSON.parse(menuData);
      }
      
      if (treeData) {
        this.treeCache = JSON.parse(treeData);
      }
    } catch (error) {
      console.error('Error initializing cache:', error);
    }
  }

  private saveCache(): void {
    try {
      localStorage.setItem(MENU_CACHE_KEY, JSON.stringify(this.menuCache));
      localStorage.setItem(TREE_CACHE_KEY, JSON.stringify(this.treeCache));
    } catch (error) {
      console.error('Error saving cache:', error);
    }
  }

  getItems(dashboardId: string): MenuItem[] | null {
    return this.menuCache[dashboardId] || null;
  }

  setItems(dashboardId: string, items: MenuItem[]): void {
    this.menuCache[dashboardId] = items;
    this.saveCache();
  }

  removeItems(dashboardId: string): void {
    delete this.menuCache[dashboardId];
    this.saveCache();
  }

  clearMenuCache(): void {
    this.menuCache = {};
    this.saveCache();
  }

  getTree(dashboardId: string): MenuItem[] | null {
    return this.treeCache[dashboardId] || null;
  }

  setTree(dashboardId: string, tree: MenuItem[]): void {
    this.treeCache[dashboardId] = tree;
    this.saveCache();
  }

  removeTree(dashboardId: string): void {
    delete this.treeCache[dashboardId];
    this.saveCache();
  }

  clearTreeCache(): void {
    this.treeCache = {};
    this.saveCache();
  }

  clearAllCache(): void {
    this.menuCache = {};
    this.treeCache = {};
    localStorage.removeItem(MENU_CACHE_KEY);
    localStorage.removeItem(TREE_CACHE_KEY);
  }

  invalidate(dashboardId: string): void {
    this.removeItems(dashboardId);
    this.removeTree(dashboardId);
  }
}
