import { MenuItemWithChildren } from '@/shared/types/navigation-types';

export const TRAVEL_NAV_ITEMS: MenuItemWithChildren[] = [
  {
    id: 'travel-planning',
    title: 'Trip Planning',
    url: { href: '/travel/planning' },
    icon: 'Map'
  },
  {
    id: 'travel-itineraries',
    title: 'Itineraries',
    url: { href: '/travel/itineraries' },
    icon: 'List'
  },
  {
    id: 'travel-bookings',
    title: 'Bookings',
    url: { href: '/travel/bookings' },
    icon: 'Bookmark'
  },
  {
    id: 'travel-documents',
    title: 'Travel Documents',
    url: { href: '/travel/documents' },
    icon: 'FileText'
  },
  {
    id: 'travel-expenses',
    title: 'Expenses',
    url: { href: '/travel/expenses' },
    icon: 'DollarSign'
  },
  {
    id: 'travel-journal',
    title: 'Travel Journal',
    url: { href: '/travel/journal' },
    icon: 'Book'
  },
  {
    id: 'travel-photos',
    title: 'Photos & Memories',
    url: { href: '/travel/photos' },
    icon: 'Camera'
  }
];
