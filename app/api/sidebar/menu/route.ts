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
  try {
    const { searchParams } = new URL(request.url);
    const dashboardId = searchParams.get('dashboardId');

    console.log('[Debug] Menu API: Fetching items for dashboard:', dashboardId);

    if (!dashboardId || dashboardId === 'undefined') {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    const result = await adminDbOperations.getMenuItems(dashboardId);
    console.log('[Debug] Menu API: Found items:', result.rows.length);

    // Transform the data
    const menuItems = result.rows.map((item: MenuItemSchema) => ({
      ...transformToCamelCase(item),
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
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}
