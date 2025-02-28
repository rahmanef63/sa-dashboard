// app/api/sidebar/menu/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withErrorHandler, ApiError } from '../middleware';
import { adminDbOperations as db } from '@/slices/sidebar/config/admin-db';
import { MenuItem, BaseMenuItem } from '@/slices/sidebar/menu/types/';

const CACHE_CONTROL = 'public, s-maxage=10, stale-while-revalidate=59';

function buildMenuTree(items: MenuItem[]): MenuItem[] {
  const itemMap = new Map<string, MenuItem>();
  const roots: MenuItem[] = [];

  // First pass: create map of items and ensure children arrays
  items.forEach(item => {
    itemMap.set(item.id, {
      ...item,
      children: []
    });
  });

  // Second pass: build tree structure
  items.forEach(item => {
    const mappedItem = itemMap.get(item.id)!;
    if (item.parentId && itemMap.has(item.parentId)) {
      const parent = itemMap.get(item.parentId)!;
      parent.children!.push(mappedItem);
    } else {
      roots.push(mappedItem);
    }
  });

  // Sort by order
  const sortByOrder = (a: BaseMenuItem, b: BaseMenuItem) => {
    const aMenu = a as MenuItem;
    const bMenu = b as MenuItem;
    if (!aMenu.groupId && !bMenu.groupId) {
      return (aMenu.order || 0) - (bMenu.order || 0);
    } else if (!aMenu.groupId) {
      return 1;
    } else if (!bMenu.groupId) {
      return -1;
    } else {
      return 0;
    }
  };

  // Sort roots and children
  roots.sort(sortByOrder);
  roots.forEach(root => {
    if (root.children) {
      root.children.sort(sortByOrder);
    }
  });

  return roots;
}

// Define the interface for raw menu items from the database
interface DbMenuItem {
  id: string;
  name?: string;
  title?: string;
  icon?: string;
  url?: {
    path?: string;
  };
  url_href?: string;
  path?: string;
  children?: DbMenuItem[];
  parent_id?: string;
  is_active?: boolean;
  order?: number;
}

export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    return withErrorHandler(async () => {
      const { searchParams } = new URL(request.url);
      const dashboardId = searchParams.get('dashboardId');

      if (!dashboardId) {
        throw new ApiError('Dashboard ID is required', 400);
      }

      console.log('[Menu API] Fetching menu items for dashboard:', dashboardId);

      try {
        // Try to get menu items from dashboards.menu_items column first
        const dashboardQuery = `
          SELECT menu_items
          FROM dashboards
          WHERE id = $1
          LIMIT 1;
        `;
        
        let menuItems = [];
        
        try {
          const dashboardResult = await db.query(dashboardQuery, [dashboardId]);
          
          if (dashboardResult.rows.length && dashboardResult.rows[0].menu_items) {
            console.log('[Menu API] Found menu items in dashboards table');
            const menuItemsJson = dashboardResult.rows[0].menu_items;
            
            if (Array.isArray(menuItemsJson)) {
              menuItems = menuItemsJson;
            } else if (typeof menuItemsJson === 'string') {
              menuItems = JSON.parse(menuItemsJson);
            }
          } else {
            console.log('[Menu API] No menu items found in dashboards table');
          }
        } catch (dashboardError) {
          console.error('[Menu API] Error fetching from dashboards table:', dashboardError);
          
          // If dashboards.menu_items doesn't exist, try the separate menu_items table
          if (dashboardError instanceof Error && 
              'code' in dashboardError && 
              dashboardError.code === '42703') { // Column does not exist
            console.log('[Menu API] Trying menu_items table instead');
            
            // Query the separate menu_items table as fallback
            const menuItemsQuery = `
              SELECT 
                id,
                dashboard_id,
                title as name,
                icon,
                url,
                parent_id,
                order_index as "order",
                is_active
              FROM menu_items
              WHERE dashboard_id = $1
              ORDER BY 
                COALESCE(parent_id, id),
                order_index;
            `;
            
            try {
              const menuItemsResult = await db.query(menuItemsQuery, [dashboardId]);
              if (menuItemsResult.rows.length) {
                console.log('[Menu API] Found items in menu_items table:', menuItemsResult.rows.length);
                menuItems = menuItemsResult.rows;
              }
            } catch (menuItemsError) {
              console.error('[Menu API] Error fetching from menu_items table:', menuItemsError);
            }
          }
        }
        
        // If no menu items were found, use mock data
        if (!menuItems || menuItems.length === 0) {
          console.log('[Menu API] No menu items found, using mock data');
          menuItems = [
            {
              id: 'menu1',
              name: 'Dashboard',
              icon: 'layout-dashboard',
              url: {
                path: '/dashboard',
                label: 'Dashboard'
              },
              parentId: null,
              order: 1,
              isActive: true
            },
            {
              id: 'menu2',
              name: 'Analytics',
              icon: 'chart-bar',
              url: {
                path: '/analytics',
                label: 'Analytics'
              },
              parentId: null,
              order: 2,
              isActive: true
            },
            {
              id: 'menu3',
              name: 'Reports',
              icon: 'file-report',
              url: {
                path: '/reports',
                label: 'Reports'
              },
              parentId: 'menu2',
              order: 1,
              isActive: true
            }
          ];
        }
        
        // Transform menu items to match our expected interface
        const transformedItems = menuItems.map((item: DbMenuItem) => ({
          id: item.id,
          name: item.name || item.title || '', // Handle both column names
          icon: item.icon,
          groupId: dashboardId,
          url: {
            path: item.url?.path || item.url_href || item.path || '',
            label: item.name || item.title || ''
          },
          parentId: item.parent_id,
          order: item.order || 0,
          isActive: item.is_active || true
        }));
        
        console.log('[Menu API] Transformed menu items:', transformedItems);
        
        // Build menu tree
        const menuTree = buildMenuTree(transformedItems);
        console.log('[Menu API] Built menu tree:', menuTree);
        
        // Return menu tree wrapped in response
        return new NextResponse(
          JSON.stringify({ data: menuTree }),
          { 
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': CACHE_CONTROL
            }
          }
        );
      } catch (error) {
        console.error('[Menu API] Error processing menu items:', error);
        
        // Return empty array on error
        return new NextResponse(
          JSON.stringify({ 
            data: [],
            error: 'Failed to process menu items'
          }),
          { 
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': CACHE_CONTROL
            }
          }
        );
      }
    });
  });
}
