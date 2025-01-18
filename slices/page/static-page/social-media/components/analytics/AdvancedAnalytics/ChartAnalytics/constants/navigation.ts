import { socialMediaPlatforms } from "../../FormAnalytics/SocialMediaSelect";

export const navigationData = socialMediaPlatforms.map(platform => [
  {
    date: "Mon",
    platform: platform.id,
    forward: 400 + Math.random() * 100,
    exited: 100 + Math.random() * 50,
    nextStory: 250 + Math.random() * 75,
    lookBack: 50 + Math.random() * 25,
  },
  {
    date: "Tue",
    platform: platform.id,
    forward: 380 + Math.random() * 100,
    exited: 90 + Math.random() * 50,
    nextStory: 230 + Math.random() * 75,
    lookBack: 45 + Math.random() * 25,
  },
]).flat();