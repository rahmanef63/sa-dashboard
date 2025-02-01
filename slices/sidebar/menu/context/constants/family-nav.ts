import { FamilyNavItems, MenuItemWithChildren } from '@/shared/types/navigation-types';

export const FAMILY_NAV_ITEMS: FamilyNavItems = [
  {
    id: 'family-calendar',
    title: 'Family Calendar',
    url: { href: '/family/calendar' },
    icon: 'Calendar',
    menuType: 'family',
    dashboardId: 'family-dashboard'
  },
  {
    id: 'family-tasks',
    title: 'Family Tasks',
    url: { href: '/family/tasks' },
    icon: 'CheckSquare',
    menuType: 'family',
    dashboardId: 'family-dashboard'
  },
  {
    id: 'family-photos',
    title: 'Family Photos',
    url: { href: '/family/photos' },
    icon: 'Image',
    menuType: 'family',
    dashboardId: 'family-dashboard'
  },
  {
    id: 'family-contacts',
    title: 'Family Contacts',
    url: { href: '/family/contacts' },
    icon: 'Users',
    menuType: 'family',
    dashboardId: 'family-dashboard'
  },
  {
    id: 'family-events',
    title: 'Family Events',
    url: { href: '/family/events' },
    icon: 'PartyPopper',
    menuType: 'family',
    dashboardId: 'family-dashboard'
  }
];
