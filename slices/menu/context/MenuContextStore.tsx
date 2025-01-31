import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MenuItemWithChildren } from '@/shared/types/navigation-types';

interface MenuContextType {
  menuItems: MenuItemWithChildren[];
  currentDashboardId: string | null;
  loading: boolean;
  setCurrentDashboardId: (id: string) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItemWithChildren[]>([]);
  const [currentDashboardId, setCurrentDashboardId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    try {
      // Fetch menu items for the current dashboard
      const response = await fetch(`/api/menu?dashboardId=${dashboardId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch menu items');
      }

      const menuItems = data.data || [];
      const hierarchicalMenu = buildMenuTree(menuItems);
      setMenuItems(hierarchicalMenu);
      setCurrentDashboardId(dashboardId);
      setLoading(false);
      return hierarchicalMenu;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  }, []);

  // Initialize with default dashboard
  useEffect(() => {
    const initializeMenu = async () => {
      try {
        // First try to get default dashboard
        const response = await fetch('/api/dashboards');
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch dashboards');
        }

        const dashboards = data.data || [];
        if (dashboards.length > 0) {
          const defaultDashboard = dashboards[0];
          await fetchMenuItems(defaultDashboard.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing menu:', error);
        setLoading(false);
      }
    };

    initializeMenu();
  }, [fetchMenuItems]);

  return (
    <MenuContext.Provider value={{ menuItems, currentDashboardId, loading, setCurrentDashboardId }}>
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