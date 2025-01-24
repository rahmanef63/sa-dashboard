import { MenuItemWithChildren } from '@/shared/types/navigation-types';

export const HOBBIES_NAV_ITEMS: MenuItemWithChildren[] = [
  {
    id: 'hobbies-projects',
    title: 'Project Tracking',
    url: { href: '/hobbies/projects' },
    icon: 'Trello'
  },
  {
    id: 'hobbies-equipment',
    title: 'Equipment Inventory',
    url: { href: '/hobbies/equipment' },
    icon: 'Package'
  },
  {
    id: 'hobbies-gallery',
    title: 'Progress Gallery',
    url: { href: '/hobbies/gallery' },
    icon: 'Image'
  },
  {
    id: 'hobbies-community',
    title: 'Community Connections',
    url: { href: '/hobbies/community' },
    icon: 'Users'
  },
  {
    id: 'hobbies-events',
    title: 'Event Calendar',
    url: { href: '/hobbies/events' },
    icon: 'Calendar'
  },
  {
    id: 'hobbies-resources',
    title: 'Resources & Ideas',
    url: { href: '/hobbies/resources' },
    icon: 'Lightbulb'
  }
];
