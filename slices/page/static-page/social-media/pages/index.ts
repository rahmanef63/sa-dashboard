export { default as SocialMediaAdvancedAnalytics } from './SocialMedia-AdvancedAnalytics';
export { default as SocialMediaCalendarView } from './SocialMedia-CalendarView';
export { default as SocialMediaOverviewPage } from './SocialMedia-OverviewPage';
export { default as SocialMediaPostManagement } from './SocialMedia-PostManagement';
export { default as SocialMediaSettings } from './SocialMedia-settings';

export const pageComponents = {
  'posts': './SocialMedia-PostManagement',
  'overview': './SocialMedia-OverviewPage',
  'settings': './SocialMedia-settings',
  'analytics': './SocialMedia-AdvancedAnalytics',
  'calendar': './SocialMedia-CalendarView'
} as const;