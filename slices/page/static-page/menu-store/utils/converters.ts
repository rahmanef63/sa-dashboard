import { MenuItem, SubMenuItem } from 'shared/types/navigation-types'
import { MenuItem as NavMainMenuItem, SubMenuItem as NavMainSubMenuItem } from '@/slices/menu/nav-main/types'

export const convertSharedToNavMain = (item: MenuItem): NavMainMenuItem => {
  const navMainItem: NavMainMenuItem = {
    id: item.id,
    title: item.title,
    icon: item.icon,
    url: item.url,
    isActive: item.isActive,
    groupId: item.groupId,
    order: item.order
  };

  if (item.items) {
    navMainItem.items = item.items.map(subItem => ({
      id: subItem.id,
      title: subItem.title,
      url: subItem.url,
      parentId: subItem.parentId,
      order: subItem.order
    }));
  }

  return navMainItem;
};

export const convertNavMainToShared = (item: NavMainMenuItem): MenuItem => {
  const sharedItem: MenuItem = {
    id: item.id,
    title: item.title,
    icon: item.icon,
    url: item.url,
    isActive: item.isActive,
    groupId: item.groupId,
    order: item.order
  };

  if (item.items) {
    sharedItem.items = item.items.map(subItem => ({
      id: subItem.id,
      title: subItem.title,
      url: subItem.url,
      parentId: subItem.parentId,
      order: subItem.order
    }));
  }

  return sharedItem;
};

export const convertNavMainSubToShared = (item: NavMainSubMenuItem): SubMenuItem => ({
  id: item.id,
  title: item.title,
  url: item.url,
  parentId: item.parentId,
  order: item.order
});

export const convertSharedSubToNavMain = (item: SubMenuItem): NavMainSubMenuItem => ({
  id: item.id,
  title: item.title,
  url: item.url,
  parentId: item.parentId,
  order: item.order
});
