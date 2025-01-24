import { MenuItemWithChildren } from '@/shared/types/navigation-types';

export const HEALTH_NAV_ITEMS: MenuItemWithChildren[] = [
  {
    id: 'health-fitness',
    title: 'Fitness Tracking',
    url: { href: '/health/fitness' },
    icon: 'Activity'
  },
  {
    id: 'health-meals',
    title: 'Meal Planning',
    url: { href: '/health/meals' },
    icon: 'Utensils'
  },
  {
    id: 'health-medical',
    title: 'Medical Records',
    url: { href: '/health/medical' },
    icon: 'FileText'
  },
  {
    id: 'health-mental',
    title: 'Mental Health',
    url: { href: '/health/mental' },
    icon: 'Heart'
  },
  {
    id: 'health-sleep',
    title: 'Sleep Analytics',
    url: { href: '/health/sleep' },
    icon: 'Moon'
  },
  {
    id: 'health-appointments',
    title: 'Appointments',
    url: { href: '/health/appointments' },
    icon: 'Calendar'
  }
];
