export interface EngagementData {
  date: string;
  platform: string;
  total: number;
  followers: number;
  nonFollowers: number;
}

export const engagementData: EngagementData[] = [
  {
    date: "2024-01-01",
    platform: "instagram",
    total: 500,
    followers: 400,
    nonFollowers: 100
  },
  {
    date: "2024-01-02",
    platform: "facebook",
    total: 800,
    followers: 600,
    nonFollowers: 200
  },
  {
    date: "2024-01-03",
    platform: "linkedin",
    total: 300,
    followers: 250,
    nonFollowers: 50
  }
];