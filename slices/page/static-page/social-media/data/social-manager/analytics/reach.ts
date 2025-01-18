export interface ReachData {
  date: string;
  platform: string;
  total: number;
  followers: number;
  nonFollowers: number;
}

export const reachData: ReachData[] = [
  {
    date: "2024-01-01",
    platform: "instagram",
    total: 1500,
    followers: 1000,
    nonFollowers: 500
  },
  {
    date: "2024-01-02",
    platform: "facebook",
    total: 2500,
    followers: 1800,
    nonFollowers: 700
  },
  {
    date: "2024-01-03",
    platform: "linkedin",
    total: 800,
    followers: 600,
    nonFollowers: 200
  }
];