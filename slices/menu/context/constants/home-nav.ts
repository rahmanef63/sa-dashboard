import { MenuItemWithChildren } from '@/shared/types/navigation-types';

export const HOME_NAV_ITEMS: MenuItemWithChildren[] = [
  {
    id: 'home-maintenance',
    title: 'Maintenance Schedule',
    url: { href: '/home/maintenance' },
    icon: 'Tool'
  },
  {
    id: 'home-inventory',
    title: 'Inventory',
    url: { href: '/home/inventory' },
    icon: 'Package'
  },
  {
    id: 'home-shopping',
    title: 'Shopping Lists',
    url: { href: '/home/shopping' },
    icon: 'ShoppingCart'
  },
  {
    id: 'home-utilities',
    title: 'Utilities',
    url: { href: '/home/utilities' },
    icon: 'Zap'
  },
  {
    id: 'home-documents',
    title: 'Documents',
    url: { href: '/home/documents' },
    icon: 'FileText'
  },
  {
    id: 'home-warranties',
    title: 'Warranties',
    url: { href: '/home/warranties' },
    icon: 'Shield'
  }
];
