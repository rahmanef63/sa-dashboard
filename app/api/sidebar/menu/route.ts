import { NextRequest, NextResponse } from 'next/server';
import { adminDbOperations } from '@/slices/sidebar/config/admin-db';
import { type MenuItemSchema, type MenuItemWithChildren, transformToCamelCase } from '@/shared/types/navigation-types';

function buildMenuTree(items: MenuItemWithChildren[]): MenuItemWithChildren[] {
  const itemMap = new Map<string, MenuItemWithChildren>();
  const roots: MenuItemWithChildren[] = [];

  // First pass: create map of items
  items.forEach(item => {
    itemMap.set(item.id, { ...item, children: [] });
  });

  // Second pass: build tree structure
  items.forEach(item => {
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
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  let dashboardId = searchParams.get('dashboardId');

  // If the dashboardId is 'main', resolve it to a valid UUID using the default dashboard
  if (dashboardId === 'main') {
    console.log('[Debug] Dashboard id is "main", resolving to default dashboard id');
    const defaultDashboardResult = await adminDbOperations.getDefaultDashboard();
    if (defaultDashboardResult.rows && defaultDashboardResult.rows.length > 0) {
      dashboardId = defaultDashboardResult.rows[0].id;
      console.log('[Debug] Resolved default dashboard id:', dashboardId);
    } else {
      console.warn('[Debug] No default dashboard found for "main"');
      return NextResponse.json({ success: true, data: [] });
    }
  }

  if (!dashboardId || dashboardId === 'undefined') {
    console.log('[Debug] Menu API: No dashboard ID provided, returning empty data');
    return NextResponse.json({
      success: true,
      data: []
    });
  }

  console.log('[Debug] Menu API: Fetching items for dashboard:', dashboardId);

  try {
    const result = await adminDbOperations.getMenuItems(dashboardId);
    console.log('[Debug] Menu API: Found items:', result.rows.length);

    // Transform the data and ensure proper typing
    const menuItems = result.rows.map(item => ({
      ...transformToCamelCase(item as MenuItemSchema),
      children: []
    })) as MenuItemWithChildren[];
    
    // Build the menu tree
    const menuTree = buildMenuTree(menuItems);
    console.log('[Debug] Menu API: Built menu tree with roots:', menuTree.length);

    return NextResponse.json({
      success: true,
      data: menuTree
    });
  } catch (error: any) {
    console.error('[Menu API] GET Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch menu items'
    }, { status: 500 });
  }
}
