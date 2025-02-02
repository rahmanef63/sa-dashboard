// app/api/sidebar/menu/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withAuth, withErrorHandler, ApiError } from '../middleware';
import { adminDbOperations as db } from '@/slices/sidebar/config/admin-db';
import { MenuItem } from '@/shared/types/navigation-types';

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

  return roots;
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

      // Query for menu items
      const query = `
        SELECT menu_items
        FROM dashboards
        WHERE id = $1 AND is_active = true;
      `;
      const result = await db.query(query, [dashboardId]);
      
      if (!result.rows.length) {
        console.log('[Menu API] No menu items found for dashboard:', dashboardId);
        // Return empty array wrapped in response
        return new NextResponse(
          JSON.stringify({ data: [] }),
          { 
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59'
            }
          }
        );
      }

      const menuItems = result.rows[0].menu_items || [];
      console.log('[Menu API] Found menu items:', menuItems);

      // Build menu tree
      const menuTree = buildMenuTree(menuItems);
      console.log('[Menu API] Built menu tree:', menuTree);

      // Return menu tree wrapped in response
      return new NextResponse(
        JSON.stringify({ data: menuTree }),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59'
          }
        }
      );
    });
  });
}
