import { MenuItemWithChildren } from '@/shared/types/navigation-types';

export const DIGITAL_NAV_ITEMS: MenuItemWithChildren[] = [
  {
    id: 'digital-passwords',
    title: 'Password Manager',
    url: { href: '/digital/passwords' },
    icon: 'Lock'
  },
  {
    id: 'digital-storage',
    title: 'Cloud Storage',
    url: { href: '/digital/storage' },
    icon: 'Cloud'
  },
  {
    id: 'digital-devices',
    title: 'Device Management',
    url: { href: '/digital/devices' },
    icon: 'Smartphone'
  },
  {
    id: 'digital-assets',
    title: 'Digital Assets',
    url: { href: '/digital/assets' },
    icon: 'Database'
  },
  {
    id: 'digital-subscriptions',
    title: 'Subscriptions',
    url: { href: '/digital/subscriptions' },
    icon: 'RefreshCw'
  },
  {
    id: 'digital-backup',
    title: 'Backup Status',
    url: { href: '/digital/backup' },
    icon: 'Save'
  }
];
