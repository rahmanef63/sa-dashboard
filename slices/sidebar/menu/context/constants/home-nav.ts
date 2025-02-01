import { HomeNavItems, MenuItemWithChildren } from '@/shared/types/navigation-types';

export const HOME_NAV_ITEMS: HomeNavItems = [
  {
    id: 'home-overview',
    title: 'Home Overview',
    url: { href: '/home/overview' },
    icon: 'Home',
    menuType: 'home',
    dashboardId: 'home-dashboard'
  },
  {
    id: 'home-maintenance',
    title: 'Maintenance',
    url: { href: '/home/maintenance' },
    icon: 'Tool',
    menuType: 'home',
    dashboardId: 'home-dashboard'
  },
  {
    id: 'home-inventory',
    title: 'Home Inventory',
    url: { href: '/home/inventory' },
    icon: 'Package',
    menuType: 'home',
    dashboardId: 'home-dashboard'
  },
  {
    id: 'home-utilities',
    title: 'Utilities',
    url: { href: '/home/utilities' },
    icon: 'Zap',
    menuType: 'home',
    dashboardId: 'home-dashboard'
  },
  {
    id: 'home-security',
    title: 'Security',
    url: { href: '/home/security' },
    icon: 'Shield',
    menuType: 'home',
    dashboardId: 'home-dashboard'
  },
  {
    id: 'home-documents',
    title: 'Documents',
    url: { href: '/home/documents' },
    icon: 'FileText',
    menuType: 'home',
    dashboardId: 'home-dashboard'
  }
];
