import { MenuItem, MenuItemWithChildren } from '@/shared/types/navigation-types';

export function buildMenuTree(items: MenuItem[]): MenuItemWithChildren[] {
  // Create a map for O(1) lookups
  const map = new Map<string, MenuItemWithChildren>();
  const roots: MenuItemWithChildren[] = [];

  // First pass: Create all nodes
  items.forEach(item => {
    map.set(item.id, {
      ...item,
      children: []
    });
  });

  // Second pass: Build the tree
  items.forEach(item => {
    const node = map.get(item.id)!;
    
    if (item.parentId) {
      const parent = map.get(item.parentId);
      if (parent) {
        if (!parent.children) {
          parent.children = [];
        }
        parent.children.push(node);
      } else {
        // If parent not found, treat as root
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  });

  // Sort children by orderIndex if available
  const sortNodes = (nodes: MenuItemWithChildren[]) => {
    nodes.sort((a, b) => {
      const orderA = a.orderIndex ?? 0;
      const orderB = b.orderIndex ?? 0;
      return orderA - orderB;
    });

    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        sortNodes(node.children);
      }
    });
  };

  sortNodes(roots);
  return roots;
}

export function flattenMenuTree(tree: MenuItemWithChildren[]): MenuItem[] {
  const items: MenuItem[] = [];
  
  const traverse = (node: MenuItemWithChildren, parentId?: string) => {
    const item: MenuItem = {
      ...node,
      parentId
    };
    delete (item as any).children;
    items.push(item);

    if (node.children) {
      node.children.forEach(child => traverse(child, node.id));
    }
  };

  tree.forEach(node => traverse(node));
  return items;
}
