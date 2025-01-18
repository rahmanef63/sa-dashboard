import { reachData } from './constants/reach';
import { engagementData } from './constants/engagement';
import { navigationData } from './constants/navigation';
import { profileData } from './constants/profile';

export const analyticsData = [
  ...reachData.map(data => ({
    date: data.date,
    platform: data.platform,
    reach: {
      total: data.total,
      followers: data.followers,
      nonFollowers: data.nonFollowers,
    },
  })),
  ...engagementData.map(data => ({
    date: data.date,
    platform: data.platform,
    engagement: {
      total: data.total,
      followers: data.followers,
      nonFollowers: data.nonFollowers,
    },
  })),
  ...navigationData.map(data => ({
    date: data.date,
    platform: data.platform,
    navigation: {
      forward: data.forward,
      exited: data.exited,
      nextStory: data.nextStory,
      lookBack: data.lookBack,
    },
  })),
  ...profileData.map(data => ({
    date: data.date,
    platform: data.platform,
    profile: {
      visits: data.visits,
      linkTaps: data.linkTaps,
      addressTaps: data.addressTaps,
      follows: data.follows,
    },
  })),
];