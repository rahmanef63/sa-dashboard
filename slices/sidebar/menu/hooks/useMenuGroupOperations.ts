import { useCallback } from 'react';
import { MenuItem, NavMainData, Group } from '@/slices/sidebar/menu/types/';
import { saveMenuItems, saveNavData, removeDuplicateItems, convertToMenuItem } from '../nav-main/context/utils/menu.utils';

interface UseMenuGroupOperationsProps {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  navData: NavMainData;
  setNavData: React.Dispatch<React.SetStateAction<NavMainData>>;
  timeStampRef: React.MutableRefObject<{ [key: string]: number }>;
}

export function useMenuGroupOperations({
  menuItems,
  setMenuItems,
  navData,
  setNavData,
  timeStampRef,
}: UseMenuGroupOperationsProps) {
  const addMenuItem = useCallback((item: MenuItem) => {
    const convertedItem = convertToMenuItem(item);
    const updatedNavData: NavMainData = JSON.parse(JSON.stringify(navData));
    const defaultGroupIndex = updatedNavData.groups.findIndex((group: Group) => group.label.id === 'default');
    
    if (!convertedItem.groupId && defaultGroupIndex !== -1) {
      updatedNavData.groups[defaultGroupIndex].items.push({
        ...convertedItem,
        groupId: 'default'
      });
    } else {
      const groupIndex = updatedNavData.groups.findIndex((group: Group) => group.label.id === convertedItem.groupId);
      if (groupIndex !== -1) {
        updatedNavData.groups[groupIndex].items.push(convertedItem);
      } else {
        updatedNavData.groups[defaultGroupIndex].items.push({
          ...convertedItem,
          groupId: 'default'
        });
      }
    }
    
    setNavData(updatedNavData);
    const newItems: MenuItem[] = [...menuItems, convertedItem];
    setMenuItems(newItems);
    saveMenuItems([...menuItems, item]);
  }, [menuItems, navData, setMenuItems, setNavData]);

  const handleChangeGroup = useCallback((itemId: string, newGroupId: string) => {
    const timestamp = Date.now();
    const lastTimestamp = timeStampRef.current[itemId] || 0;
    
    if (timestamp - lastTimestamp < 500) {
      return;
    }
    
    timeStampRef.current[itemId] = timestamp;
    
    const item = menuItems.find(item => item.id === itemId);
    if (!item) return;
    
    const updatedItem = { ...item, groupId: newGroupId };
    const updatedNavData = {
      ...navData,
      groups: navData.groups.map((group: Group) => ({
        ...group,
        items: group.label.id === newGroupId
          ? [...group.items, updatedItem]
          : group.items.filter((item: MenuItem) => item.id !== itemId)
      }))
    };
    
    const cleanedNavData = removeDuplicateItems(updatedNavData);
    setNavData(cleanedNavData);
    saveNavData(cleanedNavData);
  }, [menuItems, navData, setNavData, timeStampRef]);

  return {
    addMenuItem,
    handleChangeGroup,
  };
}
