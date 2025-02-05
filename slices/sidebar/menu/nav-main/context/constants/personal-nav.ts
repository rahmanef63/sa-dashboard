import { MenuItem } from '@/slices/sidebar/menu/types/';

export const PERSONAL_NAV_ITEMS: MenuItem[] = [
  {
    id: 'personal-schedule',
    title: 'Daily Schedule',
    icon: 'Calendar',
    menuType: 'personal',
    dashboardId: 'personal-dashboard',
    url: { href: '/personal/schedule' },
  },
  {
    id: 'personal-reminders',
    title: 'Important Reminders',
    url: { href: '/personal/reminders' },
    icon: 'Bell',
    menuType: 'personal',
    dashboardId: 'personal-dashboard'
  },
  {
    id: 'personal-actions',
    title: 'Quick Actions',
    url: { href: '/personal/actions' },
    icon: 'Zap',
    menuType: 'personal',
    dashboardId: 'personal-dashboard'
  },
  {
    id: 'personal-metrics',
    title: 'Key Metrics',
    url: { href: '/personal/metrics' },
    icon: 'BarChart',
    menuType: 'personal',
    dashboardId: 'personal-dashboard'
  },
  {
    id: 'personal-weather',
    title: 'Weather',
    url: { href: '/personal/weather' },
    icon: 'Cloud',
    menuType: 'personal',
    dashboardId: 'personal-dashboard'
  },
  {
    id: 'personal-news',
    title: 'News Feed',
    url: { href: '/personal/news' },
    icon: 'Newspaper',
    menuType: 'personal',
    dashboardId: 'personal-dashboard'
  },
  {
    id: 'personal-settings',
    title: 'Settings & Integration',
    url: { href: '/personal/settings' },
    icon: 'Settings',
    menuType: 'personal',
    dashboardId: 'personal-dashboard',
    isCollapsible: true,
    children: [
      {
        id: 'personal-settings-customization',
        title: 'Dashboard Customization',
        url: { href: '/personal/settings/customization' },
        icon: 'Palette'
      },
      {
        id: 'personal-settings-notifications',
        title: 'Notifications',
        url: { href: '/personal/settings/notifications' },
        icon: 'Bell'
      },
      {
        id: 'personal-settings-calendar',
        title: 'Calendar Integration',
        url: { href: '/personal/settings/calendar' },
        icon: 'Calendar'
      },
      {
        id: 'personal-settings-connections',
        title: 'App Connections',
        url: { href: '/personal/settings/connections' },
        icon: 'Link'
      },
      {
        id: 'personal-settings-backup',
        title: 'Backup Settings',
        url: { href: '/personal/settings/backup' },
        icon: 'Save'
      },
      {
        id: 'personal-settings-privacy',
        title: 'Privacy Controls',
        url: { href: '/personal/settings/privacy' },
        icon: 'Shield'
      }
    ]
  }
];