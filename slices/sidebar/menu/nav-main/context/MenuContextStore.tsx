import { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { MenuItem, NavMainData, SubMenuItem } from '@/slices/sidebar/menu/types/';
import { useDashboard } from '@/slices/sidebar/dashboard/hooks/use-dashboard';
import { menuService } from '@/app/api/sidebar/menu/service';
import { debounce } from 'lodash';

interface MenuContextType {
  menuItems: MenuItem[];
  loading: boolean;
  navData: NavMainData | null;
  currentDashboardId: string | null;
  setCurrentDashboardId: (id: string) => void;
  updateNavData: (data: NavMainData) => void;
  updateSubMenuItem: (groupId: string, parentId: string, item: SubMenuItem) => void;
  deleteSubMenuItem: (groupId: string, parentId: string, itemId: string) => void;
}

export const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [navData, setNavData] = useState<NavMainData | null>(null);
  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(null);
  const menuCache = useRef<Record<string, MenuItem[]>>({});
  const { currentDashboard } = useDashboard();

  const updateNavData = useCallback((data: NavMainData) => {
    setNavData(data);
  }, []);

  // Helper function to build menu tree
  const buildMenuTree = (items: MenuItem[]): MenuItem[] => {
    const itemMap = new Map<string, MenuItem>();
    const roots: MenuItem[] = [];

    items.forEach(item => {
      if (item.id) {
        itemMap.set(item.id, { ...item, children: [] });
      }
    });

    items.forEach(item => {
      if (!item.id) return;
      const mappedItem = itemMap.get(item.id);
      if (!mappedItem) return;

      if (item.parentId) {
        const parent = itemMap.get(item.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(mappedItem);
        }
      } else {
        roots.push(mappedItem);
      }
    });

    return roots;
  };

  const loadMenuItems = useCallback(async (dashboardId: string) => {
    if (!dashboardId) {
      console.log('[MenuProvider] No valid dashboard ID');
      return;
    }

    // Don't reload if already in cache
    if (menuCache.current[dashboardId]) {
      console.log('[MenuProvider] Using cached menu items');
      setMenuItems(menuCache.current[dashboardId]);
      return;
    }

    try {
      setLoading(true);
      const items = await menuService.getMenuItems(dashboardId);
      const menuTree = buildMenuTree(items);
      
      // Update cache
      menuCache.current[dashboardId] = menuTree;
      setMenuItems(menuTree);
    } catch (error) {
      console.error('[MenuProvider] Failed to load menu:', error);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce the menu loading
  const debouncedLoadMenu = useCallback(
    debounce((dashboardId: string) => {
      loadMenuItems(dashboardId);
    }, 300),
    [loadMenuItems]
  );

  useEffect(() => {
    if (currentDashboardId) {
      debouncedLoadMenu(currentDashboardId);
    } else {
      setMenuItems([]);
    }

    return () => {
      debouncedLoadMenu.cancel();
    };
  }, [currentDashboardId, debouncedLoadMenu]);

  useEffect(() => {
    if (currentDashboard?.dashboardId) {
      setCurrentDashboardId(currentDashboard.dashboardId);
    }
  }, [currentDashboard]);

  const updateSubMenuItem = useCallback((groupId: string, parentId: string, item: SubMenuItem) => {
    setMenuItems(prevItems => {
      const newItems = [...prevItems];
      const groupIndex = newItems.findIndex(group => group.id === groupId);
      if (groupIndex === -1) return prevItems;

      const group = newItems[groupIndex];
      const parentIndex = group.children?.findIndex(parent => parent.id === parentId) ?? -1;
      if (parentIndex === -1) return prevItems;

      const parent = group.children![parentIndex];
      const itemIndex = parent.children?.findIndex(child => child.id === item.id) ?? -1;
      
      if (itemIndex === -1 && parent.children) {
        parent.children.push(item);
      } else if (parent.children) {
        parent.children[itemIndex] = item;
      }

      return newItems;
    });
  }, []);

  const deleteSubMenuItem = useCallback((groupId: string, parentId: string, itemId: string) => {
    setMenuItems(prevItems => {
      const newItems = [...prevItems];
      const groupIndex = newItems.findIndex(group => group.id === groupId);
      if (groupIndex === -1) return prevItems;

      const group = newItems[groupIndex];
      const parentIndex = group.children?.findIndex(parent => parent.id === parentId) ?? -1;
      if (parentIndex === -1) return prevItems;

      const parent = group.children![parentIndex];
      if (parent.children) {
        parent.children = parent.children.filter(child => child.id !== itemId);
      }

      return newItems;
    });
  }, []);

  const contextValue = useMemo(() => ({
    menuItems,
    loading,
    navData,
    currentDashboardId,
    setCurrentDashboardId: (id: string) => {
      if (id !== currentDashboardId) {
        setCurrentDashboardId(id);
      }
    },
    updateNavData,
    updateSubMenuItem,
    deleteSubMenuItem,
  }), [menuItems, loading, navData, currentDashboardId, updateNavData, updateSubMenuItem, deleteSubMenuItem]);

  return (
    <MenuContext.Provider value={contextValue}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};