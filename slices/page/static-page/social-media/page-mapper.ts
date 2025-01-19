// Define the mapping between file names and route IDs
const routeMapping: Record<string, string> = {
  'PostManagement': 'posts',
  'OverviewPage': 'overview',
  'settings': 'settings',
  'AdvancedAnalytics': 'analytics',
  'CalendarView': 'calendar',
  'ArchivedPosts': 'archived'
};

import dynamic from 'next/dynamic';

// Define the mapping between route IDs and their dynamic components
export function getPageComponents() {
  return {
    'posts': dynamic(() => import('./pages/SocialMedia-PostManagement')),
    'overview': dynamic(() => import('./pages/SocialMedia-OverviewPage')),
    'settings': dynamic(() => import('./pages/SocialMedia-settings')),
    'analytics': dynamic(() => import('./pages/SocialMedia-AdvancedAnalytics')),
    'calendar': dynamic(() => import('./pages/SocialMedia-CalendarView'))
  };
}
