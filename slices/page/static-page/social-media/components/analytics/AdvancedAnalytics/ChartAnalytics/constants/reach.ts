import { socialMediaPlatforms } from "../../FormAnalytics/SocialMediaSelect";

export const reachData = socialMediaPlatforms.map(platform => [
  {
    date: "Mon",
    platform: platform.id,
    total: 4000 + Math.random() * 1000,
    followers: 2500 + Math.random() * 500,
    nonFollowers: 1500 + Math.random() * 500,
  },
  {
    date: "Tue",
    platform: platform.id,
    total: 3500 + Math.random() * 1000,
    followers: 2200 + Math.random() * 500,
    nonFollowers: 1300 + Math.random() * 500,
  },
]).flat();