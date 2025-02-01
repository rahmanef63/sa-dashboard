import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MenuItemWithChildren, NavMainData } from '@/shared/types/navigation-types';
import {dashboardService} from '@/slices/sidebar/dashboard/api/dashboardService'; // Import dashboardService

interface MenuContextType {
  menuItems: MenuItemWithChildren[];
  currentDashboardId: string | null;
  loading: boolean;
  setCurrentDashboardId: (id: string) => void;
  navData: NavMainData | null;
  updateNavData: (data: NavMainData) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItemWithChildren[]>([]);
  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [navData, setNavData] = useState<NavMainData | null>(null);

  const updateNavData = useCallback((data: NavMainData) => {
    setNavData(data);
  }, []);

  // Helper function to build menu tree
  const buildMenuTree = (items: MenuItemWithChildren[]): MenuItemWithChildren[] => {
    const itemMap = new Map<string, MenuItemWithChildren>();
    const roots: MenuItemWithChildren[] = [];

    // First pass: create map of items
    items.forEach(item => {
      if (item.id) {
        itemMap.set(item.id, { ...item, children: [] });
      }
    });

    // Second pass: build tree structure
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

  const fetchMenuItems = useCallback(async (dashboardId: string) => {
    console.log('[Debug] Fetching menu items for dashboard:', dashboardId);
    try {
      setLoading(true);
      // Fetch menu items for the current dashboard
      const response = await fetch(`/api/menu?dashboardId=${dashboardId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch menu items');
      }

      const menuItems = data.data || [];
      console.log('[Debug] Fetched menu items:', menuItems);
      const hierarchicalMenu = buildMenuTree(menuItems);
      setMenuItems(hierarchicalMenu);
      setCurrentDashboardId(dashboardId);
      setLoading(false);
      return hierarchicalMenu;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setLoading(false);
      throw error;
    }
  }, []);

  // Initialize with default dashboard
  useEffect(() => {
    console.log('[Debug] Initializing menu with current dashboard:', currentDashboardId);
    const initializeMenu = async () => {
      try {
        if (currentDashboardId) {
          await fetchMenuItems(currentDashboardId);
        } else {
          const dashboards = await dashboardService.getAllDashboards();
          if (dashboards.length > 0) {
            const defaultDashboard = dashboards[0];
            await fetchMenuItems(defaultDashboard.dashboardId);
          }
        }
      } catch (error) {
        console.error('Error initializing menu:', error);
        setLoading(false);
      }
    };

    initializeMenu();
  }, [currentDashboardId, fetchMenuItems]);

  // Fetch menu items when dashboard changes
  useEffect(() => {
    if (currentDashboardId) {
      setLoading(true);
      fetchMenuItems(currentDashboardId)
        .catch(error => {
          console.error('Error fetching menu items:', error);
          setLoading(false);
        });
    }
  }, [currentDashboardId, fetchMenuItems]);

  return (
    <MenuContext.Provider value={{
      menuItems,
      currentDashboardId,
      loading,
      setCurrentDashboardId,
      navData,
      updateNavData
    }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}