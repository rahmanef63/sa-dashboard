export * from './reach';
export * from './engagement';
export * from './navigation';
export * from './profile';

export const analyticsData = {
  reach: { key: 'reach', label: 'Reach' },
  engagement: { key: 'engagement', label: 'Engagement' },
  navigation: { key: 'navigation', label: 'Navigation' },
  profile: { key: 'profile', label: 'Profile' },
} as const;