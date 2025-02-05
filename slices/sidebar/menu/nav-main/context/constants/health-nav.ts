import { HealthNavItems, MenuItem } from '@/slices/sidebar/menu/types/';

export const HEALTH_NAV_ITEMS: HealthNavItems = [
  {
    id: 'health-overview',
    title: 'Health Overview',
    url: { href: '/health/overview' },
    icon: 'Activity',
    menuType: 'health',
    dashboardId: 'health-dashboard'
  },
  {
    id: 'health-fitness',
    title: 'Fitness Tracking',
    url: { href: '/health/fitness' },
    icon: 'Heart',
    menuType: 'health',
    dashboardId: 'health-dashboard'
  },
  {
    id: 'health-nutrition',
    title: 'Nutrition',
    url: { href: '/health/nutrition' },
    icon: 'Apple',
    menuType: 'health',
    dashboardId: 'health-dashboard'
  },
  {
    id: 'health-appointments',
    title: 'Medical Appointments',
    url: { href: '/health/appointments' },
    icon: 'Calendar',
    menuType: 'health',
    dashboardId: 'health-dashboard'
  },
  {
    id: 'health-records',
    title: 'Medical Records',
    url: { href: '/health/records' },
    icon: 'FileText',
    menuType: 'health',
    dashboardId: 'health-dashboard'
  },
  {
    id: 'health-medications',
    title: 'Medications',
    url: { href: '/health/medications' },
    icon: 'Pill',
    menuType: 'health',
    dashboardId: 'health-dashboard'
  }
];
