export interface NavigationData {
  date: string;
  platform: string;
  forward: number;
  exited: number;
  nextStory: number;
  lookBack: number;
}

export const navigationData: NavigationData[] = [
  {
    date: "2024-01-01",
    platform: "instagram",
    forward: 300,
    exited: 50,
    nextStory: 200,
    lookBack: 100
  },
  {
    date: "2024-01-02",
    platform: "facebook",
    forward: 400,
    exited: 80,
    nextStory: 250,
    lookBack: 150
  },
  {
    date: "2024-01-03",
    platform: "linkedin",
    forward: 200,
    exited: 40,
    nextStory: 120,
    lookBack: 80
  }
];