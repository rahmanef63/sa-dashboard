// app/api/sidebar/menu/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withErrorHandler, ApiError } from '../middleware';
import { adminDbOperations as db } from '@/slices/sidebar/config/admin-db';
import { MenuItem, BaseMenuItem } from '@/slices/sidebar/menu/types/';

const CACHE_CONTROL = 'public, s-maxage=10, stale-while-revalidate=59';

/**
 * Builds a hierarchical menu tree from flat menu items
 * @param items - Array of menu items to build tree from
 * @returns Hierarchical menu tree
 */
function buildMenuTree(items: MenuItem[]): MenuItem[] {
  console.log('[Menu API] Building menu tree from', items.length, 'items');
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

  console.log('[Menu API] Built tree with', roots.length, 'root items');
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
    href?: string;
  };
  url_href?: string;
  path?: string;
  children?: DbMenuItem[];
  parent_id?: string;
  is_active?: boolean;
  order?: number;
}

/**
 * GET handler for menu items
 * Fetches menu items for a dashboard with multiple fallback mechanisms
 */
export async function GET(request: NextRequest) {
  return withAuth(request, async (req) => {
    return withErrorHandler(async () => {
      const startTime = Date.now();
      const { searchParams } = new URL(request.url);
      const dashboardId = searchParams.get('dashboardId');

      if (!dashboardId) {
        console.error('[Menu API] Missing dashboard ID in request');
        throw new ApiError('Dashboard ID is required', 400);
      }

      console.log(`[Menu API] Fetching menu items for dashboard: ${dashboardId}`);

      try {
        // Try to get menu items from menu_items table
        const menuItemsQuery = `
          SELECT 
            id,
            title as name,
            icon,
            url,
            parent_id as "parentId",
            order_index as "order",
            is_active as "isActive"
          FROM menu_items
          WHERE dashboard_id = $1
          ORDER BY 
            COALESCE(parent_id, id),
            order_index;
        `;
        
        let menuItems = [];
        let fetchSource = 'unknown';
        
        try {
          console.log(`[Menu API] Querying menu_items table for dashboard: ${dashboardId}`);
          
          // Add a timeout for the database query to prevent hanging
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Database query timeout')), 5000);
          });
          
          // Race between the actual query and the timeout
          const menuItemsResult = await Promise.race([
            db.query(menuItemsQuery, [dashboardId]),
            timeoutPromise
          ]) as any;
          
          if (menuItemsResult && menuItemsResult.rows) {
            const rowCount = menuItemsResult.rows.length;
            console.log(`[Menu API] Found ${rowCount} items in menu_items table for dashboard: ${dashboardId}`);
            fetchSource = 'menu_items_table';
            
            if (rowCount > 0) {
              menuItems = menuItemsResult.rows.map((item: any) => ({
                ...item,
                url: item.url || { path: '/' }
              }));
            } else {
              console.log(`[Menu API] No items found in menu_items table for dashboard: ${dashboardId}`);
            }
          }
        } catch (menuItemsError) {
          console.error('[Menu API] Error fetching from menu_items table:', 
            menuItemsError instanceof Error ? menuItemsError.message : 'Unknown error');
          
          // Log additional details for debugging
          if (menuItemsError instanceof Error && menuItemsError.stack) {
            console.debug('[Menu API] Error stack:', menuItemsError.stack);
          }
        }
        
        // If no menu items were found, use mock data
        if (!menuItems || menuItems.length === 0) {
          console.log('[Menu API] No menu items found, using mock data');
          fetchSource = 'mock_data';
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
            path: item.url?.path || item.url?.href || item.url_href || item.path || '',
            label: item.name || item.title || ''
          },
          parentId: item.parent_id,
          order: item.order || 0,
          isActive: item.is_active || true
        }));
        
        console.log(`[Menu API] Transformed ${transformedItems.length} menu items from ${fetchSource}`);
        
        // Build menu tree
        const menuTree = buildMenuTree(transformedItems);
        
        const elapsedTime = Date.now() - startTime;
        console.log(`[Menu API] Menu processing complete in ${elapsedTime}ms for dashboard: ${dashboardId}`);
        
        // Return menu tree wrapped in response
        return new NextResponse(
          JSON.stringify({ 
            data: menuTree,
            success: true,
            source: fetchSource,
            timestamp: new Date().toISOString(),
            processingTime: elapsedTime
          }),
          { 
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': CACHE_CONTROL
            }
          }
        );
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const errorStack = error instanceof Error ? error.stack : '';
        
        console.error('[Menu API] Error processing menu items:', errorMessage);
        if (errorStack) {
          console.debug('[Menu API] Error stack:', errorStack);
        }
        
        // Return empty array on error with detailed error info
        return new NextResponse(
          JSON.stringify({ 
            data: [],
            success: false,
            error: errorMessage,
            timestamp: new Date().toISOString(),
            dashboardId
          }),
          { 
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate' // Don't cache errors
            }
          }
        );
      }
    });
  });
}
