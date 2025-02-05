import { useState, useCallback } from 'react';
import { NavMainData, MenuItem, SubMenuItem, GroupLabel } from '@/slices/sidebar/menu/types/';
import { generateId } from '../../utils';

const STORAGE_KEY = 'navMainData';

export function useMenuState(initialData?: NavMainData) {
  const [navData, setNavData] = useState<NavMainData>(() => {
    if (initialData) return initialData;
    
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : { groups: [] };
  });

  const saveData = useCallback((newData: NavMainData) => {
    setNavData(newData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
  }, []);

  const updateMenuItem = useCallback((updatedItem: MenuItem) => {
    setNavData(prev => {
      const newGroups = prev.groups.map(group => {
        if (!group.items.some(item => item.id === updatedItem.id)) return group;
        
        return {
          ...group,
          items: group.items.map(item => 
            item.id === updatedItem.id ? updatedItem : item
          ).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
        };
      });

      const newData = { ...prev, groups: newGroups };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const deleteMenuItem = useCallback((groupId: string, itemId: string) => {
    setNavData(prev => {
      const newGroups = prev.groups.map(group => {
        if (group.label.id !== groupId) return group;
        
        return {
          ...group,
          items: group.items.filter(item => item.id !== itemId)
        };
      });

      const newData = { ...prev, groups: newGroups };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const addMenuItem = useCallback((groupId: string, newItem: Omit<MenuItem, 'id'>) => {
    setNavData(prev => {
      const newGroups = prev.groups.map(group => {
        if (group.label.id !== groupId) return group;
        
        const itemWithId: MenuItem = {
          ...newItem,
          id: generateId()
        };

        return {
          ...group,
          items: [...group.items, itemWithId].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
        };
      });

      const newData = { ...prev, groups: newGroups };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const addSubMenuItem = useCallback((parentId: string, newItem: Omit<SubMenuItem, 'id'>) => {
    setNavData(prev => {
      const newGroups = prev.groups.map(group => {
        const parentItem = group.items.find(item => item.id === parentId);
        if (!parentItem) return group;

        const subItemWithId: SubMenuItem = {
          ...newItem,
          id: generateId()
        };

        const updatedParentItem = {
          ...parentItem,
          items: [...(parentItem.items || []), subItemWithId]
        };

        return {
          ...group,
          items: group.items.map(item => 
            item.id === parentId ? updatedParentItem : item
          )
        };
      });

      const newData = { ...prev, groups: newGroups };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const updateGroupLabel = useCallback((groupId: string, updatedLabel: Omit<GroupLabel, 'id'>) => {
    setNavData(prev => {
      const newGroups = prev.groups.map(group => {
        if (group.label.id !== groupId) return group;
        
        return {
          ...group,
          label: {
            ...updatedLabel,
            id: groupId
          }
        };
      });

      const newData = { ...prev, groups: newGroups };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const toggleMenuItem = useCallback((itemId: string) => {
    setNavData(prev => {
      const newGroups = prev.groups.map(group => {
        return {
          ...group,
          items: group.items.map(item => 
            item.id === itemId ? { ...item, isCollapsible: !item.isCollapsible } : item
          ).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
        };
      });

      const newData = { ...prev, groups: newGroups };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const findItemById = useCallback((itemId: string): MenuItem | undefined => {
    return navData.groups.reduce<MenuItem | undefined>((found, group) => {
      if (found) return found;
      return group.items.find(item => item.id === itemId);
    }, undefined);
  }, [navData]);

  const addSubMenuItemById = useCallback((itemId: string, newSubItem: Omit<SubMenuItem, 'id'>) => {
    setNavData(prev => {
      const parentItem = findItemById(itemId);
      if (!parentItem) return prev;

      const newGroups = prev.groups.map(group => {
        if (!group.items.some(item => item.id === itemId)) return group;

        return {
          ...group,
          items: group.items.map(item => {
            if (item.id !== itemId) return item;
            return {
              ...item,
              items: [...(item.items || []), { ...newSubItem, id: generateId() }]
            };
          })
        };
      });

      const newData = { ...prev, groups: newGroups };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, [findItemById]);

  return {
    navData,
    saveData,
    updateMenuItem,
    deleteMenuItem,
    addMenuItem,
    addSubMenuItem,
    updateGroupLabel,
    toggleMenuItem,
    addSubMenuItemById
  };
}
