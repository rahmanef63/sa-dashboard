import React from 'react';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';

// Define the mapping between route IDs and their dynamic components
export function getPageComponents() {
  return {
    'dashboard': dynamic(() => import('./dashboard/page'), {
      loading: () => <LoadingSpinner />
    }),
    'analytics': dynamic(() => import('./analytics/page'), {
      loading: () => <LoadingSpinner />
    }),
    'settings': dynamic(() => import('./settings/page'), {
      loading: () => <LoadingSpinner />
    }),
    'profile': dynamic(() => import('./profile/page'), {
      loading: () => <LoadingSpinner />
    }),
    'projects': dynamic(() => import('./projects/page'), {
      loading: () => <LoadingSpinner />
    }),
    'tasks': dynamic(() => import('./tasks/page'), {
      loading: () => <LoadingSpinner />
    }),
    'messages': dynamic(() => import('./messages/page'), {
      loading: () => <LoadingSpinner />
    }),
    'calendar': dynamic(() => import('./calendar/page'), {
      loading: () => <LoadingSpinner />
    })
  };
}

// Export type for type safety
export type PageKey = keyof ReturnType<typeof getPageComponents>;
