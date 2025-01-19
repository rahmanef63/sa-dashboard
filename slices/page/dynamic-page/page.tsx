import React from 'react';
import dynamic from 'next/dynamic';

// Define the mapping between route IDs and their dynamic components
export function getPageComponents() {
  return {
    'dashboard': dynamic(() => import('./dashboard/page'), {
      loading: () => <div>Loading...</div>
    }),
    'analytics': dynamic(() => import('./analytics/page'), {
      loading: () => <div>Loading...</div>
    }),
    'settings': dynamic(() => import('./settings/page'), {
      loading: () => <div>Loading...</div>
    }),
    'profile': dynamic(() => import('./profile/page'), {
      loading: () => <div>Loading...</div>
    }),
    'projects': dynamic(() => import('./projects/page'), {
      loading: () => <div>Loading...</div>
    }),
    'tasks': dynamic(() => import('./tasks/page'), {
      loading: () => <div>Loading...</div>
    }),
    'messages': dynamic(() => import('./messages/page'), {
      loading: () => <div>Loading...</div>
    }),
    'calendar': dynamic(() => import('./calendar/page'), {
      loading: () => <div>Loading...</div>
    })
  };
}

// Export type for type safety
export type PageKey = keyof ReturnType<typeof getPageComponents>;
