import { TravelNavItems, MenuItem } from '@/slices/sidebar/menu/types/';

export const TRAVEL_NAV_ITEMS: TravelNavItems = [
  {
    id: 'travel-overview',
    title: 'Travel Overview',
    url: { href: '/travel/overview' },
    icon: 'Globe',
    menuType: 'travel',
    dashboardId: 'travel-dashboard'
  },
  {
    id: 'travel-trips',
    title: 'Trip Planning',
    url: { href: '/travel/trips' },
    icon: 'Map',
    menuType: 'travel',
    dashboardId: 'travel-dashboard',
    isCollapsible: true,
    children: [
      {
        id: 'travel-trips-upcoming',
        title: 'Upcoming Trips',
        url: { href: '/travel/trips/upcoming' },
        icon: 'Calendar',
        menuType: 'travel',
        dashboardId: 'travel-dashboard'
      },
      {
        id: 'travel-trips-past',
        title: 'Past Trips',
        url: { href: '/travel/trips/past' },
        icon: 'Archive',
        menuType: 'travel',
        dashboardId: 'travel-dashboard'
      }
    ]
  },
  {
    id: 'travel-bookings',
    title: 'Bookings',
    url: { href: '/travel/bookings' },
    icon: 'Ticket',
    menuType: 'travel',
    dashboardId: 'travel-dashboard'
  },
  {
    id: 'travel-documents',
    title: 'Travel Documents',
    url: { href: '/travel/documents' },
    icon: 'FileText',
    menuType: 'travel',
    dashboardId: 'travel-dashboard'
  },
  {
    id: 'travel-expenses',
    title: 'Travel Expenses',
    url: { href: '/travel/expenses' },
    icon: 'CreditCard',
    menuType: 'travel',
    dashboardId: 'travel-dashboard'
  },
  {
    id: 'travel-photos',
    title: 'Travel Photos',
    url: { href: '/travel/photos' },
    icon: 'Camera',
    menuType: 'travel',
    dashboardId: 'travel-dashboard'
  }
];
