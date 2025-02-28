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
  const [navData, setNavData] = useState<NavMainData | null>(null);
  const [currentDashboardId, setCurrentDashboardIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const menuCache = useRef<Record<string, MenuItem[]>>({});
  
  const { currentDashboard } = useDashboard();
  
  // Mock navigation data for testing
  const createMockNavData = useCallback((dashboardId: string) => {
    console.log('[MenuProvider] Creating mock nav data for dashboard:', dashboardId);
    
    // Default mock navigation data
    const mockNavData: NavMainData = {
      dashboardId,
      groups: [
        {
          id: 'mock-group-1',
          name: 'Main',
          icon: 'Home',
          label: {
            id: 'mock-group-1',
            name: 'Main',
            icon: 'Home'
          },
          items: [
            {
              id: 'mock-item-1',
              name: 'Debug Item 1',
              icon: 'Home',
              url: { 
                path: '/dashboard',
                label: 'Dashboard'
              },
              order: 0,
              groupId: 'mock-group-1'
            },
            {
              id: 'mock-item-2',
              name: 'Debug Item 2',
              icon: 'Chart',
              url: { 
                path: '/dashboard/settings',
                label: 'Settings' 
              },
              order: 1,
              groupId: 'mock-group-1'
            }
          ]
        }
      ],
      items: [],
      subItems: []
    };
    setNavData(mockNavData);
  }, []);
  
  // Build a menu tree from a flat list of menu items
  const buildMenuTree = useCallback((items: MenuItem[]): MenuItem[] => {
    // Group by parent ID (null for root items)
    const itemsByParent: Record<string, MenuItem[]> = {};
    
    // Initialize with root items (no parent)
    itemsByParent[''] = [];
    
    items.forEach(item => {
      const parentId = item.parentId || '';
      if (!itemsByParent[parentId]) {
        itemsByParent[parentId] = [];
      }
      itemsByParent[parentId].push(item);
    });
    
    // Recursive function to build the tree
    const buildTree = (parentId: string): MenuItem[] => {
      const children = itemsByParent[parentId] || [];
      return children.map((item: MenuItem) => ({
        ...item,
        children: buildTree(item.id)
      }));
    };
    
    return buildTree('');
  }, []);
  
  // Fetch menu items for the current dashboard
  const fetchMenuItems = useCallback(async (dashboardId: string) => {
    if (!dashboardId) {
      console.warn('[MenuProvider] No dashboard ID provided');
      return;
    }
    
    // Check if menu items are cached for this dashboard
    if (menuCache.current[dashboardId]) {
      console.log('[MenuProvider] Using cached menu items for dashboard:', dashboardId);
      setMenuItems(menuCache.current[dashboardId]);
      return;
    }
    
    // Debug mode for development
    const debugMode = process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEBUG_MENU === 'true';
    if (debugMode) {
      console.log('[MenuProvider] Debug mode enabled, using mock menu items');
      const mockItems: MenuItem[] = [
        {
          id: 'mock-menu-1',
          name: 'Dashboard',
          icon: 'Home',
          url: { 
            path: '/dashboard',
            label: 'Dashboard'
          },
          order: 0,
          groupId: 'mock-group-1',
          children: [
            {
              id: 'mock-submenu-1',
              name: 'Overview',
              icon: 'Chart',
              url: { 
                path: '/dashboard/overview',
                label: 'Overview'
              },
              order: 0,
              parentId: 'mock-menu-1',
              groupId: 'mock-group-1'
            } as MenuItem
          ]
        },
        {
          id: 'mock-menu-2',
          name: 'Settings',
          icon: 'Settings',
          url: { 
            path: '/dashboard/settings',
            label: 'Settings'
          },
          order: 1,
          groupId: 'mock-group-1',
          children: []
        }
      ];
      setMenuItems(mockItems);
      return;
    }
    
    // Fetch real menu items from API
    try {
      setLoading(true);
      console.log('[MenuProvider] Fetching menu items for dashboard:', dashboardId);
      const items = await menuService.getMenuItems(dashboardId);
      console.log('[MenuProvider] Fetched menu items:', items);
      
      if (!items || items.length === 0) {
        console.warn('[MenuProvider] No menu items found for dashboard:', dashboardId);
        console.log('[MenuProvider] Creating mock menu items for empty response');
        const mockItems: MenuItem[] = [
          {
            id: 'fallback-menu-1',
            name: 'Dashboard',
            icon: 'Home',
            url: { 
              path: '/dashboard',
              label: 'Dashboard'
            },
            order: 0,
            groupId: 'fallback-group-1',
            children: []
          },
          {
            id: 'fallback-menu-2',
            name: 'Settings',
            icon: 'Settings',
            url: { 
              path: '/dashboard/settings',
              label: 'Settings'
            },
            order: 1,
            groupId: 'fallback-group-1',
            children: []
          }
        ];
        menuCache.current[dashboardId] = mockItems;
        setMenuItems(mockItems);
        setLoading(false);
        return;
      }
      
      const menuTree = buildMenuTree(items);
      console.log('[MenuProvider] Built menu tree:', menuTree);
      
      menuCache.current[dashboardId] = menuTree;
      setMenuItems(menuTree);
    } catch (error) {
      console.error('[MenuProvider] Failed to load menu:', error);
      
      console.log('[MenuProvider] Creating fallback menu items due to error');
      const fallbackItems: MenuItem[] = [
        {
          id: 'error-menu-1',
          name: 'Dashboard',
          icon: 'Home',
          url: { 
            path: '/dashboard',
            label: 'Dashboard'
          },
          order: 0,
          groupId: 'error-group-1',
          children: []
        }
      ];
      setMenuItems(fallbackItems);
    } finally {
      setLoading(false);
    }
  }, [buildMenuTree]);
  
  // Convert menu items to NavMainData structure
  const buildNavData = useCallback((dashboardId: string, items: MenuItem[]) => {
    try {
      console.log('[MenuProvider] Building NavMainData from menu items:', items);
      
      // Organize items by group
      const groupsMap: Record<string, {
        id: string;
        name: string;
        icon?: string;
        items: MenuItem[];
      }> = {};
      
      // First pass: collect all groups
      items.forEach(item => {
        const groupId = item.groupId || 'default';
        
        if (!groupsMap[groupId]) {
          groupsMap[groupId] = {
            id: groupId,
            name: groupId === 'default' ? 'Main' : groupId,
            icon: item.icon || 'File',
            items: []
          };
        }
        
        // Add top-level items to their groups
        if (!item.parentId) {
          groupsMap[groupId].items.push(item);
        }
      });
      
      // Transform to NavMainData format
      const navData: NavMainData = {
        dashboardId,
        groups: Object.values(groupsMap).map(group => ({
          id: group.id,
          name: group.name,
          icon: group.icon,
          label: {
            id: group.id,
            name: group.name,
            icon: group.icon
          },
          items: group.items.sort((a, b) => {
            const aOrder = a.order || 0;
            const bOrder = b.order || 0;
            return aOrder - bOrder;
          })
        })),
        items: items.filter(item => !item.parentId),
        subItems: items.filter(item => !!item.parentId) as SubMenuItem[]
      };
      
      console.log('[MenuProvider] Built NavMainData:', navData);
      setNavData(navData);
      
    } catch (error) {
      console.error('[MenuProvider] Failed to build NavMainData:', error);
      // Fallback to mock data
      createMockNavData(dashboardId);
    }
  }, [createMockNavData]);
  
  // Update NavMainData
  const updateNavData = useCallback((data: NavMainData) => {
    setNavData(data);
  }, []);
  
  // Update a sub-menu item
  const updateSubMenuItem = useCallback((groupId: string, parentId: string, item: SubMenuItem) => {
    setMenuItems(prevItems => {
      const newItems = [...prevItems];
      const parentIndex = newItems.findIndex(i => i.id === parentId);
      
      if (parentIndex === -1) {
        console.warn('[MenuProvider] Parent item not found:', parentId);
        return prevItems;
      }
      
      // Clone parent to avoid mutation
      const parent = { ...newItems[parentIndex] };
      
      // Initialize children array if it doesn't exist
      if (!parent.children) {
        parent.children = [];
      }
      
      // Find existing item or add new one
      const existingItemIndex = parent.children.findIndex(c => c.id === item.id);
      if (existingItemIndex !== -1) {
        // Update existing item
        parent.children[existingItemIndex] = { ...item, groupId } as MenuItem;
      } else {
        // Add new item
        parent.children.push({ ...item, groupId } as MenuItem);
      }
      
      // Replace parent in the items array
      newItems[parentIndex] = parent;
      
      return newItems;
    });
  }, []);
  
  // Delete a sub-menu item
  const deleteSubMenuItem = useCallback((groupId: string, parentId: string, itemId: string) => {
    setMenuItems(prevItems => {
      const newItems = [...prevItems];
      const parentIndex = newItems.findIndex(i => i.id === parentId);
      
      if (parentIndex === -1) {
        console.warn('[MenuProvider] Parent item not found:', parentId);
        return prevItems;
      }
      
      // Clone parent to avoid mutation
      const parent = { ...newItems[parentIndex] };
      
      // Remove item from children
      if (parent.children) {
        parent.children = parent.children.filter(c => c.id !== itemId);
      }
      
      // Replace parent in the items array
      newItems[parentIndex] = parent;
      
      return newItems;
    });
  }, []);
  
  // Set current dashboard ID
  const setCurrentDashboardId = useCallback((id: string) => {
    console.log('[MenuProvider] Setting current dashboard ID:', id);
    
    // Update the dashboard ID state
    setCurrentDashboardIdState(id);
    
    // Proactively fetch menu items for this dashboard if they aren't already cached
    if (id && !menuCache.current[id]) {
      console.log('[MenuProvider] Proactively fetching menu items for new dashboard:', id);
      fetchMenuItems(id);
    } else if (id && menuCache.current[id]) {
      console.log('[MenuProvider] Using cached menu items for dashboard:', id);
      setMenuItems(menuCache.current[id]);
      
      // Still build the nav data for the dashboard
      buildNavData(id, menuCache.current[id]);
    }
    
    // For debugging only, to verify the ID was set
    setTimeout(() => {
      console.log('[MenuProvider] Verified current dashboard ID is now:', id);
    }, 50);
  }, [fetchMenuItems, buildNavData]);
  
  // Effect to load menu items when dashboard changes
  useEffect(() => {
    if (currentDashboard?.id) {
      console.log('[MenuProvider] Dashboard changed, loading menu items:', currentDashboard.id);
      setCurrentDashboardId(currentDashboard.id);
      fetchMenuItems(currentDashboard.id);
    }
  }, [currentDashboard, fetchMenuItems, setCurrentDashboardId]);
  
  // Effect to build nav data when menu items change
  useEffect(() => {
    if (currentDashboardId && menuItems.length > 0) {
      console.log('[MenuProvider] Menu items changed, building nav data');
      buildNavData(currentDashboardId, menuItems);
    }
  }, [currentDashboardId, menuItems, buildNavData]);
  
  return (
    <MenuContext.Provider
      value={{
        menuItems,
        loading,
        navData,
        currentDashboardId,
        setCurrentDashboardId,
        updateNavData,
        updateSubMenuItem,
        deleteSubMenuItem
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

// Hook to use MenuContext
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};