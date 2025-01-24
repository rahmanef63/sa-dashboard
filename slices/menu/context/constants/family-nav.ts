import { MenuItemWithChildren } from '@/shared/types/navigation-types';

export const FAMILY_NAV_ITEMS: MenuItemWithChildren[] = [
  {
    id: 'family-calendar',
    title: 'Family Calendar',
    url: { href: '/family/calendar' },
    icon: 'Calendar'
  },
  {
    id: 'family-contacts',
    title: 'Contact Directory',
    url: { href: '/family/contacts' },
    icon: 'Users'
  },
  {
    id: 'family-events',
    title: 'Event Planning',
    url: { href: '/family/events' },
    icon: 'Calendar'
  },
  {
    id: 'family-gifts',
    title: 'Gift Lists',
    url: { href: '/family/gifts' },
    icon: 'Gift'
  },
  {
    id: 'family-tasks',
    title: 'Shared Tasks',
    url: { href: '/family/tasks' },
    icon: 'CheckSquare'
  },
  {
    id: 'family-dates',
    title: 'Important Dates',
    url: { href: '/family/dates' },
    icon: 'Star'
  }
];
