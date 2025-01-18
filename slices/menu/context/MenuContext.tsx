"use client"

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { MenuItem, NavMainData, SubMenuItem, GroupLabel } from 'shared/types/navigation-types'

type MenuContextType = {
  menuItems: MenuItem[]
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>
  addMenuItem: (item: MenuItem) => void
  updateMenuItem: (item: MenuItem) => void
  deleteMenuItem: (id: string) => void
  updateSubMenuItem: (groupId: string, parentId: string, subItem: SubMenuItem) => void
  deleteSubMenuItem: (groupId: string, parentId: string, subItemId: string) => void
  updateItemCollapsible: (itemId: string, isCollapsible: boolean) => void
  navData: NavMainData
  updateNavData: (newNavData: NavMainData) => void
  handleChangeGroup: (itemId: string, newGroupId: string) => void
  addGroupLabel: (label: GroupLabel) => void
  updateGroupLabel: (labelId: string, updatedLabel: GroupLabel) => void
  deleteGroupLabel: (labelId: string) => void
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [navData, setNavData] = useState<NavMainData>({ groups: [] })
  const timeStampRef = useRef<{ [key: string]: number }>({});

  useEffect(() => {
    const storedItems = localStorage.getItem('userMenuItems')
    const storedNavData = localStorage.getItem('navMainData')
    const defaultGroup = {
      label: { id: 'default', title: 'Default Group' },
      items: [] as MenuItem[]
    }
    
    let initialNavData: NavMainData = { groups: [defaultGroup] };
    
    if (storedNavData) {
      try {
        const parsedNavData = JSON.parse(storedNavData) as NavMainData;
        initialNavData = parsedNavData;
      } catch (error) {
        console.error('Error parsing stored nav data:', error);
      }
    }
    
    if (storedItems) {
      const parsedItems = JSON.parse(storedItems) as MenuItem[];
      setMenuItems(parsedItems);
      
      // Add stored items to their respective groups or default group
      parsedItems.forEach((item: MenuItem) => {
        if (!item.groupId) {
          initialNavData.groups[0].items.push(item);
        } else {
          const groupIndex = initialNavData.groups.findIndex(group => group.label.id === item.groupId);
          if (groupIndex !== -1) {
            initialNavData.groups[groupIndex].items.push(item);
          } else {
            initialNavData.groups[0].items.push(item);
          }
        }
      });
    }
    
    setNavData(initialNavData);
  }, [])

  const saveMenuItems = (items: MenuItem[]) => {
    setMenuItems(items)
    localStorage.setItem('userMenuItems', JSON.stringify(items))
  }

  const addMenuItem = (item: MenuItem) => {
    const updatedNavData: NavMainData = JSON.parse(JSON.stringify(navData));
    const defaultGroupIndex = updatedNavData.groups.findIndex(group => group.label.id === 'default');
    
    // Add the item to the default group if no group is specified
    if (!item.groupId && defaultGroupIndex !== -1) {
      updatedNavData.groups[defaultGroupIndex].items.push({
        ...item,
        groupId: 'default'
      });
    } else {
      const groupIndex = updatedNavData.groups.findIndex(group => group.label.id === item.groupId);
      if (groupIndex !== -1) {
        updatedNavData.groups[groupIndex].items.push(item);
      } else {
        updatedNavData.groups[defaultGroupIndex].items.push({
          ...item,
          groupId: 'default'
        });
      }
    }
    
    setNavData(updatedNavData);
    const newItems: MenuItem[] = [...menuItems, item];
    setMenuItems(newItems);
    localStorage.setItem('userMenuItems', JSON.stringify(newItems));
  }

  const updateMenuItem = (updatedItem: MenuItem) => {
    const newItems: MenuItem[] = menuItems.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    saveMenuItems(newItems);
    
    const updatedNavData: NavMainData = {
      ...navData,
      groups: navData.groups.map(group => ({
        ...group,
        items: group.items.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      }))
    };
    setNavData(updatedNavData);
  }

  const deleteMenuItem = (id: string) => {
    const updatedNavData = {
      ...navData,
      groups: navData.groups.map(group => ({
        ...group,
        items: group.items.filter(item => item.id !== id)
      }))
    };
    setNavData(updatedNavData);
    localStorage.setItem('navData', JSON.stringify(updatedNavData));

    const newItems = menuItems.filter((item) => item.id !== id);
    setMenuItems(newItems);
    localStorage.setItem('userMenuItems', JSON.stringify(newItems));

    // Reset the timestamp for the deleted item
    Object.keys(timeStampRef.current).forEach(key => {
      if (key.includes(id)) {
        delete timeStampRef.current[key];
      }
    });
  }

  const updateNavData = (newNavData: NavMainData) => {
    // Remove duplicate items - ensure each item exists only in one group
    const updatedNavData = {
      groups: newNavData.groups.map((group, groupIndex) => ({
        ...group,
        items: group.items.filter(item => {
          // Check if this item exists in any previous group
          const existsInPreviousGroup = newNavData.groups
            .slice(0, groupIndex)
            .some(prevGroup => 
              prevGroup.items.some(prevItem => prevItem.id === item.id)
            );
          return !existsInPreviousGroup;
        }).map(item => ({
          ...item,
          groupId: group.label.id
        }))
      }))
    };

    setNavData(updatedNavData);
    localStorage.setItem('navMainData', JSON.stringify(updatedNavData));
    
    // Update menuItems to stay in sync - flatten all groups into a single array
    const allItems = updatedNavData.groups.flatMap(group => 
      group.items.map(item => ({
        ...item,
        groupId: group.label.id
      }))
    );
    setMenuItems(allItems);
    localStorage.setItem('userMenuItems', JSON.stringify(allItems));
  };

  const handleChangeGroup = (itemId: string, newGroupId: string) => {
    const updatedNavData = { ...navData };
    let movedItem: MenuItem | undefined;

    // Remove item from old group
    updatedNavData.groups = updatedNavData.groups.map(group => ({
      ...group,
      items: group.items.filter(item => {
        if (item.id === itemId) {
          movedItem = item;
          return false;
        }
        return true;
      })
    }));

    // Add item to new group
    if (movedItem) {
      const targetGroupIndex = updatedNavData.groups.findIndex(g => g.label.id === newGroupId);
      if (targetGroupIndex !== -1) {
        movedItem.groupId = newGroupId;
        updatedNavData.groups[targetGroupIndex].items.push(movedItem);
      }
    }

    updateNavData(updatedNavData);
  };

  const updateSubMenuItem = (groupId: string, parentId: string, updatedSubItem: SubMenuItem) => {
    const updatedNavData = {
      ...navData,
      groups: navData.groups.map(group => 
        group.label.id === groupId
          ? {
              ...group,
              items: group.items.map(item => 
                item.id === parentId
                  ? {
                      ...item,
                      items: item.items?.map(subItem => 
                        subItem.id === updatedSubItem.id ? updatedSubItem : subItem
                      )
                    }
                  : item
              )
            }
          : group
      )
    }
    updateNavData(updatedNavData)
  }

  const deleteSubMenuItem = (groupId: string, parentId: string, subItemId: string) => {
    const updatedNavData = {
      ...navData,
      groups: navData.groups.map(group => 
        group.label.id === groupId
          ? {
              ...group,
              items: group.items.map(item => 
                item.id === parentId
                  ? {
                      ...item,
                      items: item.items?.filter(subItem => subItem.id !== subItemId)
                    }
                  : item
              )
            }
          : group
      )
    }
    updateNavData(updatedNavData)
  }

  const updateItemCollapsible = (itemId: string, isCollapsible: boolean) => {
    const updatedNavData = { ...navData };
    let itemUpdated = false;

    updatedNavData.groups = updatedNavData.groups.map(group => {
      const updatedItems = group.items.map(item => {
        if (item.id === itemId) {
          itemUpdated = true;
          return { ...item, isCollapsible };
        }
        return item;
      });
      return { ...group, items: updatedItems };
    });

    if (itemUpdated) {
      setNavData(updatedNavData);
      localStorage.setItem('navMainData', JSON.stringify(updatedNavData));
    }
  };

  const addGroupLabel = (label: GroupLabel) => {
    const updatedNavData = { ...navData };
    
    // Validate label
    if (updatedNavData.groups.some(g => g.label.title === label.title)) {
      throw new Error('A group with this title already exists');
    }
    
    // Add new group with empty items array
    updatedNavData.groups.push({
      label,
      items: []
    });
    
    updateNavData(updatedNavData);
  };

  const updateGroupLabel = (labelId: string, updatedLabel: GroupLabel) => {
    const updatedNavData = { ...navData };
    
    // Validate updated label
    if (updatedNavData.groups.some(g => g.label.id !== labelId && g.label.title === updatedLabel.title)) {
      throw new Error('A group with this title already exists');
    }
    
    // Update the label
    updatedNavData.groups = updatedNavData.groups.map(group => 
      group.label.id === labelId 
        ? { ...group, label: updatedLabel }
        : group
    );
    
    updateNavData(updatedNavData);
  };

  const deleteGroupLabel = (labelId: string) => {
    const updatedNavData = { ...navData };
    
    // Don't allow deleting the default group
    if (labelId === 'default') {
      throw new Error('Cannot delete the default group');
    }
    
    // Move items from deleted group to default group
    const defaultGroup = updatedNavData.groups.find(g => g.label.id === 'default');
    const groupToDelete = updatedNavData.groups.find(g => g.label.id === labelId);
    
    if (defaultGroup && groupToDelete) {
      defaultGroup.items.push(...groupToDelete.items.map(item => ({
        ...item,
        groupId: 'default'
      })));
    }
    
    // Remove the group
    updatedNavData.groups = updatedNavData.groups.filter(g => g.label.id !== labelId);
    
    updateNavData(updatedNavData);
  };

  return (
    <MenuContext.Provider value={{
      menuItems,
      setMenuItems,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      updateSubMenuItem,
      deleteSubMenuItem,
      updateItemCollapsible,
      navData,
      updateNavData,
      handleChangeGroup,
      addGroupLabel,
      updateGroupLabel,
      deleteGroupLabel,
    }}>
      {children}
    </MenuContext.Provider>
  )
}

export const useMenu = () => {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider')
  }
  return context
}
