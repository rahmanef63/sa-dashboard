import { useState, useCallback } from 'react';
import { NavMainData, MenuItem, SubMenuItem, GroupLabel } from 'shared/types/navigation-types';
import { generateId } from '../utils';

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
          ).sort((a, b) => (a.order || 0) - (b.order || 0))
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

  const updateSubMenuItem = useCallback((
    groupId: string,
    parentId: string,
    updatedSubItem: SubMenuItem
  ) => {
    setNavData(prev => {
      const newGroups = prev.groups.map(group => {
        if (group.label.id !== groupId) return group;

        return {
          ...group,
          items: group.items.map(item => {
            if (item.id !== parentId) return item;

            return {
              ...item,
              items: (item.items || [])
                .map(subItem => subItem.id === updatedSubItem.id ? updatedSubItem : subItem)
                .sort((a, b) => (a.order || 0) - (b.order || 0))
            };
          })
        };
      });

      const newData = { ...prev, groups: newGroups };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const deleteSubMenuItem = useCallback((
    groupId: string,
    parentId: string,
    subItemId: string
  ) => {
    setNavData(prev => {
      const newGroups = prev.groups.map(group => {
        if (group.label.id !== groupId) return group;

        return {
          ...group,
          items: group.items.map(item => {
            if (item.id !== parentId) return item;

            return {
              ...item,
              items: (item.items || []).filter(subItem => subItem.id !== subItemId)
            };
          })
        };
      });

      const newData = { ...prev, groups: newGroups };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const updateGroupLabel = useCallback((updatedLabel: GroupLabel) => {
    setNavData(prev => {
      const newGroups = prev.groups.map(group =>
        group.label.id === updatedLabel.id
          ? { ...group, label: updatedLabel }
          : group
      ).sort((a, b) => ((a.label.order || 0) - (b.label.order || 0)));

      const newData = { ...prev, groups: newGroups };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  const deleteGroup = useCallback((groupId: string) => {
    setNavData(prev => {
      const newData = {
        ...prev,
        groups: prev.groups.filter(group => group.label.id !== groupId)
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      return newData;
    });
  }, []);

  return {
    navData,
    updateMenuItem,
    deleteMenuItem,
    updateSubMenuItem,
    deleteSubMenuItem,
    updateGroupLabel,
    deleteGroup,
    saveData
  };
}
