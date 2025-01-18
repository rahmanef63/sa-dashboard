import { socialMediaPlatforms } from "../../FormAnalytics/SocialMediaSelect";

export const profileData = socialMediaPlatforms.map(platform => [
  {
    date: "Mon",
    platform: platform.id,
    visits: 300 + Math.random() * 100,
    linkTaps: 80 + Math.random() * 30,
    addressTaps: 40 + Math.random() * 20,
    follows: 120 + Math.random() * 40,
  },
  {
    date: "Tue",
    platform: platform.id,
    visits: 280 + Math.random() * 100,
    linkTaps: 75 + Math.random() * 30,
    addressTaps: 35 + Math.random() * 20,
    follows: 110 + Math.random() * 40,
  },
]).flat();