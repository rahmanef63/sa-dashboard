import { HobbiesNavItems, MenuItemWithChildren } from '@/shared/types/navigation-types';

export const HOBBIES_NAV_ITEMS: HobbiesNavItems = [
  {
    id: 'hobbies-overview',
    title: 'Hobbies Overview',
    url: { href: '/hobbies/overview' },
    icon: 'Palette',
    menuType: 'hobbies',
    dashboardId: 'hobbies-dashboard'
  },
  {
    id: 'hobbies-collection',
    title: 'Collections',
    url: { href: '/hobbies/collections' },
    icon: 'Package',
    menuType: 'hobbies',
    dashboardId: 'hobbies-dashboard'
  },
  {
    id: 'hobbies-projects',
    title: 'Creative Projects',
    url: { href: '/hobbies/projects' },
    icon: 'Brush',
    menuType: 'hobbies',
    dashboardId: 'hobbies-dashboard'
  },
  {
    id: 'hobbies-sports',
    title: 'Sports Activities',
    url: { href: '/hobbies/sports' },
    icon: 'Trophy',
    menuType: 'hobbies',
    dashboardId: 'hobbies-dashboard'
  },
  {
    id: 'hobbies-music',
    title: 'Music',
    url: { href: '/hobbies/music' },
    icon: 'Music',
    menuType: 'hobbies',
    dashboardId: 'hobbies-dashboard'
  },
  {
    id: 'hobbies-reading',
    title: 'Reading List',
    url: { href: '/hobbies/reading' },
    icon: 'BookOpen',
    menuType: 'hobbies',
    dashboardId: 'hobbies-dashboard'
  }
];
