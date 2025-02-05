import { DigitalNavItems, MenuItem } from '@/slices/sidebar/menu/types/';

export const DIGITAL_NAV_ITEMS: DigitalNavItems = [
  {
    id: 'digital-passwords',
    title: 'Password Manager',
    url: { href: '/digital/passwords' },
    icon: 'Lock',
    menuType: 'digital',
    dashboardId: 'digital-dashboard'
  },
  {
    id: 'digital-storage',
    title: 'Cloud Storage',
    url: { href: '/digital/storage' },
    icon: 'Cloud',
    menuType: 'digital',
    dashboardId: 'digital-dashboard'
  },
  {
    id: 'digital-devices',
    title: 'Device Management',
    url: { href: '/digital/devices' },
    icon: 'Smartphone',
    menuType: 'digital',
    dashboardId: 'digital-dashboard'
  },
  {
    id: 'digital-assets',
    title: 'Digital Assets',
    url: { href: '/digital/assets' },
    icon: 'Database',
    menuType: 'digital',
    dashboardId: 'digital-dashboard'
  },
  {
    id: 'digital-subscriptions',
    title: 'Subscriptions',
    url: { href: '/digital/subscriptions' },
    icon: 'RefreshCw',
    menuType: 'digital',
    dashboardId: 'digital-dashboard'
  },
  {
    id: 'digital-backup',
    title: 'Backup Status',
    url: { href: '/digital/backup' },
    icon: 'Save',
    menuType: 'digital',
    dashboardId: 'digital-dashboard'
  }
];
