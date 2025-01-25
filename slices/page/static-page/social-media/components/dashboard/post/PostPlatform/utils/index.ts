import { PLATFORMS } from "slices/page/static-page/social-media/data/social-manager/platform-list";

export const getPlatformIcon = (platformId: string) => {
  const platform = PLATFORMS.find(p => p.id === platformId);
  return platform ? platform.icon : null;
};

export const getPlatformColor = (platformId: string) => {
  const platform = PLATFORMS.find(p => p.id === platformId);
  return platform ? platform.color : null;
};