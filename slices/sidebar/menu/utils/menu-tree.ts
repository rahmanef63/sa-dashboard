import { MenuItem, SubMenuItem } from '@/slices/sidebar/menu/types/';

export function buildMenuTree(items: MenuItem[]): MenuItem[] {
  const itemMap = new Map<string, MenuItem>();
  const rootItems: MenuItem[] = [];

  // First pass: Create MenuItem objects
  items.forEach(item => {
    const menuItem: MenuItem = {
      ...item,
      children: [],
      groupId: item.groupId
    };
    itemMap.set(item.id, menuItem);
  });

  // Second pass: Build the tree structure
  items.forEach(item => {
    if (item.parentId) {
      const parent = itemMap.get(item.parentId);
      if (parent) {
        const childItem: SubMenuItem = {
          ...item,
          parentId: item.parentId,
          path: item.path || '',
          children: []
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
        sortNodes(node.children);
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
      const menuItem: MenuItem = {
        ...item,
        groupId: 'groupId' in item ? item.groupId : item.parentId || '',
        parentId: 'parentId' in item ? item.parentId : undefined,
        children: item.children || []
      };
      flattened.push(menuItem);

      if (item.children && item.children.length > 0) {
        flatten(item.children);
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
          return child;
        }
      }
    }
  }

  return null;
}
