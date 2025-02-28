import { MenuItem, SubMenuItem } from '@/slices/sidebar/menu/types/';

export function buildMenuTree(items: MenuItem[]): MenuItem[] {
  const itemMap = new Map<string, MenuItem>();
  const rootItems: MenuItem[] = [];

  // First pass: Create MenuItem objects
  items.forEach(item => {
    const menuItem: MenuItem = {
      id: item.id,
      name: item.name,
      url: item.url,
      groupId: item.groupId || '', // Ensure groupId is always a string
      parentId: item.parentId || undefined,
      children: [],
      // Copy remaining properties from the original item
      ...Object.entries(item)
        .filter(([key]) => !['id', 'name', 'url', 'groupId', 'parentId', 'children'].includes(key))
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
    };
    itemMap.set(item.id, menuItem);
  });

  // Second pass: Build the tree structure
  items.forEach(item => {
    if (item.parentId) {
      const parent = itemMap.get(item.parentId);
      if (parent) {
        const childItem: SubMenuItem = {
          id: item.id,
          name: item.name,
          url: item.url,
          parentId: item.parentId || '', // Ensure parentId is always a string for SubMenuItem
          path: item.path || '',
          children: [],
          // Copy remaining properties from the original item
          ...Object.entries(item)
            .filter(([key]) => !['id', 'name', 'url', 'parentId', 'path', 'children'].includes(key))
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
        };
        parent.children = parent.children || [];
        parent.children.push(childItem);
      }
    } else {
      const rootItem = itemMap.get(item.id);
      if (rootItem) {
        rootItems.push(rootItem);
      }
    }
  });

  // Sort children by orderIndex if available
  const sortNodes = (nodes: (MenuItem | SubMenuItem)[]) => {
    nodes.sort((a, b) => {
      const orderA = 'orderIndex' in a ? a.orderIndex ?? 0 : 0;
      const orderB = 'orderIndex' in b ? b.orderIndex ?? 0 : 0;
      return orderA - orderB;
    });

    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        sortNodes(node.children as (MenuItem | SubMenuItem)[]);
      }
    });
  };

  sortNodes(rootItems);
  return rootItems;
}

export function flattenMenuTree(tree: MenuItem[]): MenuItem[] {
  const flattened: MenuItem[] = [];

  function flatten(items: (MenuItem | SubMenuItem)[]) {
    items.forEach(item => {
      // Use type assertion to ensure TypeScript knows the types
      interface MenuItemWithGroupId {
        groupId: string;
      }
      
      interface SubMenuItemWithParentId {
        parentId: string;
      }
      
      // For SubMenuItems, extract the groupId from the parent if available
      let itemGroupId = '';
      if ('groupId' in item) {
        // Type assertion to tell TypeScript this is a MenuItem with a groupId property
        const menuItemWithGroup = item as MenuItemWithGroupId;
        itemGroupId = menuItemWithGroup.groupId;
      } else if ('parentId' in item && item.parentId) {
        // Type assertion to tell TypeScript this is a SubMenuItem with a parentId property
        const subMenuItem = item as SubMenuItemWithParentId;
        itemGroupId = subMenuItem.parentId;
      }

      const menuItem: MenuItem = {
        id: item.id,
        name: item.name,
        url: item.url,
        groupId: itemGroupId, // Using the properly extracted groupId
        parentId: 'parentId' in item ? item.parentId || undefined : undefined,
        children: item.children || [],
        // Copy remaining properties from the original item
        ...Object.entries(item)
          .filter(([key]) => !['id', 'name', 'url', 'groupId', 'parentId', 'children'].includes(key))
          .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
      };
      flattened.push(menuItem);

      if (item.children && item.children.length > 0) {
        flatten(item.children as (MenuItem | SubMenuItem)[]);
      }
    });
  }

  flatten(tree);
  return flattened;
}

export function findMenuItem(tree: MenuItem[], id: string): MenuItem | SubMenuItem | null {
  for (const item of tree) {
    if (item.id === id) {
      return item;
    }

    if (item.children) {
      for (const child of item.children) {
        if (child.id === id) {
          return child as (MenuItem | SubMenuItem);
        }
      }
    }
  }

  return null;
}
