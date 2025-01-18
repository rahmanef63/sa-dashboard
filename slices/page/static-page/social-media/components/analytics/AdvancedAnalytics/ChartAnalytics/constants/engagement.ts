import { socialMediaPlatforms } from "../../FormAnalytics/SocialMediaSelect";

export const engagementData = socialMediaPlatforms.map(platform => [
  {
    date: "Mon",
    platform: platform.id,
    total: 2400 + Math.random() * 500,
    followers: 1800 + Math.random() * 300,
    nonFollowers: 600 + Math.random() * 200,
  },
  {
    date: "Tue",
    platform: platform.id,
    total: 2100 + Math.random() * 500,
    followers: 1600 + Math.random() * 300,
    nonFollowers: 500 + Math.random() * 200,
  },
]).flat();